import hashlib
from django.utils.crypto import get_random_string
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from authy.Fields import EncryptedField


class User(AbstractBaseUser):

    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    USERNAME_FIELD = "wallet_address"



class Merchant(models.Model):
    user = models.OneToOneField(
        "authy.User", on_delete=models.CASCADE, related_name="merchant", null=True
    )
    api_key = EncryptedField(max_length=64)
    api_key_hash = models.CharField(
        max_length=64, unique=True, editable=False, null=True
    )
    api_key_created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def generate_api_key(self):
        """Generate a new API key"""
        api_key = get_random_string(48)
        self.api_key = api_key
        self.api_key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        self.save()
        return api_key

    def save(self, *args, **kwargs):
        if self.api_key:
            self.api_key_hash = hashlib.sha256(self.api_key.encode()).hexdigest()
        super().save(*args, **kwargs)