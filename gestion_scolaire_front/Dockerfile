
# ---------- Stage 1: Build Angular ----------
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve Angular avec Nginx
FROM nginx:alpine
COPY --from=build /app/dist/gestion-product-front/browser /usr/share/nginx/html

# ⚠️ On force le remplacement du default.conf
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
