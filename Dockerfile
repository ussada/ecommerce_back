FROM node:8.15.1-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY . /home/node/app

ARG DB_HOST

ARG DB_USER

ARG DB_PASSWORD

ARG DB_PORT

ARG API_ACCESS_KEY

ENV DB_HOST=$DB_HOST

ENV DB_USER=$DB_USER

ENV DB_PASSWORD=$DB_PASSWORD

ENV DB_PORT=$DB_PORT

ENV API_ACCESS_KEY=$API_ACCESS_KEY

RUN echo $DB_HOST

RUN echo $DB_USER

RUN echo $DB_PASSWORD

RUN echo $DB_PORT

RUN echo $API_ACCESS_KEY

RUN npm test

EXPOSE 3000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]