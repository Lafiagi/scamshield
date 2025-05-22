import django_filters
from .models import ScamReport

class ScamReportFilter(django_filters.FilterSet):
    scammer_address = django_filters.CharFilter(
        field_name='scammer_address', lookup_expr='icontains'
    )
    reporter_address = django_filters.CharFilter(
        field_name='reporter_address', lookup_expr='icontains'
    )
    scam_type = django_filters.CharFilter(
        field_name='scam_type', lookup_expr='exact'
    )
    status = django_filters.CharFilter(
        field_name='status', lookup_expr='exact'
    )

    class Meta:
        model = ScamReport
        fields = ['scammer_address', 'reporter_address', 'scam_type', 'status']
