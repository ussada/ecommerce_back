FROM node:8.15.1-alpine

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json /home/node/app/

RUN apk --no-cache add --virtual builds-deps build-base python

RUN npm install

COPY . /home/node/app

EXPOSE 3000

CMD sequelize db:migrate

CMD node app.js