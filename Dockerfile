# 使用官方 Node.js 镜像作为基础镜像
FROM node:latest

WORKDIR /app

# 将 package.json 和 package-lock.json（如果有）复制到容器内
COPY package*.json ./

# npm 源，选用国内镜像源以提高下载速度
RUN  npm config set registry https://registry.npmmirror.com

RUN npm install

# 将整个项目复制到容器内
COPY . .

RUN npm run build

# 创建文件夹保存上传的文件
RUN mkdir -p /app/files
# docker run -d --name graduation-backend -p 3002:3002 -v /root/graduation-design-backend/files:/app/files graduation-backend

EXPOSE 3002

CMD ["npm", "start"]
