# 🤖 AI Agents Learning Hub

<p align="center">
  <img src="05-agent-memory-general/ai-agents-learning-hub-banner.svg" alt="AI Agents Learning Hub banner" width="100%" />
</p>

> A polished, workshop-ready fork of Microsoft’s Agent Framework with runnable samples for agents, workflows, memory, reasoning, and Azure AI Foundry. This is also the prototyping ground for new features and Microsoft Innovation Hub experiments before they land upstream.

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Azure OpenAI](https://img.shields.io/badge/Azure%20OpenAI-Responses-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)
![Azure AI Foundry](https://img.shields.io/badge/Azure%20AI%20Foundry-Agents-0089D6?style=for-the-badge&logo=azuredevops&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-111?style=for-the-badge)

---

## Why This Repo
- **🚀 Ship faster:** Small, runnable samples with the exact env vars you need.
- **🔗 Stay aligned:** Mirrors [microsoft/agent-framework](https://github.com/microsoft/agent-framework) patterns, trimmed for workshops.
- **🧠 Cover the surface:** Agents, workflows, memory patterns, reasoning, and Azure AI Foundry agents.
- **🧪 Prototype hub:** Most new feature spikes start here, including Microsoft Innovation Hub–driven experiments, before flowing back upstream.

---

## Quick Start
```bash
git clone https://github.com/ozgurguler/agent-framework-ozg.git
cd agent-framework-ozg

python -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -U pip
pip install -r requirements.txt
```
Optional: Node 18+ + yarn/npm for the frontend portal.

### Core Environment (Azure OpenAI / Responses)
```bash
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

### Azure AI Foundry (Agents API)
```bash
AZURE_AI_PROJECT_ENDPOINT=https://<project>.services.ai.azure.com/
AZURE_AI_MODEL_DEPLOYMENT_NAME=gpt-4.1
# Auth: az login (DefaultAzureCredential) or project key via AZURE_AI_PROJECT_KEY
```

OPENAI_API_KEY is honored as a fallback in some samples, but Azure settings are the default path.

---

## Pathfinding Guide (What to run)
- **Agents quickstart:** `python 01-af-getting-started-agents/00-first-agent.py "Write a haiku"`
- **Streaming / vision / tools:** see `01-af-getting-started-agents/` (streaming, vision, single/multi tool calls, structured outputs, observability, persistence).
- **Workflows:**  
  - Concurrent: `python 02-af-getting-started-workflows/orchestrations/01-concurrent/concurrent_workflow_sample.py`  
  - Group chat: `python 02-af-getting-started-workflows/orchestrations/02-group-chat/group_chat_sample.py`  
  - Handoff: `python 02-af-getting-started-workflows/orchestrations/03-handoff/handoff_sample.py`  
  - Magentic: `python 02-af-getting-started-workflows/orchestrations/04-magentic/magentic_sample.py`  
  - Sequential: `python 02-af-getting-started-workflows/orchestrations/05-sequential/sequential_sample.py`
- **Workflow extras:** `python 02-af-getting-started-workflows/other_patterns/checkpoints/sample.py` (swap `checkpoints` for `shared-states`, `workflows-as-agents`, `observability`).
- **Memory patterns (Responses API):** `python 05-agent-memory-general/02_previous_response_id_minimal.py` or `.../06_episodic_summary_memory.py`.
- **Advanced reasoning:** `python 03-af-advanced-reasoning-use-cases/00-first-agent-reasoning.py` (Responses + reasoning_effort) or `temporal-reasoning-*.py`.
- **Azure AI Foundry agents:** `python 04-foundry-agent-service/base_agent_framework_foundry_agent.py "Give me a tip for Foundry"` (requires `az login` + project endpoint).
- **Frontend portal (optional):**
  ```bash
  cd 03-af-advanced-reasoning-use-cases/reasoning-demos-portal
  yarn install
  yarn dev
  ```

---

## Folder Map at a Glance
- `01-af-getting-started-agents/` — First agent, streaming, vision, function calls, structured outputs, observability, persistence.
- `02-af-getting-started-workflows/` — Orchestrations (concurrent, group chat, handoff, magentic, sequential) + extras (shared state, checkpoints, observability) + docs under `docu/`.
- `03-af-advanced-reasoning-use-cases/` — Responses + reasoning demos, temporal reasoning, comparison API (`reasoning_api.py`), Vite/Tailwind portal.
- `04-foundry-agent-service/` — Azure AI Foundry agents via low-level `AgentsClient` and `AzureAIAgentClient` (AAD or key).
- `05-agent-memory-general/` — Six Responses memory patterns: stateless history, `previous_response_id`, session map, JSON profile memory, tool-driven memory, episodic summaries.
- `docu/` — Offline PDF references from official docs.

---

## Troubleshooting (Fast)
- **Imports failing:** Activate `.venv` and reinstall: `pip install -r requirements.txt`.
- **Auth errors:** Confirm endpoints (resource vs project), keys, or AAD login; verify deployment names exist.
- **Slow/stalled runs:** Lower max tokens, verify deployments, check rate-limit messages in the console.

---

## Contributing
- Open an issue describing the gap and the resource you plan to add (code, doc, asset), plus external prerequisites/licenses.
- Keep filenames descriptive; add a brief README to new folders.
- Cite upstream docs or samples you adapted so newcomers can trace origins.

---

## References
- [microsoft/agent-framework](https://github.com/microsoft/agent-framework)
- [Agent Framework overview](https://learn.microsoft.com/agent-framework/overview/agent-framework-overview)
- [Azure OpenAI docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [Responsible AI](https://www.microsoft.com/ai/responsible-ai)
- [Introducing Microsoft Agent Framework](https://azure.microsoft.com/blog/introducing-microsoft-agent-framework/)
