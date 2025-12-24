import os
from datetime import datetime, timezone
from typing import Annotated, Literal, Optional

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field


def _require_api_key(x_internal_api_key: Optional[str]) -> None:
    expected = os.getenv("LEDGER_API_KEY", "")
    if not expected:
        raise RuntimeError("Missing LEDGER_API_KEY env var (used to protect the demo REST API).")
    if x_internal_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


app = FastAPI(title="Demo Ledger API", version="0.1.0")


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/v1/ledger/balance/{account_id}")
def get_balance(
    account_id: str,
    x_internal_api_key: Annotated[Optional[str], Header()] = None,
) -> dict[str, object]:
    _require_api_key(x_internal_api_key)
    balance = (abs(hash(account_id)) % 10_000) / 100.0
    return {"account_id": account_id, "currency": "USD", "balance": balance}


class TransferRequest(BaseModel):
    from_account_id: str = Field(min_length=1)
    to_account_id: str = Field(min_length=1)
    amount: float = Field(gt=0)
    currency: Literal["USD"] = "USD"
    memo: str = ""


@app.post("/v1/ledger/transfer")
def transfer(
    body: TransferRequest,
    x_internal_api_key: Annotated[Optional[str], Header()] = None,
) -> dict[str, object]:
    _require_api_key(x_internal_api_key)

    transfer_id = f"tr_{abs(hash((body.from_account_id, body.to_account_id, body.amount, body.memo))) % 1_000_000:06d}"
    now = datetime.now(timezone.utc).isoformat()
    return {
        "transfer_id": transfer_id,
        "status": "submitted",
        "submitted_at": now,
        "details": body.model_dump(),
    }


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("LEDGER_API_HOST", "127.0.0.1")
    port = int(os.getenv("LEDGER_API_PORT", "8081"))
    uvicorn.run(app, host=host, port=port, log_level="info")

