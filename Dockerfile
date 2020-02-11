FROM node:8.15.1-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY . /home/node/app

ENV DB_HOST $secrets.DB_HOST

ENV DB_USER $secrets.DB_USER

ENV DB_PASSWORD $secrets.DB_PASSWORD

ENV DB_PORT $secrets.DB_PORT

ENV API_ACCESS_KEY $secrets.API_ACCESS_KEY

RUN npm test

EXPOSE 3000

COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]