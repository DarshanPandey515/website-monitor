# app/tasks.py
from celery import shared_task
import requests
from django.core.mail import send_mail
from django.conf import settings
from django.utils.timezone import now, timedelta
from .models import Website, UptimeLog, DowntimeAlert, PerformanceMetrics

@shared_task(bind=True, max_retries=3)
def check_website_status(self, website_id):
    try:
        website = Website.objects.get(id=website_id, is_active=True)
        response = requests.get(website.url, timeout=5, headers={'User-Agent': 'MonitoringBot/1.0'})
        response_time = response.elapsed.total_seconds() * 1000

        status = "UP" if response.status_code == website.expected_status_code else "DOWN"
        if status == "UP" and response_time > 2000:  # Threshold for slow response
            status = "SLOW"

        log = UptimeLog.objects.create(
            website=website,
            status_code=response.status_code,
            response_time=response_time,
            status=status,
            checked_at=now()
        )

        metrics, _ = PerformanceMetrics.objects.get_or_create(website=website)
        metrics.total_checks += 1
        metrics.avg_response_time = (
            (metrics.avg_response_time * (metrics.total_checks - 1) + response_time) / metrics.total_checks
        )
        if status == "DOWN":
            metrics.downtime_count += 1
        metrics.uptime_percentage = ((metrics.total_checks - metrics.downtime_count) / metrics.total_checks) * 100
        metrics.save()

        if status in ["DOWN", "SLOW"]:
            last_alert = DowntimeAlert.objects.filter(
                website=website,
                alert_status='SENT'
            ).order_by('-sent_at').first()
            
            if not last_alert or (now() - last_alert.sent_at) > timedelta(minutes=30):  # Throttle alerts
                alert = DowntimeAlert.objects.create(
                    website=website,
                    message=f"{website.name} is {status.lower()}! Response: {response_time}ms",
                )
                send_mail(
                    subject=f"Website {status} Alert: {website.name}",
                    message=alert.message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[website.owner_email],
                    fail_silently=False,
                )
                alert.alert_status = 'SENT'
                alert.save()

    except requests.RequestException as e:
        UptimeLog.objects.create(
            website=website,
            status_code=0,
            response_time=0,
            status="DOWN",
            error_message=str(e),
            checked_at=now()
        )
    except Exception as e:
        self.retry(exc=e, countdown=60)