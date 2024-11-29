from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE','EzPDF.settings')

app = Celery('EzPDF')
app.conf.enable_utc = False

app.conf.update(timezone = 'Asia/Kolkata')

app.config_from_object(settings, namespace = 'CELERY')

app.conf.broker_url = 'redis://redis:6379/0'  # Kết nối Redis qua Docker service name

app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')