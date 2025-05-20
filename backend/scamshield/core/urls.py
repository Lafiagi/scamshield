from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    ScamReportViewSet,
    MyReportsView,
    PendingVerificationsView,
    DashboardStatsView,
    VerifyTransactionView
)

router = DefaultRouter()
router.register(r"reports", ScamReportViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("my-reports/", MyReportsView.as_view(), name="my-reports"),
    path(
        "pending-verifications/",
        PendingVerificationsView.as_view(),
        name="pending-verifications",
    ),
    path("dashboard-stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
        path(
        "api/verify-sui-transaction/",
        VerifyTransactionView.as_view(),
        name="verify_transaction",
    ),
]
