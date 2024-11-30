import os
import django
import environ

# Khởi tạo môi trường từ tệp .env
env = environ.Env()
environ.Env.read_env()
# Thiết lập môi trường Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EzPDF.settings')
django.setup()

# Import model và sử dụng
from Account.models import AccountModel
username_admin = env('DJANGO_SUPERUSER_USERNAME')
username_email = env('DJANGO_SUPERUSER_EMAIL')
username_password = env('DJANGO_SUPERUSER_PASSWORD')
# Tạo superuser

try: 
    user_admin = AccountModel.objects.get(username = username_admin)
    print("Username is existed")
except Exception as e:
    AccountModel.objects.create_superuser(
        email=username_email,
        username=username_admin,
        password=username_password
    )
    print("Superuser created!")

