FROM mhart/alpine-node:14
LABEL version="1.0"
LABEL author="Dylan Steele"
LABEL org.opencontainers.image.authors="dylansteele57@gmail.com"

RUN npm install -g @microsoft/rush
RUN npm install pm2 -g
