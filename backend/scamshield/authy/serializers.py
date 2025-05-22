from django.utils import timezone
from datetime import timedelta
from rest_framework import serializers
from authy.models import Merchant


class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ["id","api_key"]
