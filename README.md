# Agent Framework Accessible Learning Hub

> A friendlier learning fork of Microsoft's Agent Framework, focused on lowering the barriers for students, educators, and indie builders who want to design production-ready AI agents.

## Table of Contents
- [Why This Repository](#why-this-repository)
- [Agent Framework at a Glance](#agent-framework-at-a-glance)
- [What You Can Do Here](#what-you-can-do-here)
- [Quick Start](#quick-start)
- [Learning Path](#learning-path)
- [Working With the Samples](#working-with-the-samples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Resources](#resources)

## Why This Repository
- **Accessibility first**: Documentation, examples, and naming aim to introduce Agent Framework ideas without assuming enterprise experience.
- **Supplement, not replace**: This project mirrors the official [microsoft/agent-framework](https://github.com/microsoft/agent-framework) and is intentionally simpler so you can graduate to the upstream repo confidently.
- **Education ready**: Lightweight dependencies, easy-to-follow notebooks and scripts (coming soon), and suggested curricula designed for workshops or classrooms.

## Agent Framework at a Glance
Microsoft's Agent Framework accelerates the delivery of AI copilots and agents that can plan, reason, and act across plugins and data sources. Key building blocks you will encounter as you explore:
- **Plans and planners** orchestrate multi-step reasoning chains.
- **Memory abstractions** preserve short- and long-term context across sessions.
- **Connectors** let agents call REST APIs, databases, and productivity tools.
- **Evaluation harnesses** keep agent behaviors aligned with business and safety guardrails.

For a full architectural overview, read the official Microsoft documentation: [Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview).

## What You Can Do Here
- Walk through bite-sized tutorials that cover authentication, tool calling, planning, and evaluation.
- Prototype simplified agents with well-commented starter scripts.
- Compare patterns against the upstream samples to understand why certain abstractions exist.
- Share teaching aids (slides, diagrams, labs) that help new developers ramp up quickly.

## Quick Start
```bash
# 1. Clone this repository
git clone https://github.com/ozgurguler/agent-framework-ozg.git
cd agent-framework-ozg

# 2. Create and activate a virtual environment (Python 3.10+ recommended)
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate

# 3. Install core dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

Recommended environment variables when using OpenAI or Azure OpenAI-powered skills:
```bash
export OPENAI_API_KEY="sk-..."
export AZURE_OPENAI_KEY="..."
export AZURE_OPENAI_ENDPOINT="https://YOUR_RESOURCE.openai.azure.com/"
```

## Learning Path
1. **Orientation** – Skim `README.md` and the official overview to understand core vocabulary.
2. **Hello, Agent** – Run the introductory notebook (coming soon) that wires a planner to OpenAI functions.
3. **Tool-Using Agent** – Extend the agent with a simple connector (for example, a weather or news API).
4. **Memory & Context** – Persist conversation state with vector storage or Azure Cosmos DB.
5. **Evaluation** – Add regression and safety tests using the framework's evaluation utilities.
Each stage is intentionally small; advance once you can explain what new abstraction you introduced and why.

## Working With the Samples
- **Notebooks folder (planned)**: Focused, low-noise walkthroughs. Copy and adapt freely.
- **`samples/` directory (planned)**: Script-based agents instrumented with logging and type hints.
- **`docs/` directory (planned)**: Lesson plans, slide decks, and diagrams tailored for workshops.

If you contribute new material, keep filenames descriptive and add a short README inside each subfolder summarizing prerequisites and learning goals.

## Troubleshooting
- `ModuleNotFoundError`: Validate that your virtual environment is active and `pip install -r requirements.txt` completed successfully.
- Authentication failures: Confirm that environment variables match the Azure or OpenAI resource you are targeting and that the key has the correct permissions.
- Planner hangs or slow responses: Reduce max tokens, ensure your LLM endpoint is reachable, and inspect logging output for rate limit warnings.

## Contributing
We welcome documentation improvements, demo scripts, lecture notes, and recorded walkthroughs. Please open an issue describing:
1. What gap you identified.
2. What resource (code, doc, asset) you propose to add or revise.
3. Any external prerequisites or licenses to surface for reviewers.

When submitting pull requests, favor approachable naming, add inline comments only where the reasoning would not be obvious to new learners, and reference the upstream sample or doc you derived from if applicable.

## Resources
- Official repo: [microsoft/agent-framework](https://github.com/microsoft/agent-framework)
- Microsoft Learn path: [Agent Framework Overview](https://learn.microsoft.com/en-us/agent-framework/overview/agent-framework-overview)
- Azure OpenAI: [Service documentation](https://learn.microsoft.com/azure/ai-services/openai/)
- Responsible AI: [Microsoft Responsible AI resources](https://www.microsoft.com/ai/responsible-ai)
