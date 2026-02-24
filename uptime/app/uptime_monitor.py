import requests
import time


start = time.time()

def check_uptime(url):   
    try:
        r = requests.get(url, timeout=5)
        status = r.status_code
        response_time = r.elapsed.total_seconds()
        is_up = 200 <= status < 400

        print(response_time)
    except requests.exceptions.RequestException as e:
        status = 0
        response_time = None
        is_up = False

    print(is_up)