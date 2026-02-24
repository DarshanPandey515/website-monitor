import time
import requests
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import *


@shared_task
def monitor_websites():
    print("monitor working")
    now = timezone.now()

    websites = Website.objects.all()

    for website in websites:
        if website.last_checked is None:
            check_website.delay(website.id)
            continue

        next_check_time = website.last_checked + \
            timedelta(minutes=website.interval)

        if now >= next_check_time:
            check_website.delay(website.id)


@shared_task
def check_website(website_id):
    try:
        website = Website.objects.get(id=website_id)

        start = time.time()
        response = requests.get(website.website_url, timeout=10)
        response_time = (time.time() - start) * 1000

        is_up = response.status_code == 200

        CheckResult.objects.create(
            website=website,
            status=is_up,
            status_code=response.status_code,
            response_time=response_time,
        )

        website.last_checked = timezone.now()
        website.last_status = is_up
        website.last_response_time = response_time
        website.save()

    except Exception as e:
        if website:
            CheckResult.objects.create(
                website=website,
                status=False,
                error_message=str(e),
            )
            website.last_checked = timezone.now()
            website.last_status = False
            website.save()
