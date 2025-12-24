import os
from typing import Any, Optional

import httpx
from mcp.server.fastmcp import FastMCP
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response


class APIKeyMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: Any, *, header_name: str, api_key: str) -> None:
        super().__init__(app)
        self._header_name = header_name.lower()
        self._api_key = api_key

    async def dispatch(self, request: Request, call_next) -> Response:
        provided = request.headers.get(self._header_name)
        if provided != self._api_key:
            return JSONResponse({"error": "unauthorized"}, status_code=401)
        return await call_next(request)


def _env(name: str, default: Optional[str] = None) -> str:
    value = os.getenv(name, default)
    if value is None or value == "":
        raise RuntimeError(f"Missing required env var: {name}")
    return value


LEDGER_API_URL = _env("LEDGER_API_URL", "http://127.0.0.1:8081").rstrip("/")
LEDGER_API_KEY = _env("LEDGER_API_KEY")
AI_GATEWAY_API_KEY = _env("AI_GATEWAY_API_KEY", "gateway-dev-key")

mcp = FastMCP(
    name="demo-ai-gateway",
    instructions="An example 'AI Gateway' that exposes a REST API as MCP tools with basic governance.",
    host=os.getenv("AI_GATEWAY_HOST", "127.0.0.1"),
    port=int(os.getenv("AI_GATEWAY_PORT", "8787")),
    streamable_http_path="/mcp",
)


async def _client() -> httpx.AsyncClient:
    return httpx.AsyncClient(
        base_url=LEDGER_API_URL,
        headers={"x-internal-api-key": LEDGER_API_KEY},
        timeout=10.0,
    )


@mcp.tool(
    name="ledger_get_balance",
    description="Get the current USD balance for an account_id.",
)
async def ledger_get_balance(account_id: str) -> dict[str, Any]:
    async with await _client() as client:
        resp = await client.get(f"/v1/ledger/balance/{account_id}")
        resp.raise_for_status()
        return resp.json()


@mcp.tool(
    name="ledger_transfer",
    description="Submit a USD transfer between accounts (sensitive; should require approval).",
)
async def ledger_transfer(
    from_account_id: str,
    to_account_id: str,
    amount: float,
    memo: str = "",
) -> dict[str, Any]:
    async with await _client() as client:
        resp = await client.post(
            "/v1/ledger/transfer",
            json={
                "from_account_id": from_account_id,
                "to_account_id": to_account_id,
                "amount": amount,
                "currency": "USD",
                "memo": memo,
            },
        )
        resp.raise_for_status()
        return resp.json()


async def main() -> None:
    app = mcp.streamable_http_app()
    app.add_middleware(APIKeyMiddleware, header_name="x-ai-gateway-key", api_key=AI_GATEWAY_API_KEY)

    import uvicorn

    config = uvicorn.Config(
        app,
        host=os.getenv("AI_GATEWAY_HOST", "127.0.0.1"),
        port=int(os.getenv("AI_GATEWAY_PORT", "8787")),
        log_level=os.getenv("AI_GATEWAY_LOG_LEVEL", "info"),
    )
    server = uvicorn.Server(config)
    await server.serve()


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())

