# MCP Tool via “AI Gateway” + Foundry Tools + Governance

This sample demonstrates a pragmatic end-to-end pattern:

1. **Expose a REST API** (a toy “ledger” service).
2. **Wrap that API as MCP tools** behind a lightweight **AI Gateway** (an MCP Streamable HTTP server).
3. **Use the MCP tools from an Azure AI Foundry agent** via Agent Framework.
4. Add **governance**:
   - Authentication (gateway API key)
   - Tool allowlisting (expose only specific tools)
   - Tool-specific approvals (e.g., transfers require explicit approval)
   - Audit logging (agent-side middleware)

## Prereqs
- Python 3.10+
- Install deps: `pip install -r requirements.txt`
- For Foundry run: `az login` and a Foundry Project endpoint (`AZURE_AI_PROJECT_ENDPOINT`)

## 1) Start the upstream REST API (“ledger”)

This is the API you want to “tool-ify”.

```bash
export LEDGER_API_KEY=ledger-dev-key
python3 06-foundry-tools/01-mcp-tool-via-ai-gateway/ledger_api.py
```

## 2) Start the AI Gateway (MCP server over Streamable HTTP)

The gateway exposes the ledger API as MCP tools and enforces an API key.

```bash
export LEDGER_API_URL=http://127.0.0.1:8081
export LEDGER_API_KEY=ledger-dev-key
export AI_GATEWAY_API_KEY=gateway-dev-key
python3 06-foundry-tools/01-mcp-tool-via-ai-gateway/ai_gateway_mcp.py
```

The MCP endpoint is `http://127.0.0.1:8787/mcp`.

## 3) Run a Foundry agent that uses the gateway tools

```bash
export AZURE_AI_PROJECT_ENDPOINT=https://<project>.services.ai.azure.com/
export AZURE_AI_MODEL_DEPLOYMENT_NAME=gpt-4.1
export AI_GATEWAY_MCP_URL=http://127.0.0.1:8787/mcp
export AI_GATEWAY_API_KEY=gateway-dev-key

# Optional: auto-approve sensitive tools (demo only)
export AUTO_APPROVE_TOOLS=false

python3 06-foundry-tools/01-mcp-tool-via-ai-gateway/foundry_agent_with_gateway_tool.py \\
  "Check balance for account acct_123 and then transfer $25 to acct_999."
```

## Governance knobs (what to tweak)
- **Tool allowlist**: `ALLOWED_MCP_TOOLS` in `foundry_agent_with_gateway_tool.py`
- **Approval policy**: `APPROVAL_MODE` in `foundry_agent_with_gateway_tool.py`
- **Auth**:
  - Gateway auth header: `AI_GATEWAY_API_KEY`
  - Upstream API auth header: `LEDGER_API_KEY`
- **Audit logging**: see `AuditLogFunctionMiddleware` in `governance.py`

