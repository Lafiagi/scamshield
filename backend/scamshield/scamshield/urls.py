from django.contrib import admin
from django.urls import re_path


from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from core.urls import urlpatterns as core_urls_pattern

urlpatterns = [
    # YOUR PATTERNS
    re_path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # Optional UI:
    re_path(
        "apidocs",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    re_path(
        "api/schema/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
urlpatterns += [
    re_path("admin/", admin.site.urls),
]
urlpatterns += core_urls_pattern
