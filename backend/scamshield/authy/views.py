from rest_framework import viewsets, permissions
from authy.models import Merchant
from authy.serializers import MerchantSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
import secrets
import string
from django.utils import timezone
from datetime import timedelta

class MerchantViewSet(viewsets.ModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        return Merchant.objects.filter(user=user)

    @action(detail=True, methods=["post"])
    def generate_api_key(self, request, pk=None):
        """Generate a new API key for the merchant"""
        user = request.user
        merchant, created = Merchant.objects.get_or_create(user=user)

        # Generate a secure random API key
        alphabet = string.ascii_letters + string.digits
        api_key = "".join(secrets.choice(alphabet) for _ in range(48))

        # Save the new API key
        merchant.api_key = api_key
        merchant.save()

        return Response({"api_key": api_key}, status=status.HTTP_200_OK)
