from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authy.views import MerchantViewSet

router = DefaultRouter()
router.register(r"merchants", MerchantViewSet)
url_patterns = []
url_patterns += router.urls