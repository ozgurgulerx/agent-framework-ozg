# Apps, Agents, and MCP on Azure

### A practical strategy for building secure, scalable agentic systems

This repository documents **Microsoft’s emerging architectural strategy for agentic applications on Azure**, centered around **Model Context Protocol (MCP)**, **Azure AI Foundry**, and **Azure-native compute services**.

The core idea is simple but powerful:

> **Existing apps remain systems of record.
> Agents become systems of action.
> MCP becomes the standard interface between reasoning and execution.**

This repo distills the strategy, architecture patterns, and concrete implementation approaches demonstrated at Microsoft Ignite 2025 (BRK116), with a strong focus on **production readiness, security, and enterprise scalability**.

---

## 1. Why This Matters

Most enterprises run on:

* 10–30 year old codebases
* Rigid, rule-based workflows
* APIs never designed for autonomous reasoning

At the same time:

* LLMs can now **plan, reason, and orchestrate**
* Enterprises want **outcomes**, not chatbots
* AI is moving from *assistive* to *agentic*

The challenge is not intelligence — it is **safe execution at scale**.

Azure’s answer is **not “rewrite everything with agents”**, but:

* **Layer agents on top of existing apps**
* **Constrain agents via tools**
* **Standardize tool access via MCP**
* **Run everything inside a governed Azure control plane**

---

## 2. Core Concepts

### 2.1 Apps (Systems of Record)

* Own business logic, transactions, and data integrity
* Remain authoritative
* Exposed via APIs (often OpenAPI)

**Key principle:**
Apps are *not replaced* by agents — they are **augmented**.

---

### 2.2 Agents (Systems of Action)

Agents are:

* LLM-based reasoning loops
* Capable of planning and delegation
* **Not allowed to act directly**

Think of agents as:

> *Decision-makers without hands*

They must use **tools** to affect the real world.

---

### 2.3 Tools (Execution Boundary)

Tools are the *only* way agents can:

* Call APIs
* Mutate state
* Trigger workflows

On Azure, tools are typically implemented as:

* Azure Functions
* Logic Apps
* Existing APIs (via OpenAPI)

---

### 2.4 Model Context Protocol (MCP)

**MCP is the critical abstraction layer.**

It provides:

* A standard way for agents to discover tools
* A strict execution boundary
* A natural security and audit surface

You can think of MCP as:

> **OpenAPI for agentic systems**

Azure now treats MCP as a **first-class production primitive**.

---

## 3. Azure’s Reference Architecture

┌────────────────────────────┐
│        UI / Client         │
│  (Web, Teams, Mobile, etc) │
└────────────┬───────────────┘
             │
┌────────────▼───────────────┐
│     Agent Runtime          │
│  (Azure AI Foundry)        │
│                            │
│  - Orchestrator Agent      │
│  - Specialist Agents       │
│  - Thread / State Mgmt     │
└────────────┬───────────────┘
             │  MCP
┌────────────▼───────────────┐
│     Tool Layer             │
│                            │
│  - Azure Functions (MCP)   │
│  - Logic Apps (MCP)        │
│  - OpenAPI tools           │
└────────────┬───────────────┘
             │
┌────────────▼───────────────┐
│   Existing Applications    │
│  (ERP, OT, Databases, etc) │
└────────────────────────────┘

---

## 4. Hosting MCP on Azure (Key Insight)

### 4.1 Azure Functions as MCP Servers

Azure Functions are positioned as the **default MCP host**:

* Scale-to-zero
* Stateless
* Cheap
* Event-driven
* Infrastructure-free

Recent additions:

* **MCP extension for Functions (GA)**
* **Bring-your-own MCP SDK**
* **Zero / minimal code MCP servers (config-driven)**

This allows teams to:

* Turn existing logic into tools
* Without rewriting apps
* Without owning infrastructure

---

### 4.2 Security: The Real Breakthrough

One of MCP’s biggest blockers has been **authentication**.

Azure now supports:

* **Easy Auth for MCP servers**
* Native **Entra ID integration**
* Managed Identity end-to-end

This means:

* No custom auth
* No secrets in agents
* Enterprise-grade RBAC
* Auditable tool calls

Security is not bolted on — it is **the spine of the system**.

---

## 5. Agents as a PaaS Workload

Azure AI Foundry Agent Service acts as:

* A **managed runtime for agents**
* A **control plane**, not just an SDK

It provides:

* Agent hosting
* Tool wiring
* Thread logs
* Identity
* Observability
* Governance

Importantly:

* You can bring **your own agent framework**
* Containerize it
* Deploy via `azd`
* Still get Foundry-level governance

Think:

> **App Service, but for agents**

---

## 6. Multi-Agent Composition (No Hardcoded Workflows)

A common production pattern:

* One **orchestrator agent**
* Multiple **specialist agents**

  * Validation
  * Domain reasoning
  * Moderation
  * State mutation

Key point:

* No BPMN
* No rigid DAGs
* Behavior emerges from **tool availability + policy + prompts**

This is a fundamental shift away from RPA-style automation.

---

## 7. Retrofitting Existing Apps (OpenAPI → Agent)

A powerful and practical pattern demonstrated:

* Take an existing app
* Provide its **OpenAPI spec** to an agent
* Secure it via Managed Identity
* The agent can now:

  * Read state
  * Mutate state
  * Orchestrate actions

No backend rewrite required.

This is how agentic systems **enter enterprises quietly and safely**.

---

## 8. Real-World Validation: Industrial AI

The Hitachi example shows:

* Long-lived physical assets (20–30 years)
* IoT + documents stored on Azure
* Multi-agent maintenance system
* MCP tools calling:

  * Azure AI Search
  * Speech
  * Elasticsearch

Outcome:

* Proactive maintenance
* Guided interventions
* Reduced downtime
* Lower infra cost via Functions

This is agentic AI **beyond chat**.

---

## 9. Strategic Takeaways

1. MCP is the real platform bet, not any single agent SDK
2. Azure Functions are becoming the default execution substrate for tools
3. Agents are treated as **untrusted by default**
4. Security and governance are first-class
5. Legacy systems are preserved, not replaced

---

## 10. Who This Repo Is For

* Platform engineers
* Cloud architects
* AI engineers building **real systems**
* Teams moving from PoC → production

If you are looking for:

* Prompt engineering tips → this is not it
* Agent infra patterns → you are in the right place

---

## 11. Next Steps (Suggested Extensions)

* Reference MCP server templates (Functions / Logic Apps)
* Agent orchestration patterns
* Policy + guardrail design
* Observability and evaluation
* Cost modeling for agentic workloads

---

## References

* Microsoft Ignite 2025 – *Apps, Agents, and MCP is the AI innovation recipe (BRK116)*
* Azure AI Foundry
* Model Context Protocol (MCP)

---

> **Agents don’t replace apps.
> They sit above them — and MCP is the contract that keeps everyone honest.**
