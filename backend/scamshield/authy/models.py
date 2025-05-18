from django.contrib.auth.models import AbstractBaseUser
from django.db import models


class User(AbstractBaseUser):

    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    USERNAME_FIELD = "wallet_address"
