# 12-restoring-conversation-history-from-file.py
# Minimal: create -> run -> save -> load -> resume (no default=str)

import os, json, asyncio, tempfile
from dotenv import load_dotenv
from agent_framework.azure import AzureOpenAIResponsesClient

load_dotenv()
THREAD_PATH = os.path.join(tempfile.gettempdir(), "agent_thread.json")

async def main():
    # Agent (as given)
    agent = AzureOpenAIResponsesClient(
        endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        deployment_name=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "v1"),
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
    ).create_agent(
        name="physicsbot",
        instructions="You are professor in astrophysics",
    )

    # Start a thread + one turn
    thread = agent.get_new_thread()
    r1 = await agent.run("Are we in a blackhole?", thread=thread)
    print("reply #1:", r1.text)

    # Persist EXACT serialize() output (no default=str!)
    state = await thread.serialize()
    with open(THREAD_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False)
    print("saved thread to:", THREAD_PATH)

    # Reload & resume
    with open(THREAD_PATH, "r", encoding="utf-8") as f:
        loaded = json.load(f)
    resumed_thread = await agent.deserialize_thread(loaded)

    # Tiny memory signal (how many messages were restored)
    prior = len(loaded.get("messages", [])) if isinstance(loaded, dict) else 0
    print(f"memory: restored {prior} prior message(s)")

    r2 = await agent.run("Continue that thought in one sentence.", thread=resumed_thread)
    print("reply #2:", r2.text)

if __name__ == "__main__":
    asyncio.run(main())
