from django.conf import settings
import requests
import json
from datetime import datetime, timedelta
from django.utils import timezone


class SuiClient:
    """
    Client for interacting with the Sui blockchain.
    """

    def __init__(self):
        self.endpoint = settings.SUI_RPC_ENDPOINT
        self.headers = {
            "Content-Type": "application/json",
        }

    def _make_request(self, method, params=None):
        """
        Make a JSON-RPC request to the Sui node.
        """
        if params is None:
            params = []

        payload = {"jsonrpc": "2.0", "id": 1, "method": method, "params": params}

        response = requests.post(
            self.endpoint, headers=self.headers, data=json.dumps(payload)
        )

        response_data = response.json()

        if "error" in response_data:
            raise Exception(f"Sui RPC Error: {response_data['error']}")

        return response_data["result"]

    def get_transaction(self, tx_digest):
        """
        Get transaction details.
        """
        return self._make_request("sui_getTransaction", [tx_digest])

    def get_object(self, object_id):
        """
        Get object details.
        """
        return self._make_request("sui_getObject", [object_id])

    def get_events_by_sender(
        self, sender, event_type=None, start_time=None, end_time=None
    ):
        """
        Get events by sender address.
        """
        if start_time is None:
            start_time = (timezone.now() - timedelta(days=30)).isoformat()

        if end_time is None:
            end_time = timezone.now().isoformat()

        query = {"Sender": sender}

        if event_type:
            query["MoveEventType"] = event_type

        return self._make_request(
            "sui_getEvents", [query, None, 100]  # Cursor  # Limit
        )


def verify_report_on_chain(report_id, sui_object_id):
    """
    Verify that a report exists on the blockchain.
    """
    client = SuiClient()

    try:
        obj = client.get_object(sui_object_id)

        # Check if object exists and is of the right type
        if obj.get("status") != "Exists":
            return False, "Object does not exist on-chain"

        # Check if the object type is a ScamShield Report
        type_info = obj.get("details", {}).get("data", {}).get("type")
        if not type_info or "scam_shield::report_registry::Report" not in type_info:
            return False, "Object is not a ScamShield report"

        # Verify report fields match
        fields = obj.get("details", {}).get("data", {}).get("fields", {})

        # You can add additional checks here to validate the report data

        return True, "Report verified on-chain"
    except Exception as e:
        return False, f"Error verifying report: {str(e)}"


def sync_verification_status(report):
    """
    Sync verification status from the blockchain to the database.
    """
    if not report.sui_object_id:
        return False, "No Sui object ID provided"

    client = SuiClient()

    try:
        obj = client.get_object(report.sui_object_id)

        if obj.get("status") != "Exists":
            return False, "Object does not exist on-chain"

        # Extract verification data from the object
        fields = obj.get("details", {}).get("data", {}).get("fields", {})

        if "status" in fields:
            status_value = fields["status"].get("fields", {}).get("value", 0)

            # Update status based on on-chain data
            if status_value == 0:  # pending
                report.status = "pending"
            elif status_value == 1:  # verified
                report.status = "verified"
            elif status_value == 2:  # rejected
                report.status = "rejected"

            # Update verification counts
            if "verification_count" in fields:
                report.verification_count = int(fields["verification_count"])

            if "rejection_count" in fields:
                report.rejection_count = int(fields["rejection_count"])

            report.save()

            return True, "Report status synced from blockchain"

        return False, "Could not find status field in on-chain data"
    except Exception as e:
        return False, f"Error syncing verification status: {str(e)}"
