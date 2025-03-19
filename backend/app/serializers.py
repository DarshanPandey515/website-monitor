# app/serializers.py
from rest_framework import serializers
from .models import *

class WebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Website
        fields = ['id', 'name', 'url', 'check_interval', 'expected_status_code', 'created_at']

class UptimeLogSerializer(serializers.ModelSerializer):
    website_name = serializers.CharField(source='website.name', read_only=True)
    class Meta:
        model = UptimeLog
        fields = ['id', 'website', 'website_name', 'status_code', 'response_time', 'status', 'error_message', 'checked_at']

class DowntimeAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = DowntimeAlert
        fields = ['id', 'website', 'alert_type', 'alert_status', 'message', 'sent_at']

class PerformanceMetricsSerializer(serializers.Serializer):  # Changed to Serializer
    id = serializers.IntegerField()  # Website ID
    website = serializers.CharField()  # Website name as a string
    uptime_percentage = serializers.FloatField()
    avg_response_time = serializers.FloatField()
    # Optionally include these if you want them in the response
    downtime_count = serializers.IntegerField(required=False, default=0)
    total_checks = serializers.IntegerField(required=False, default=0)