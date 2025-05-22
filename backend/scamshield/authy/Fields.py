import base64

from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC



class EncryptedField(models.CharField):
    """A field that encrypts and decrypts values automatically"""

    def __init__(self, *args, **kwargs):
        kwargs["max_length"] = 255  # encrypted data is longer
        super().__init__(*args, **kwargs)

    def _get_key(self):
        # Use the Django SECRET_KEY to derive an encryption key
        password = settings.SECRET_KEY.encode()
        salt = b"scamshield"  # Should be a constant value
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        return base64.urlsafe_b64encode(kdf.derive(password))

    def get_fernet(self):
        key = self._get_key()
        return Fernet(key)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        f = self.get_fernet()
        try:
            # Decrypt the value
            decrypted = f.decrypt(value.encode())
            return decrypted.decode()
        except Exception:
            # If decryption fails, return the raw value
            return value

    def to_python(self, value):
        if value is None:
            return value
        return value

    def get_prep_value(self, value):
        if value is None:
            return value
        f = self.get_fernet()
        # Encrypt the value
        encrypted = f.encrypt(value.encode())
        return encrypted.decode()
