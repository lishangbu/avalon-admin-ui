ARG NODE_IMAGE=node:24-alpine
ARG NGINX_IMAGE=nginx:1.29-alpine

FROM ${NODE_IMAGE} AS build

WORKDIR /app

COPY package.json .npmrc ./

RUN npm install

COPY . .

RUN npm run build-only

FROM ${NGINX_IMAGE} AS runtime

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
