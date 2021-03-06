﻿FROM node:8.15.1-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY . /home/node/app

# RUN npm test

RUN rm /home/node/app/.env

EXPOSE 3000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]