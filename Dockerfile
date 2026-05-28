# Build stage
FROM node:23-alpine AS build

WORKDIR /app
COPY package.json ./

RUN npm install

COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /fonts/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /pwa- {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location = /sw.js {
        add_header Cache-Control "no-cache";
    }

    location = /registerSW.js {
        add_header Cache-Control "no-cache";
    }
}
EOF

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
