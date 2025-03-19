# app/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from .tasks import check_website_status
from django.db.models import Avg
from rest_framework.permissions import AllowAny


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class WebsiteViewSet(viewsets.ModelViewSet):
    queryset = Website.objects.filter(is_active=True)
    serializer_class = WebsiteSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny] 

    def perform_create(self, serializer):
        default_user = User.objects.get(id=1)          
        website = serializer.save(owner=default_user, owner_email="default@example.com")
        PerformanceMetrics.objects.create(website=website)
        check_website_status.delay(website.id)

class UptimeLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = UptimeLog.objects.all()
    serializer_class = UptimeLogSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        return UptimeLog.objects.all()

class DowntimeAlertViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DowntimeAlert.objects.all()
    serializer_class = DowntimeAlertSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [AllowAny]

    def get_queryset(self):
        return DowntimeAlert.objects.all() 

class PerformanceMetricsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny] 

    def list(self, request):
        websites = Website.objects.all()  

        metrics = []
        for website in websites:
            logs = UptimeLog.objects.filter(website=website)
            uptime_percentage = (logs.filter(status='UP').count() / logs.count() * 100) if logs.exists() else 0
            avg_response_time = logs.aggregate(Avg('response_time'))['response_time__avg'] or 0
            metrics.append({
                'id': website.id,
                'website': website.name,
                'uptime_percentage': round(uptime_percentage, 2),
                'avg_response_time': round(avg_response_time, 2),
                'downtime_count': logs.filter(status__in=['DOWN', 'SLOW']).count(),
                'total_checks': logs.count(),
            })

        serializer = PerformanceMetricsSerializer(metrics, many=True)
        return Response(serializer.data)

class TriggerCheckViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    def create(self, request):
        website_id = request.data.get("website_id")
        website = get_object_or_404(Website, id=website_id)
        check_website_status.delay(website.id)
        return Response({"message": "Check triggered"}, status=status.HTTP_200_OK)