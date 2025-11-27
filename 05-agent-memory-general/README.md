# Supply-Chain Planner Copilot with Long-Term Memory

This demo shows how to pair the Agent Framework chat agent with Mem0 long-term memory backed by Azure AI Search. A planner copilot agent uses Azure OpenAI for chat, Mem0 + Azure AI Search for episodic recall, and a custom context provider to inject prior incidents into new conversations.

The script (`20_repo.py`) runs three scenes: first incident with no memories, a follow-up that writes the playbook into Mem0, and a fresh session that automatically recalls that playbook.

## Architecture
- **Agent Framework ChatAgent** powered by **Azure OpenAI chat**.
- **Mem0 Memory (open-source)** configured with **Azure AI Search** vector store + **Azure OpenAI embeddings**.
- **Custom ContextProvider** (`Mem0EpisodeContextProvider`) that searches Mem0 before each turn and writes a combined user/assistant summary after each turn.

## Prerequisites
- Python 3.10+
- Azure OpenAI resource with:
  - Chat deployment (`AZURE_OPENAI_DEPLOYMENT_NAME`) — ensure it is a chat-capable model and the API version matches your resource (e.g., `v1`)
  - Embedding deployment (`AZURE_TEXT_EMBEDDING_DEPLOYMENT_NAME`)
- Azure AI Search service (`AZURE_SEARCH_SERVICE_NAME` *or* `AZURE_SEARCH_ENDPOINT`, plus `AZURE_SEARCH_ADMIN_KEY`, `AZURE_SEARCH_INDEX_NAME` or `AZURE_SEARCH_COLLECTION_NAME`)
- Env var `MEM0_DEMO_USER_ID` (or `MEM0_USER_ID`) for the logical user id; defaults to `user-ozgur` if unset
- Packages: `agent-framework`, `mem0`, `azure-search-documents`, `python-dotenv`

## Setup
1. Create and activate a virtual environment: `python -m venv .venv && source .venv/bin/activate` (or Windows equivalent).
2. Install dependencies: `pip install -r requirements.txt` (or install the packages listed above directly).
3. Copy `config_example.env` to `.env` and fill in your Azure and Mem0 values.

## Run
```bash
python 20_repo.py
```

## What to watch for
- **Scene 1:** No memories yet; mem0 search should be empty.
- **Scene 2:** The “playbook” for SKU 123 is written to Mem0 (see add + verification logs).
- **Scene 3:** New thread/session automatically retrieves that memory and uses it in the response.
- If you see a 404 from Azure OpenAI, double-check the chat deployment name and API version env vars.
