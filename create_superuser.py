# import os
# from django.contrib.auth.models import User

# username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
# email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
# password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin123")

# if not User.objects.filter(username=username).exists():
#     User.objects.create_superuser(username, email, password)
#     print(f"Superuser {username} created.")

# import os
# from dotenv import load_dotenv
# from django.contrib.auth.models import User

# # Load các biến môi trường từ file .env
# load_dotenv()

# username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
# email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
# password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "admin123")

# if not User.objects.filter(username=username).exists():
#     User.objects.create_superuser(username, email, password)
# #     print(f"Superuser {username} created.")
# import os
# from django.contrib.auth.models import User
# from django.conf import settings  # Import settings để lấy thông tin từ môi trường Django

# # Truy cập các biến môi trường đã được đọc trong settings.py
# username = settings.env("DJANGO_SUPERUSER_USERNAME", default="admin")
# email = settings.env("DJANGO_SUPERUSER_EMAIL", default="admin@example.com")
# password = settings.env("DJANGO_SUPERUSER_PASSWORD", default="admin123")

# if not User.objects.filter(username=username).exists():
#     User.objects.create_superuser(username, email, password)
#     print(f"Superuser {username} created.")


# import environ
# # Khởi tạo biến môi trường
# env = environ.Env(
#     DEBUG=(bool, False)
# )

# # Đọc file .env
# environ.Env.read_env()

# import os
# from django.contrib.auth.models import User
# import environ
# # Khởi tạo biến môi trường từ file .env
# env = environ.Env(DEBUG=(bool, False))
# # Đọc file .env
# environ.Env.read_env()

# # Lấy thông tin superuser từ môi trường
# username = env("DJANGO_SUPERUSER_USERNAME", default="admin")
# email = env("DJANGO_SUPERUSER_EMAIL", default="admin@example.com")
# password = env("DJANGO_SUPERUSER_PASSWORD", default="admin123")

# # Kiểm tra và tạo superuser nếu chưa có
# if not User.objects.filter(username=username).exists():
#     User.objects.create_superuser(username, email, password)
#     print(f"Superuser {username} created.")


# from Account.models import AccountModel 
# import os
# from django.core.wsgi import get_wsgi_application

# # Đặt giá trị cho DJANGO_SETTINGS_MODULE
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EzPDF.settings')

# # Khởi tạo Django application
# application = get_wsgi_application()

# # Tiếp tục các phần còn lại của mã
# from django.contrib.auth.models import User
# import environ

# # Khởi tạo biến môi trường từ file .env
# env = environ.Env(DEBUG=(bool, False))
# # Đọc file .env
# environ.Env.read_env()

# # Lấy thông tin superuser từ môi trường
# username = env("DJANGO_SUPERUSER_USERNAME", default="admin")
# email = env("DJANGO_SUPERUSER_EMAIL", default="admin@example.com")
# password = env("DJANGO_SUPERUSER_PASSWORD", default="admin123")

# # Kiểm tra và tạo superuser nếu chưa có
# if not User.objects.filter(username=username).exists():
#     User.objects.create_superuser(username, email, password)
#     print(f"Superuser {username} created.")



from Account.models import AccountModel  # Import đúng mô hình người dùng của bạn
import environ
from django.core.wsgi import get_wsgi_application
import os

# Đặt giá trị cho DJANGO_SETTINGS_MODULE
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EzPDF.settings')

# Khởi tạo Django application
application = get_wsgi_application()

# Khởi tạo biến môi trường từ file .env
env = environ.Env(DEBUG=(bool, False))
# Đọc file .env
environ.Env.read_env()

# Lấy thông tin superuser từ môi trường
username = env("DJANGO_SUPERUSER_USERNAME", default="admin")
email = env("DJANGO_SUPERUSER_EMAIL", default="admin@example.com")
password = env("DJANGO_SUPERUSER_PASSWORD", default="admin123")

# Kiểm tra và tạo superuser nếu chưa có
if not AccountModel.objects.filter(username=username).exists():  # Sử dụng mô hình người dùng tùy chỉnh
    AccountModel.objects.create_superuser(username, email, password)
    print(f"Superuser {username} created.")
