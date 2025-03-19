# app/urls.py
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, include
from rest_framework.permissions import AllowAny
from rest_framework.routers import DefaultRouter
from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title="Website Monitoring API",
        default_version="v1",
        description="API documentation for Website Downtime Monitoring System",
    ),
    public=True,
    permission_classes=(AllowAny,),
)

router = DefaultRouter()
router.register(r'websites', WebsiteViewSet)
router.register(r'uptime-logs', UptimeLogViewSet)
router.register(r'downtime-alerts', DowntimeAlertViewSet)
router.register(r'performance-metrics', PerformanceMetricsViewSet, basename='performance-metrics')  # Add basename

urlpatterns = [
    path("", include(router.urls)),
    path("trigger-check/", TriggerCheckViewSet.as_view({'post': 'create'}), name="trigger-check"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
]