from django.db import models
from django.utils import timezone
import uuid


class ScamReport(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    )

    RISK_LEVEL_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
    )

    SCAM_TYPE_CHOICES = (
        ("website", "Website"),
        ("wallet", "Wallet"),
        ("social_media", "Social Media"),
        ("smart_contract", "Smart Contract"),
        ("airdrop", "Airdrop"),
        ("impersonation", "Impersonation"),
        ("phishing", "Phishing"),
        ("fake_token", "Fake Token"),
        ("other", "Other"),
    )

    # Basic information
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    scammer_address = models.CharField(max_length=255)
    reporter_address = models.CharField(max_length=255)
    scam_type = models.CharField(max_length=50, choices=SCAM_TYPE_CHOICES)
    description = models.TextField()
    contact_info = models.CharField(max_length=255, blank=True, null=True)
    additional_details = models.TextField(blank=True, null=True)
    transaction_amount = models.DecimalField(max_digits=20, decimal_places=2, default=0.0)
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    risk_level = models.CharField(
        max_length=20, choices=RISK_LEVEL_CHOICES, default="medium"
    )
    created_at = models.DateTimeField(default=timezone.now)
    verification_deadline = models.DateTimeField()

    # On-chain data
    transaction_hash = models.CharField(max_length=255, blank=True, null=True)
    sui_object_id = models.CharField(max_length=255, blank=True, null=True)
    stake_amount = models.BigIntegerField(default=0)

    # Counters
    verification_count = models.IntegerField(default=0)
    rejection_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - {self.status}"

    def is_verification_period_ended(self):
        return timezone.now() > self.verification_deadline


class Evidence(models.Model):
    TYPE_CHOICES = (
        ("transaction", "Transaction"),
        ("screenshot", "Screenshot"),
        ("report", "Report"),
        ("document", "Document"),
        ("video", "Video"),
        ("other", "Other"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ScamReport, related_name="evidence", on_delete=models.CASCADE
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.CharField(max_length=255)
    file = models.FileField(upload_to="evidence/", blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    hash = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.type} evidence for {self.report.title}"


class Verification(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ScamReport, related_name="verifications", on_delete=models.CASCADE
    )
    verifier = models.CharField(max_length=255)
    verified = models.BooleanField()
    comment = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    transaction_hash = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ("report", "verifier")

    def __str__(self):
        return f"{'Verification' if self.verified else 'Rejection'} by {self.verifier}"


class ScamTactic(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ScamReport, related_name="scam_tactics", on_delete=models.CASCADE
    )
    description = models.TextField()

    def __str__(self):
        return self.description[:50]


class TimelineEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    report = models.ForeignKey(
        ScamReport, related_name="timeline", on_delete=models.CASCADE
    )
    date = models.DateTimeField()
    event = models.CharField(max_length=255)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.event} on {self.date.strftime('%Y-%m-%d')}"
