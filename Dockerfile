# Sử dụng Python chính thức
FROM python:3.10-slim

# Đặt thư mục làm việc
WORKDIR /app

# Cài đặt các gói hệ thống cần thiết (nếu cần, ví dụ để cài mysqlclient)
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    libmariadb-dev \
    pkg-config \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Sao chép và cài đặt dependencies từ requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Đặt thông tin image base
LABEL maintainer="dinhthai0312@gmail.com"
