from django.contrib import admin
from .models import Website, UptimeLog, DowntimeAlert, PerformanceMetrics

admin.site.register(Website)
admin.site.register(UptimeLog)
admin.site.register(DowntimeAlert)
admin.site.register(PerformanceMetrics)
