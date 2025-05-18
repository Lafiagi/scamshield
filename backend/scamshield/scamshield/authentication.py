# middleware/wallet_auth.py

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model

User = get_user_model()


class WalletAddressAuthentication(BaseAuthentication):
    def authenticate(self, request):
        wallet_address = request.headers.get("X-Wallet-Address")
        if not wallet_address:
            return None  # Let other authenticators handle

        try:
            user, _ = User.objects.get_or_create(wallet_address=wallet_address)
            return (user, None)
        except Exception:
            raise AuthenticationFailed("Invalid wallet address")
