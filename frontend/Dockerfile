# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install deps (use lockfile for reproducible builds)
COPY package.json package-lock.json* bun.lockb* ./
RUN npm ci || npm install

# Copy source and build
COPY . .

# Allow overriding the API base URL at build time
ARG VITE_API_BASE=http://localhost:8000
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# SPA-friendly nginx config (fallback to index.html)
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
  location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {\n\
    expires 30d;\n\
    add_header Cache-Control "public, no-transform";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
