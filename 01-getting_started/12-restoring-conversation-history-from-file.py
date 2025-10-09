# persist_and_resume_responses_min.py
# Minimal demo: create -> talk -> save -> load -> continue (Responses client)

import os, json, asyncio, tempfile
from dotenv import load_dotenv
from agent_framework.azure import AzureOpenAIResponsesClient

load_dotenv()

THREAD_PATH = os.path.join(tempfile.gettempdir(), "agent_thread.json")

async def main():
    # --- Agent (as given) ---
    agent = AzureOpenAIResponsesClient(
        endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        deployment_name=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "v1"),  # ensure v1 for Responses API
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
    ).create_agent(
        name="physicsbot",
        instructions="You are professor in astrophysics",
    )

    # --- Start a thread, run one turn ---
    thread = agent.get_new_thread()
    r1 = await agent.run("Are we in a black hole?", thread=thread)
    print("reply #1:", r1.text)

    # --- Persist the thread to a simple JSON file ---
    state = await thread.serialize()
    with open(THREAD_PATH, "w", encoding="utf-8") as f:
        # default=str keeps this dead-simple if any exotic types appear
        json.dump(state, f, ensure_ascii=False, default=str)
    print("saved thread to:", THREAD_PATH)

    # --- Reload the thread and continue the conversation ---
    with open(THREAD_PATH, "r", encoding="utf-8") as f:
        loaded = json.load(f)

    resumed_thread = await agent.deserialize_thread(loaded)

    # (Optional) tiny “memory signal” – how many messages were restored?
    prior = len(loaded.get("messages", [])) if isinstance(loaded, dict) else 0
    print(f"memory: restored {prior} prior message(s)")

    r2 = await agent.run("Continue that thought in one sentence.", thread=resumed_thread)
    print("reply #2:", r2.text)

if __name__ == "__main__":
    asyncio.run(main())
