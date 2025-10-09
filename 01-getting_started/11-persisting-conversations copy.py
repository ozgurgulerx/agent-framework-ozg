# 11-persisting-conversations.py
# Persist an Agent Framework thread; print and reveal the saved file.

import os
import sys
import json
import asyncio
import tempfile
from pathlib import Path
from datetime import datetime, timezone
from collections.abc import Mapping, Sequence
from dotenv import load_dotenv
from agent_framework.azure import AzureOpenAIResponsesClient

load_dotenv()

def to_jsonable(obj):
    """Recursively convert Agent Framework / OpenAI typed objects into JSON-safe data."""
    # Fast path for primitives
    if obj is None or isinstance(obj, (str, int, float, bool)):
        return obj
    # Common typed objects (Pydantic/OpenAI types)
    for method in ("model_dump", "dict", "to_dict"):
        if hasattr(obj, method):
            try:
                return to_jsonable(getattr(obj, method)())
            except Exception:
                pass
    # Mappings
    if isinstance(obj, Mapping):
        return {str(k): to_jsonable(v) for k, v in obj.items()}
    # Sequences (but not strings/bytes)
    if isinstance(obj, Sequence) and not isinstance(obj, (str, bytes, bytearray)):
        return [to_jsonable(x) for x in obj]
    # Bytes
    if isinstance(obj, (bytes, bytearray)):
        return obj.decode("utf-8", "ignore")
    # Dataclasses
    try:
        import dataclasses
        if dataclasses.is_dataclass(obj):
            return to_jsonable(dataclasses.asdict(obj))
    except Exception:
        pass
    # Fallback
    return str(obj)

async def main():
    # Create agent (Responses API => use "v1")
    agent = AzureOpenAIResponsesClient(
        endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        deployment_name=os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"],
        api_version=os.getenv("AZURE_OPENAI_API_VERSION", "v1"),
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
    ).create_agent(
        name="monkey-island-bot",
        instructions="You are Guybrush Threepwood from Monkey Island",
    )

    # New thread
    thread = agent.get_new_thread()

    # Turns
    r1 = await agent.run("Tell me a joke about Monkey Island from LucasArts.", thread=thread)
    print("\n--- reply #1 ---\n" + r1.text)
    r2 = await agent.run("Now add pirate emojis and speak like a parrot.", thread=thread)
    print("\n--- reply #2 ---\n" + r2.text)

    # Serialize thread (returns nested typed objects → make JSON-safe)
    state = await thread.serialize()
    json_safe_state = to_jsonable(state)

    # Choose output dir: AF_RUN_DIR if set, else OS temp dir
    out_dir = Path(os.getenv("AF_RUN_DIR", tempfile.gettempdir()))
    out_dir.mkdir(parents=True, exist_ok=True)

    # Timezone-aware UTC timestamp (no deprecation warning)
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    fpath = out_dir / f"agent_thread_{ts}.json"

    # Write pretty JSON
    fpath.write_text(json.dumps(json_safe_state, ensure_ascii=False, indent=2), encoding="utf-8")

    # >>> Print & reveal location <<<
    print(f"\n✅ Saved thread JSON to: {fpath}")
    print(f"📂 Directory: {out_dir}")
    print(f"📦 File size: {fpath.stat().st_size} bytes")
    print("💡 Tip: set AF_RUN_DIR to persist runs (e.g., export AF_RUN_DIR=$PWD/.af_runs)")

    # Reveal the file
    if sys.platform == "darwin":      # macOS
        os.system(f'open -R "{fpath}"')
    elif os.name == "nt":             # Windows
        os.system(f'explorer /select,"{fpath}"')

if __name__ == "__main__":
    asyncio.run(main())
