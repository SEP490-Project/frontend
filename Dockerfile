# ==============================================================================
# Stage 1: Build the application
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# ==============================================================================
# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS final

ENV API_HOST=https://api.bshowsell.site
ENV API_PORT=443

# Remove the default Nginx config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["/bin/sh", "-c", "envsubst '$API_HOST $API_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
