#!/bin/bash

# Kiểm tra quyền root
if [ "$(id -u)" -ne "0" ]; then
  echo "Vui lòng chạy script với quyền root (sudo)"
  exit 1
fi

# Tải Docker Compose phiên bản mới nhất cho Linux (x86_64 hoặc aarch64 tùy thuộc vào hệ thống)
DOCKER_COMPOSE_VERSION="v2.31.0"
ARCHITECTURE="x86_64"  # Thay đổi thành aarch64 nếu hệ thống của bạn là ARM

echo "Đang tải Docker Compose phiên bản $DOCKER_COMPOSE_VERSION cho kiến trúc $ARCHITECTURE..."

# Tải tệp Docker Compose
curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-linux-$ARCHITECTURE" -o /usr/local/bin/docker-compose

# Cấp quyền thực thi cho Docker Compose
chmod +x /usr/local/bin/docker-compose

# Kiểm tra Docker Compose đã cài đặt thành công
docker-compose --version

echo "Docker Compose đã được cài đặt thành công!"
