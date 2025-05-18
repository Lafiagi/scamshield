from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers
from core.models import ScamReport, Evidence, Verification, ScamTactic, TimelineEvent


class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = ["id", "type", "description", "file", "link", "hash", "created_at"]


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = [
            "id",
            "verifier",
            "verified",
            "comment",
            "timestamp",
            "transaction_hash",
        ]


class ScamTacticSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScamTactic
        fields = ["id", "description"]


class TimelineEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineEvent
        fields = ["id", "date", "event"]


class ScamReportListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScamReport
        fields = [
            "id",
            "title",
            "scam_type",
            "status",
            "risk_level",
            "reporter_address",
            "created_at",
            "verification_count",
            "rejection_count",
        ]


class ScamReportDetailSerializer(serializers.ModelSerializer):
    evidence = EvidenceSerializer(many=True, read_only=True)
    verifications = VerificationSerializer(many=True, read_only=True)
    scam_tactics = ScamTacticSerializer(many=True, read_only=True)
    timeline = TimelineEventSerializer(many=True, read_only=True)
    user_can_verify = serializers.SerializerMethodField()

    class Meta:
        model = ScamReport
        fields = [
            "id",
            "title",
            "scammer_address",
            "reporter_address",
            "scam_type",
            "description",
            "contact_info",
            "additional_details",
            "status",
            "risk_level",
            "created_at",
            "verification_deadline",
            "transaction_hash",
            "sui_object_id",
            "stake_amount",
            "verification_count",
            "rejection_count",
            "evidence",
            "verifications",
            "scam_tactics",
            "timeline",
            "user_can_verify",
        ]

    def get_user_can_verify(self, obj: ScamReport):
        request = self.context.get("request")
        user = getattr(request, "user", None)

        if not user or not user.is_authenticated:
            return False

        # Check if this user has already verified this specific report
        has_verified = Verification.objects.filter(verifier=user, report=obj).exists()

        # User cannot verify their own report
        is_reporter = obj.reporter_address == getattr(user, "wallet_address", None)

        return not has_verified and not is_reporter


class ScamReportCreateSerializer(serializers.ModelSerializer):
    evidence_files = serializers.ListField(
        child=serializers.FileField(
            max_length=100000, allow_empty_file=False, use_url=False
        ),
        write_only=True,
        required=False,
    )

    class Meta:
        model = ScamReport
        fields = [
            "id",
            "title",
            "scammer_address",
            "scam_type",
            "description",
            "contact_info",
            "additional_details",
            "evidence_files",
            "transaction_hash",
            "sui_object_id",
            "stake_amount",
            "transaction_amount",
        ]

    def create(self, validated_data):
        evidence_files = validated_data.pop("evidence_files", [])

        # Use the reporter address from the request context
        validated_data["reporter_address"] = self.context["request"].user.wallet_address

        # Calculate verification deadline (3 days from now)
        validated_data["verification_deadline"] = timezone.now() + timedelta(days=3)

        # Create the report
        report = ScamReport.objects.create(**validated_data)

        # Create evidence entries
        for file in evidence_files:
            Evidence.objects.create(
                report=report,
                type="screenshot",  # Default, can be updated later
                description=f"Evidence file: {file.name}",
                file=file,
            )

        # Create initial timeline event
        TimelineEvent.objects.create(
            report=report, date=timezone.now(), event="Report submitted to ScamShield"
        )

        return report


class VerificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = ["verified", "comment", "transaction_hash"]

    def create(self, validated_data):
        report = self.context["report"]

        # Use the verifier address from the request context
        validated_data["verifier"] = self.context["request"].user.wallet_address
        validated_data["report"] = report

        verification = Verification.objects.create(**validated_data)

        # Update report verification/rejection counts
        if verification.verified:
            report.verification_count += 1
        else:
            report.rejection_count += 1
        report.save()

        # Add timeline event
        TimelineEvent.objects.create(
            report=report,
            date=timezone.now(),
            event=f"{'Verified' if verification.verified else 'Rejected'} by {verification.verifier[:10]}...",
        )

        return verification
