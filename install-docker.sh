#!/bin/bash

# Kiểm tra quyền root
if [ "$(id -u)" -ne 0 ]; then
  echo "Vui lòng chạy script này với quyền root (sudo)"
  exit 1
fi

echo "Cập nhật danh sách gói..."
apt-get update -y

echo "Cài đặt các gói phụ thuộc..."
apt-get install -y apt-transport-https ca-certificates curl software-properties-common

echo "Thêm kho Docker vào hệ thống..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

echo "Thêm kho Docker vào danh sách nguồn phần mềm của apt..."
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

echo "Cập nhật danh sách gói sau khi thêm kho Docker..."
apt-get update -y

echo "Cài đặt Docker..."
apt-get install -y docker-ce docker-ce-cli containerd.io

echo "Kiểm tra trạng thái Docker..."
systemctl start docker
systemctl enable docker

echo "Kiểm tra phiên bản Docker..."
docker --version

echo "Docker đã được cài đặt thành công!"
