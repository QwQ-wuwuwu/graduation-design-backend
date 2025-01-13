#!/bin/bash
# 示例部署脚本

echo "开始部署..."

sudo systemctl start docker
docker stop graduation-backend
docker rm graduation-backend
docker rmi graduation-backend

cd /root/graduation-design-backend/
docker build -t graduation-backend .
docker run -d --name graduation-backend -p 3002:3002 -v /root/graduation-design-backend/files:/app/files graduation-backend 

docker stop graduation-frontend
docker rm graduation-frontend
docker rmi graduation-frontend
cd /root/graduation-design-frontend/
docker build -t graduation-frontend .
docker run -d --name graduation-frontend -p 3001:3001 -v /root/graduation-design-frontend/nginx.conf:/etc/nginx/nginx.conf -v /root/graduation-design-frontend/dist://usr/share/nginx/html graduation-frontend

echo "部署完成！"
