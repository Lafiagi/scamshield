# Generated by Django 5.2.1 on 2025-05-19 14:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_scamreport_transaction_amount"),
    ]

    operations = [
        migrations.AddField(
            model_name="scamreport",
            name="transaction_digest",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
