# AI Builder’s Guide to Agent Development with Foundry Agent Service (BRK201)

Build, operate, and scale production-grade AI agents with enterprise governance, observability, and interoperability — without rewriting your code.

This README distills and structures the key concepts, capabilities, and architectural value of **Azure AI Foundry Agent Service**, as presented in the Ignite **BRK201** session. It is intended for experienced builders who want to move beyond demos and ship real, multi-agent systems.

---

## Why Agents (and Why Now)

AI development is shifting from:

- ad-hoc model calls
- brittle prompt chains
- isolated chatbots

Toward **agents as first-class execution units**.

An **agent** is:

- a predefined unit of work
- with predictable inputs and outputs
- that reasons using a model + instructions + tools

Single agents are useful — but real-world systems typically require **multi-agent orchestration**.

The core problem Foundry addresses: **most AI prototypes never survive production**.

---

## What Is Foundry Agent Service?

**Foundry Agent Service** is a managed PaaS runtime for AI agents inside **Microsoft Foundry**.

It provides:

- a secure execution environment
- a control plane for agent fleets
- deep integration with enterprise identity, data, and networking

You can:

- start in minutes (multi-tenant dev)
- scale to production (single-tenant)
- without changing application code

---

## Core Design Principles

### 1) Open by Design

Foundry does not lock you into a proprietary agent model.

Supported interoperability patterns and tool surfaces include:

- **Agent-to-Agent (A2A)**
- **Model Context Protocol (MCP)**
- **OpenAPI tools**
- Popular frameworks (Agent Framework, LangGraph)

Supported languages (as presented):

- Python
- C#
- TypeScript
- Java

Bring your agents — don’t rewrite them.

### 2) Built on the OpenAI Responses API

All agents run on top of the **Responses API**.

Benefits:

- one unified response object
- simpler mental model (no runs / steps / threads)
- automatic compatibility with new model features

Key implication:

- If you’ve migrated from **Chat Completions** → **Responses**, you’re already compatible with Foundry Agent Service.

Foundry layers **enterprise capabilities on top**, rather than replacing your API usage.

---

## Agent Capabilities

### Tools (First-Class)

Agents can use tools such as:

- file search, web search, code interpreter
- Azure AI Search, Fabric, SharePoint
- 1400+ MCP connectors
- custom tools via OpenAPI

### Managed OAuth (Critical Feature)

Agents can:

- act on behalf of the signed-in user
- with explicit approval gates
- without custom token exchange code

This enables secure, delegated enterprise automation.

### Knowledge (Foundry IQ)

Knowledge bases unify:

- Blob Storage
- OneLake
- web sources
- internal documents

The knowledge layer:

- reconciles multiple data sources
- provides grounded context
- removes retrieval complexity from agent logic

Think: **managed RAG with enterprise grounding**.

### Memory (Explicit, Controlled)

Agents can maintain memory across sessions:

- user preferences
- personalization
- conversational state

Memory is:

- opt-in
- auditable
- version-aware

No “magic memory”. Just managed state.

---

## Evaluation, Observability, and Security

### Built-In Evaluation

Evaluate agents for:

- task adherence
- grounding quality
- correctness

Run evaluations:

- locally
- in the cloud

View:

- inputs / outputs
- intermediate context
- scoring results

### Tracing & Monitoring

Foundry provides agent-native observability:

- end-to-end traces
- per-step latency
- token usage
- tool invocation breakdown

This works for:

- prompt agents
- hosted agents
- LangGraph / Agent Framework agents

### AI Red Teaming

An integrated red-teaming agent helps:

- probe vulnerabilities
- test adversarial scenarios
- validate safety boundaries

---

## Deployment Models

### 1) Ephemeral Agents

- defined inline
- not persisted
- ideal for experimentation
- easy model switching (OpenAI ↔ Anthropic)

### 2) Persisted Agents

Persist agents to gain:

- versioning
- playground interaction
- publishing (Teams / M365 Copilot)
- full tracing

No runtime behavior changes — only operational upgrades.

### 3) Hosted Agents (Bring Your Own Code)

Bring existing agents:

- LangGraph
- Agent Framework
- custom logic

Deploy using `azd`:

- containerized
- scalable
- fully observable inside Foundry

You get:

- managed runtime
- integrated telemetry
- no custom plumbing

---

## Multi-Agent Workflows (The Real Power)

Workflows are agents themselves.

Properties:

- same API surface as single agents
- YAML-defined orchestration
- routing, branching, fallbacks
- human escalation

Internally powered by Agent Framework, fully managed.

### Design Rule

Split agents by responsibility or they degrade fast.

### Real-World Pattern (Demonstrated)

Example workflow:

- initial triage agent
- domain specialists (platform, security, data)
- ticketing agent (Azure DevOps via OpenAPI)
- escalation agent (email / human-in-the-loop)

Capabilities shown:

- stateful checkpoints
- automatic ticket creation
- grounded troubleshooting
- human handoff

All traceable. All governed.

---

## Enterprise Architecture Highlights

- multi-tenant dev → single-tenant prod
- bring your own:
  - Cosmos DB
  - Azure AI Search
  - Storage
  - Key Vault
  - VNet injection
  - private endpoints
  - data residency control

Your data stays in your boundary.

---

## When to Use Foundry Agent Service

Use it when you need:

- production-grade agents
- multi-agent systems
- enterprise identity & compliance
- observability beyond logs
- safe scaling without rewrites

It is not just another agent framework.

It is the runtime and control plane for the agentic era.

---

## Key Takeaway

Foundry Agent Service doesn’t change how you build agents. It changes whether they survive production.

---

## Reference

- Microsoft Ignite 2025 — BRK201 (YouTube): https://www.youtube.com/watch?v=7faSLQS501E&list=PLQXpv_NQsPIDKFpgLPXmtPSa15JyCWZKM&index=51
