import asyncio
import os
import sys
from typing import Optional

from agent_framework import MCPStreamableHTTPTool
from agent_framework.azure import AzureAIAgentClient
from azure.ai.agents.aio import AgentsClient
from azure.identity.aio import DefaultAzureCredential
from dotenv import load_dotenv

from governance import AuditLogFunctionMiddleware, run_with_tool_approvals


def _env_first(*names: str, default: Optional[str] = None) -> str:
    for name in names:
        val = os.getenv(name)
        if val:
            return val
    if default is not None:
        return default
    raise RuntimeError(f"Missing required environment variable. Tried: {', '.join(names)}")


ALLOWED_MCP_TOOLS = ["ledger_get_balance", "ledger_transfer"]
APPROVAL_MODE = {
    "always_require_approval": ["ledger_transfer"],
    "never_require_approval": ["ledger_get_balance"],
}


async def main(prompt: str) -> None:
    load_dotenv()

    project_endpoint = _env_first("AZURE_AI_PROJECT_ENDPOINT", "AZURE_OPENAI_PROJECT_ENDPOINT", "PROJECT_ENDPOINT")
    model_deployment = _env_first("AZURE_AI_MODEL_DEPLOYMENT_NAME", "MODEL_DEPLOYMENT_NAME", default="gpt-4.1")

    mcp_url = _env_first("AI_GATEWAY_MCP_URL", default="http://127.0.0.1:8787/mcp")
    gateway_key = _env_first("AI_GATEWAY_API_KEY", default="gateway-dev-key")
    auto_approve = os.getenv("AUTO_APPROVE_TOOLS", "false").lower() in {"1", "true", "yes"}

    mcp_tool = MCPStreamableHTTPTool(
        name="ai-gateway",
        url=mcp_url,
        headers={"x-ai-gateway-key": gateway_key},
        allowed_tools=ALLOWED_MCP_TOOLS,
        approval_mode=APPROVAL_MODE,
    )

    async with DefaultAzureCredential() as credential:
        async with AgentsClient(endpoint=project_endpoint, credential=credential, api_version="2025-05-01") as agents:
            async with AzureAIAgentClient(
                agents_client=agents,
                model_deployment_name=model_deployment,
                should_cleanup_agent=True,
            ).create_agent(
                name="FoundryMcpGatewayDemo",
                instructions=(
                    "You are a careful assistant. Use available tools when needed. "
                    "Never invent balances or transfer IDs; call tools."
                ),
                tools=[mcp_tool],
                middleware=[AuditLogFunctionMiddleware()],
            ) as agent:
                text = await run_with_tool_approvals(agent=agent, prompt=prompt, auto_approve=auto_approve)
                print(text)


if __name__ == "__main__":
    user_prompt = " ".join(sys.argv[1:]).strip() or None
    if not user_prompt:
        print("Usage: python3 foundry_agent_with_gateway_tool.py \"<prompt>\"")
        raise SystemExit(2)
    asyncio.run(main(user_prompt))
