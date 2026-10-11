from celery import Celery
import os
from celery.schedules import crontab
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "ims",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["app.tasks"] 
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=False,
)
celery_app.conf.beat_schedule = {
    "inventory-check-every-30-seconds": {
        "task": "app.tasks.inventory_check",
        "schedule": crontab(minute=0,hour=11),
    },
}