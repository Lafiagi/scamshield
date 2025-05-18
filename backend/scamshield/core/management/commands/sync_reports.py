from django.core.management.base import BaseCommand
from django.utils import timezone
from core.models import ScamReport
from core.sui_service import sync_verification_status


class Command(BaseCommand):
    help = "Sync report statuses with the Sui blockchain"

    def handle(self, *args, **options):
        # Get all pending reports
        pending_reports = ScamReport.objects.filter(
            status="pending", sui_object_id__isnull=False
        )

        sync_count = 0
        error_count = 0

        for report in pending_reports:
            success, message = sync_verification_status(report)

            if success:
                sync_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Successfully synced report {report.id}: {message}"
                    )
                )
            else:
                error_count += 1
                self.stdout.write(
                    self.style.ERROR(f"Failed to sync report {report.id}: {message}")
                )

        # Check for reports where verification period has ended
        expired_reports = ScamReport.objects.filter(
            status="pending", verification_deadline__lt=timezone.now()
        )

        for report in expired_reports:
            # Skip reports without an on-chain ID
            if not report.sui_object_id:
                continue

            success, message = sync_verification_status(report)

            if success:
                sync_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Successfully synced expired report {report.id}: {message}"
                    )
                )
            else:
                error_count += 1
                self.stdout.write(
                    self.style.ERROR(
                        f"Failed to sync expired report {report.id}: {message}"
                    )
                )

        self.stdout.write(
            f"Sync complete. Synced {sync_count} reports with {error_count} errors."
        )
