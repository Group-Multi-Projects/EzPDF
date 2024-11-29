#!/bin/bash

# Dừng và xóa tất cả container đang chạy
echo "Stopping and removing all Docker containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null
sudo docker rm $(sudo docker ps -aq) 2>/dev/null

# Dừng dịch vụ Docker
echo "Stopping Docker service..."
sudo systemctl stop docker
sudo systemctl disable docker

# Gỡ cài đặt Docker và các gói liên quan
echo "Removing Docker packages..."
sudo apt-get purge -y docker docker-engine docker.io containerd runc docker-ce docker-ce-cli containerd.io

# Xóa các tệp Docker và dữ liệu liên quan
echo "Removing Docker files and directories..."
sudo umount /var/lib/docker/overlay2/*/merged 2>/dev/null
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
sudo rm -rf /etc/docker
sudo rm -f /etc/systemd/system/docker.service
sudo rm -f /etc/systemd/system/docker.socket

# Dọn dẹp hệ thống
echo "Cleaning up the system..."
sudo apt-get autoremove -y
sudo apt-get autoclean

# Kiểm tra xem Docker đã được gỡ bỏ chưa
if command -v docker &>/dev/null; then
    echo "Docker is still installed. Please check manually."
else
    echo "Docker has been successfully removed."
fi
