# Agent Framework Accessible Learning Hub

> A friendlier learning fork of Microsoft’s Agent Framework with runnable samples for agents, workflows, memory, reasoning, and Azure AI Foundry.

## Overview
- **Purpose:** Lower the barrier to designing production-ready AI agents by pairing distilled notes with small, runnable samples.
- **Upstream alignment:** Mirrors patterns from [microsoft/agent-framework](https://github.com/microsoft/agent-framework) while staying classroom- and workshop-friendly.
- **Focus areas:** Agent quickstarts, workflow orchestration patterns, reasoning demos, memory strategies, and Azure AI Foundry service usage.

## Repository Map
- `01-af-getting-started-agents/` – Small Python agents: first agent, streaming, vision, function calls (single/multi), structured outputs, observability, persistence. Run with `python 01-af-getting-started-agents/00-first-agent.py "Say hi"` after setting env vars.
- `02-af-getting-started-workflows/` – Orchestration playbook plus runnable graphs using `AgentWorkflowBuilder` (concurrent, group chat, handoff, magentic, sequential). Also includes workflow extras (shared state, checkpoints, observability) and doc excerpts under `docu/`.
- `03-af-advanced-reasoning-use-cases/` – Azure OpenAI Responses + reasoning-effort demos, temporal reasoning examples, a FastAPI comparison API (`reasoning_api.py`), and a Vite/Tailwind portal under `reasoning-demos-portal/`.
- `04-foundry-agent-service/` – Minimal Azure AI Foundry agents via the low-level `AgentsClient` and via Agent Framework’s `AzureAIAgentClient` (AAD auth, hard-coded `gpt-4.1` for reliability).
- `05-agent-memory-general/` – Six Responses API memory patterns (stateless history, `previous_response_id`, user/session map, JSON profiles, tool-driven memory, episodic summaries) with usage notes in the folder README.
- `docu/` – PDF references pulled from the official documentation for offline reading.

## Setup
```bash
git clone https://github.com/ozgurguler/agent-framework-ozg.git
cd agent-framework-ozg

python -m venv .venv           # Python 3.10+ recommended
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```
Optional: Node 18+ and yarn/npm if you want to run the `reasoning-demos-portal` frontend.

## Environment
Core Azure OpenAI / Responses settings (save in `.env` or export):
```bash
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

Azure AI Foundry (Agents API) settings used by `04-foundry-agent-service/`:
```bash
AZURE_AI_PROJECT_ENDPOINT=https://<project>.services.ai.azure.com/
# Optional alternative names respected by the samples: AZURE_OPENAI_PROJECT_ENDPOINT, PROJECT_ENDPOINT
# Model deployment env vars are optional because samples default to gpt-4.1:
AZURE_AI_MODEL_DEPLOYMENT_NAME=gpt-4.1
# Auth: az login (DefaultAzureCredential) or project key via AZURE_AI_PROJECT_KEY / PROJECT_KEY
```

OPENAI_API_KEY is supported as a fallback in some samples, but Azure settings are the default path.

## Run Key Samples
- **Agents quickstart:** `python 01-af-getting-started-agents/00-first-agent.py "Write a haiku"` (see folder for streaming, vision, function-calling, and persistence variants).
- **Workflow orchestrations:** from repo root:
  - Concurrent: `python 02-af-getting-started-workflows/orchestrations/01-concurrent/concurrent_workflow_sample.py`
  - Group chat: `python 02-af-getting-started-workflows/orchestrations/02-group-chat/group_chat_sample.py`
  - Handoff: `python 02-af-getting-started-workflows/orchestrations/03-handoff/handoff_sample.py`
  - Magentic: `python 02-af-getting-started-workflows/orchestrations/04-magentic/magentic_sample.py`
  - Sequential: `python 02-af-getting-started-workflows/orchestrations/05-sequential/sequential_sample.py`
- **Workflow extras:** `python 02-af-getting-started-workflows/other_patterns/checkpoints/sample.py` (or swap `checkpoints` for `shared-states`, `workflows-as-agents`, or `observability`).
- **Memory patterns:** e.g., `python 05-agent-memory-general/02_previous_response_id_minimal.py` or `python 05-agent-memory-general/06_episodic_summary_memory.py` after following that folder’s README.
- **Advanced reasoning:** `python 03-af-advanced-reasoning-use-cases/00-first-agent-reasoning.py` (Responses + reasoning_effort). Temporal demos live in `temporal-reasoning-*.py`. Start the comparison API with `uvicorn reasoning_api:app --reload --app-dir 03-af-advanced-reasoning-use-cases`.
- **Azure AI Foundry agents:** `python 04-foundry-agent-service/base_agent_framework_foundry_agent.py "Give me a tip for Foundry"` (requires `az login` and a project endpoint).
- **Frontend portal (optional):**
  ```bash
  cd 03-af-advanced-reasoning-use-cases/reasoning-demos-portal
  yarn install
  yarn dev
  ```

## Troubleshooting
- Import errors: confirm the virtual environment is active and `pip install -r requirements.txt` completed.
- Auth failures: ensure the endpoint is the Project endpoint for Foundry samples; ensure Azure/OpenAI keys or AAD credentials match the resource.
- Slow or stalled runs: reduce completion tokens, verify the deployment name exists, and check for rate limits in the console output.

## Contributing
- Open an issue outlining the gap and the resource you plan to add (code, doc, asset), plus any external prerequisites/licenses.
- Keep filenames descriptive and add a short README to new folders summarizing goals and requirements.
- Reference upstream docs or samples you adapted so newcomers can trace the origin.

## Resources
- [microsoft/agent-framework](https://github.com/microsoft/agent-framework)
- [Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)
- [Azure OpenAI documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- [Microsoft Responsible AI](https://www.microsoft.com/ai/responsible-ai)
- [Introducing Microsoft Agent Framework](https://azure.microsoft.com/en-us/blog/introducing-microsoft-agent-framework/)
