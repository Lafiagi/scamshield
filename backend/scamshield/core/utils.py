import requests
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

            report = ScamReport.objects.get(id=report_id)
        except ScamReport.DoesNotExist:
            return {"verified": False, "message": "Report not found"}

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
