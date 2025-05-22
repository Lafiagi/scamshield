import requests
import math
from django.utils import timezone
from core.models import ScamReport

SUI_RPC_URL = "https://fullnode.testnet.sui.io:443"


def verify_sui_transaction(tx_digest: str, report_id: str) -> dict:
    """
    Verifies a Sui transaction and extracts sender, reference_id, and created object_id.

    Args:
        tx_digest (str): The transaction digest hash.
        report_id (str): The UID id of the report.

    Returns:
        dict: {
            'verified': bool,
            'sender': str or None,
            'reference_id': str or None,
            'object_id': str or None,
            'message': str
        }
    """
    print(f"tx Digest: {tx_digest}: report_id:{report_id} ")
    if not tx_digest:
        return {"verified": False, "message": "Missing transaction digest"}

    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "sui_getTransactionBlock",
        "params": [
            tx_digest,
            {
                "showInput": True,
                "showEffects": True,
                "showEvents": True,
                "showObjectChanges": True,
                "showBalanceChanges": True,
            },
        ],
    }

    try:
        res = requests.post(SUI_RPC_URL, json=payload)
        result = res.json()

        if "error" in result:
            return {"verified": False, "message": result["error"].get("message")}

        tx_result = result.get("result", {})
        status_text = tx_result.get("effects", {}).get("status", {}).get("status")

        if status_text != "success":
            return {"verified": False, "message": "Transaction failed or not found"}

        sender = tx_result.get("transaction", {}).get("data", {}).get("sender")

        # Extract created object ID
        created_object_id = None
        object_changes = tx_result.get("objectChanges", [])
        for change in object_changes:
            if change.get("type") == "created":
                created_object_id = change.get("objectId")
                break
        try:
            print(f"Gettting report with id: {report_id}")
            report = ScamReport.objects.get(id=report_id)
        except ScamReport.DoesNotExist:
            print(f"Gettting report with id failed: {report_id}")
            return {"verified": False, "message": "Report not found"}

        print(f"sui object id: {created_object_id}: ")
        report.sui_object_id = created_object_id
        report.save()
        return {
            "verified": True,
            "sender": sender,
            "object_id": created_object_id,
            "message": "Transaction verified successfully",
        }

    except Exception as e:
        return {"verified": False, "message": str(e)}


def compute_weighted_score(report, is_verified=True):
    age_days = (timezone.now() - report.created_at).days
    time_decay = math.exp(-age_days / 60)  # half-life of 60 days

    stake_weight = min(report.stake_amount / 10, 2.0)
    txn_weight = min(float(report.transaction_amount) / 10000, 2.0)

    risk_map = {
        "critical": 1.5,
        "high": 1.2,
        "medium": 1.0,
        "low": 0.8,
    }
    risk_weight = risk_map.get(report.risk_level, 1.0)

    verified_multiplier = 1.0 if is_verified else 0.25  # unverified has 25% weight

    return time_decay * stake_weight * txn_weight * risk_weight * verified_multiplier
