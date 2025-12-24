import json
import os
from datetime import datetime, timezone
from typing import Any, Iterable, Optional

from agent_framework import ChatMessage, FunctionApprovalRequestContent, FunctionMiddleware, FunctionInvocationContext


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _redact(value: Any, *, keys: Iterable[str]) -> Any:
    if isinstance(value, dict):
        redacted: dict[str, Any] = {}
        for k, v in value.items():
            if k in set(keys):
                redacted[k] = "[REDACTED]"
            else:
                redacted[k] = _redact(v, keys=keys)
        return redacted
    if isinstance(value, list):
        return [_redact(v, keys=keys) for v in value]
    return value


class AuditLogFunctionMiddleware(FunctionMiddleware):
    def __init__(self, *, log_path: Optional[str] = None) -> None:
        self._log_path = log_path or os.getenv("TOOL_AUDIT_LOG", "")

    async def process(self, context: FunctionInvocationContext, next) -> None:
        started = _utcnow()
        await next(context)
        finished = _utcnow()

        record = {
            "type": "tool_audit",
            "started_at": started,
            "finished_at": finished,
            "tool_name": context.function.name,
            "arguments": _redact(getattr(context.arguments, "model_dump", lambda: context.arguments)(), keys=("api_key",)),
        }

        try:
            record["result"] = _redact(context.result, keys=("api_key",))
        except Exception:
            record["result"] = "[unserializable]"

        line = json.dumps(record, ensure_ascii=False)
        if self._log_path:
            with open(self._log_path, "a", encoding="utf-8") as f:
                f.write(line + "\n")
        else:
            print(line)


async def run_with_tool_approvals(
    *,
    agent,
    prompt: str,
    thread=None,
    auto_approve: bool = False,
) -> str:
    thread = thread or agent.get_new_thread()
    response = await agent.run(prompt, thread=thread)

    while True:
        approval_requests = [r for r in response.user_input_requests if isinstance(r, FunctionApprovalRequestContent)]
        if not approval_requests:
            return response.text

        approval = approval_requests[0]
        call = approval.function_call
        print(f"\nApproval required: tool={call.name} args={call.arguments}")

        if auto_approve:
            approved = True
        else:
            user = input("Approve? [y/N] ").strip().lower()
            approved = user in {"y", "yes"}

        approval_response = approval.create_response(approved=approved)
        response = await agent.run(
            ChatMessage(role="user", contents=[approval_response]),
            thread=thread,
        )

