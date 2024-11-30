# Sử dụng Python image
FROM python:3.10-slim

# Cài đặt các gói hệ thống
RUN apt-get update && apt-get install -y \
    pkg-config \
    libmariadb-dev \
    gcc \
    && apt-get clean

# Cài đặt các thư viện Python cần thiết
RUN pip install --upgrade pip setuptools wheel

# Cài đặt mysqlclient
RUN pip install mysqlclient

# Sao chép mã nguồn vào container
WORKDIR /app
COPY . .

# Cài đặt các dependencies từ requirements.txt
RUN pip install -r requirements.txt

# # Expose port và chạy server
# EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
