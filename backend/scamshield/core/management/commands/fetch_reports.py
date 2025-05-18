from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import ScamReport, TimelineEvent
from core.sui_service import SuiClient


class Command(BaseCommand):
    help = "Fetch new reports from the Sui blockchain"

    def handle(self, *args, **options):
        client = SuiClient()

        # Fetch ReportCreated events from the last day
        start_time = (
            timezone.now() - timedelta(days=1)
        ).timestamp() * 1000  # Convert to ms

        try:
            events = client.get_events_by_sender(
                None,  # All senders
                "scam_shield::report_registry::ReportCreated",  # Event type
                int(start_time),
            )

            new_count = 0
            existing_count = 0

            for event in events:
                event_data = (
                    event.get("event", {}).get("moveEvent", {}).get("fields", {})
                )

                # Extract report ID (object ID) from the event
                report_id = event_data.get("report_id")

                if not report_id:
                    continue

                # Check if we already have this report
                if ScamReport.objects.filter(sui_object_id=report_id).exists():
                    existing_count += 1
                    continue

                # Create a new report
                report = ScamReport(
                    title=f"Report from {event_data.get('scam_type', 'unknown')}",
                    scammer_address=event_data.get("scammer_address"),
                    reporter_address=event_data.get("reporter_address"),
                    scam_type=event_data.get("scam_type", "other"),
                    description="Report created on the blockchain",
                    sui_object_id=report_id,
                    stake_amount=int(event_data.get("stake_amount", 0)),
                    created_at=timezone.now(),
                    verification_deadline=timezone.now() + timedelta(days=3),
                    status="pending",
                )
                report.save()

                # Create timeline event
                TimelineEvent.objects.create(
                    report=report,
                    date=timezone.now(),
                    event="Report detected on blockchain",
                )

                new_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Successfully imported report {report_id}")
                )

            self.stdout.write(
                f"Import complete. Added {new_count} new reports. {existing_count} reports already existed."
            )

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error fetching events: {str(e)}"))
