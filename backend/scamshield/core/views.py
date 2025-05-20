import requests
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Q, Sum

from .models import ScamReport, Evidence, Verification, ScamTactic, TimelineEvent
from .serializers import (
    ScamReportListSerializer,
    ScamReportDetailSerializer,
    ScamReportCreateSerializer,
    VerificationCreateSerializer,
    EvidenceSerializer,
    VerifyTransactionSerializer
)

SUI_RPC_URL = "https://fullnode.testnet.sui.io:443"

class ScamReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint for ScamShield reports.
    """

    queryset = ScamReport.objects.all().order_by("-created_at")
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return ScamReportCreateSerializer
        elif self.action == "list":
            return ScamReportListSerializer
        return ScamReportDetailSerializer

    def get_queryset(self):
        queryset = ScamReport.objects.all().order_by("-created_at")

        # Filter by status if provided
        status = self.request.query_params.get("status", None)
        if status:
            queryset = queryset.filter(status=status)

        # Filter by scam type if provided
        scam_type = self.request.query_params.get("scam_type", None)
        if scam_type:
            queryset = queryset.filter(scam_type=scam_type)

        # Filter by risk level if provided
        risk_level = self.request.query_params.get("risk_level", None)
        if risk_level:
            queryset = queryset.filter(risk_level=risk_level)

        # Search by title or description
        search = self.request.query_params.get("search", None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )

        # Filter by address (reporter or scammer)
        address = self.request.query_params.get("address", None)
        if address:
            queryset = queryset.filter(
                Q(reporter_address=address) | Q(scammer_address=address)
            )

        # Filter by reporter only
        reporter = self.request.query_params.get("reporter", None)
        if reporter:
            queryset = queryset.filter(reporter_address=reporter)

        return queryset

    def perform_create(self, serializer):
        serializer.save()

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
    )
    def verify(self, request, pk=None):
        """
        Verify or reject a scam report.
        """
        report = self.get_object()

        # Check if user already verified this report
        if Verification.objects.filter(
            report=report, verifier=request.user.wallet_address
        ).exists():
            return Response(
                {"detail": "You have already verified this report"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = VerificationCreateSerializer(
            data=request.data, context={"request": request, "report": report}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def add_evidence(self, request, pk=None):
        """
        Add evidence to an existing report.
        """
        report = self.get_object()

        # Only allow the reporter to add evidence
        if report.reporter_address != request.user.wallet_address:
            return Response(
                {"detail": "Only the reporter can add evidence"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = EvidenceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(report=report)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated]
    )
    def add_scam_tactic(self, request, pk=None):
        """
        Add a scam tactic to an existing report.
        """
        report = self.get_object()

        # Only allow the reporter to add scam tactics
        if report.reporter_address != request.user.wallet_address:
            return Response(
                {"detail": "Only the reporter can add scam tactics"},
                status=status.HTTP_403_FORBIDDEN,
            )

        description = request.data.get("description", None)
        if not description:
            return Response(
                {"detail": "Description is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        tactic = ScamTactic.objects.create(report=report, description=description)
        return Response(
            {"id": tactic.id, "description": tactic.description},
            status=status.HTTP_201_CREATED,
        )


class MyReportsView(generics.ListAPIView):
    """
    API endpoint to list reports submitted by the authenticated user.
    """

    serializer_class = ScamReportListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ScamReport.objects.filter(
            reporter_address=self.request.user.wallet_address
        ).order_by("-created_at")


class PendingVerificationsView(generics.ListAPIView):
    """
    API endpoint to list reports pending verification.
    """

    serializer_class = ScamReportListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Get reports that are pending and within verification period
        return (
            ScamReport.objects.filter(
                status="pending", verification_deadline__gt=timezone.now()
            )
            .exclude(
                # Exclude reports already verified by this user
                verifications__verifier=self.request.user.wallet_address
            )
            .order_by("-created_at")
        )


class DashboardStatsView(APIView):
    """
    Get statistics for the dashboard.
    """

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Total reports
        total_reports = ScamReport.objects.count()
        most_recent_reports = ScamReport.objects.all().order_by("-created_at")[:3]
        # Active verifiers (unique verifiers in the last 30 days)
        thirty_days_ago = timezone.now() - timezone.timedelta(days=60)
        active_verifiers = (
            ScamReport.objects.filter(verifications__timestamp__gte=thirty_days_ago)
            .values("verifications__verifier")
            .distinct()
            .count()
        )

        # Protected wallets (unique reporters + unique verifiers)
        reporters = ScamReport.objects.values("reporter_address").distinct().count()
        verifiers = (
            ScamReport.objects.values("verifications__verifier").distinct().count()
        )
        protected_wallets = reporters + verifiers

        prevented_value_sui = (
            ScamReport.objects.filter(status="verified").aggregate(
                total=Sum("transaction_amount")
            )["total"]
            or 0
        )
        prevented_value_usd = prevented_value_sui

        stats = {
            "totalReports": total_reports,
            "activeVerifiers": active_verifiers,
            "protectedWallets": protected_wallets,
            "preventedValue": (
                f"${prevented_value_usd/1000000:.1f}M"
                if prevented_value_usd >= 1000000
                else f"${prevented_value_usd:.0f}"
            ),
            "recentReports": ScamReportListSerializer(
                most_recent_reports, many=True
            ).data,
        }

        return Response(stats)










class VerifyTransactionView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyTransactionSerializer

    def post(self, request):
        tx_digest = request.data.get("transaction_hash")
        if not tx_digest:
            return Response({"error": "Missing transaction digest"}, status=400)

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
                return Response(
                    {"verified": False, "error": result["error"]}, status=400
                )

            tx_result = result.get("result", {})
            status_text = tx_result.get("effects", {}).get("status", {}).get("status")

            if status_text != "success":
                return Response(
                    {"verified": False, "message": "Transaction failed or not found"}
                )

            sender = tx_result.get("transaction", {}).get("data", {}).get("sender")
            transaction_inputs = (
                tx_result.get("transaction", {})
                .get("data", {})
                .get("transaction", {})
                .get("inputs", [])
            )

            # Optional reference_id logic (from string-type inputs)
            reference_id = None
            for txn_input in transaction_inputs:
                if (
                    txn_input.get("type") == "pure"
                    and txn_input.get("valueType", "").endswith("String")
                ):
                    value = txn_input.get("value", "")
                    if value.startswith("cs_") or value.startswith("ref_"):
                        reference_id = value
                        break

            # ✅ Extract created object ID from objectChanges
            object_changes = tx_result.get("objectChanges", [])
            created_object_id = None
            for change in object_changes:
                if change.get("type") == "created":
                    created_object_id = change.get("objectId")
                    break

            return Response(
                {
                    "verified": True,
                    "message": "Transaction verified successfully",
                    "sender": sender,
                    "reference_id": reference_id,
                    "object_id": created_object_id,
                }
            )

        except Exception as e:
            return Response({"error": str(e)}, status=500)
