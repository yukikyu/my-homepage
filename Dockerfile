# docker run --name some-nginx -v ./docs/.vuepress/dist:/usr/share/nginx/html:ro -d nginx -p 80:80
FROM nginx
EXPOSE 80 443
# VOLUME ./docs/.vuepress/dist:/usr/share/nginx/html
COPY ./docs/.vuepress/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx

LABEL org.opencontainers.image.authors="yukikyu"