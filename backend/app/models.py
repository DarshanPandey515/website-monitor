# app/models.py
from django.db import models
from django.core.validators import URLValidator
from django.contrib.auth.models import User
from django.utils.timezone import now

class Website(models.Model):
    name = models.CharField(max_length=255, unique=True, db_index=True)
    url = models.URLField(unique=True, validators=[URLValidator(schemes=['http', 'https'])], db_index=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="websites")
    owner_email = models.EmailField(db_index=True)
    check_interval = models.PositiveIntegerField(default=5)
    expected_status_code = models.PositiveSmallIntegerField(default=200)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_active = models.BooleanField(default=True)  # Added for better management

    class Meta:
        indexes = [models.Index(fields=['owner', 'is_active'])]
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class UptimeLog(models.Model):
    STATUS_CHOICES = [('UP', 'Up'), ('DOWN', 'Down'), ('SLOW', 'Slow Response')]
    
    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name="logs")
    status_code = models.PositiveSmallIntegerField(db_index=True)
    response_time = models.FloatField(help_text="ms")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='UP', db_index=True)
    error_message = models.TextField(null=True, blank=True)
    checked_at = models.DateTimeField(default=now, db_index=True)

    class Meta:
        indexes = [models.Index(fields=['website', 'checked_at'])]
        ordering = ['-checked_at']

    def __str__(self):
        return f"{self.website.name} - {self.status}"

class DowntimeAlert(models.Model):
    ALERT_CHOICES = [('EMAIL', 'Email'), ('SMS', 'SMS')]
    ALERT_STATUS = [('PENDING', 'Pending'), ('SENT', 'Sent'), ('FAILED', 'Failed')]

    website = models.ForeignKey(Website, on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=10, choices=ALERT_CHOICES, default='EMAIL')
    alert_status = models.CharField(max_length=10, choices=ALERT_STATUS, default='PENDING')
    message = models.TextField(null=True, blank=True)
    sent_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [models.Index(fields=['website', 'alert_status'])]
        ordering = ['-sent_at']

    def __str__(self):
        return f"Alert for {self.website.name}"

class PerformanceMetrics(models.Model):
    website = models.OneToOneField(Website, on_delete=models.CASCADE, related_name="performance")
    uptime_percentage = models.FloatField(default=100.0)
    avg_response_time = models.FloatField(default=0.0)
    downtime_count = models.PositiveIntegerField(default=0)
    total_checks = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True, db_index=True)

    def recalculate_uptime(self):
        logs = self.website.logs.all()
        if logs.exists():
            up_count = logs.filter(status='UP').count()
            self.total_checks = logs.count()
            self.uptime_percentage = (up_count / self.total_checks) * 100 if self.total_checks > 0 else 100.0
            self.downtime_count = self.total_checks - up_count
            self.avg_response_time = logs.aggregate(models.Avg('response_time'))['response_time__avg'] or 0.0
            self.save()

    def __str__(self):
        return f"{self.website.name} - {self.uptime_percentage}%"