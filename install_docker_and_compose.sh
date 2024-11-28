#!/bin/bash

# Kiểm tra quyền root
if [ "$(id -u)" -ne "0" ]; then
  echo "Vui lòng chạy script với quyền root (sudo)"
  exit 1
fi

# Cập nhật hệ thống
echo "Đang cập nhật hệ thống..."
sudo apt update

# Cài đặt các gói cần thiết cho Docker
echo "Cài đặt các gói cần thiết cho Docker..."
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

# Thêm kho Docker GPG key
echo "Thêm kho Docker GPG key..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Thêm Docker repository vào hệ thống
echo "Thêm Docker repository vào hệ thống..."
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Cập nhật lại danh sách gói
echo "Cập nhật lại danh sách gói..."
sudo apt update

# Cài đặt Docker
echo "Cài đặt Docker..."
sudo apt install docker-ce -y

# Kiểm tra Docker đã cài đặt thành công
echo "Kiểm tra Docker version..."
sudo docker --version
#######################################
# Cài đặt Docker Compose
echo "Đang tải Docker Compose..."
DOCKER_COMPOSE_VERSION="v2.31.0"
curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Cấp quyền thực thi cho Docker Compose
echo "Cấp quyền thực thi cho Docker Compose..."
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra Docker Compose đã cài đặt thành công
echo "Kiểm tra Docker Compose version..."
docker-compose --version

echo "Cài đặt Docker và Docker Compose đã hoàn tất!"
