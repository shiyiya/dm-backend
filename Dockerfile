FROM node:alpine

RUN mkdir /app

WORKDIR /app

COPY package.json /app/

RUN set -x ; cd /app \
  && yarn install

EXPOSE 3000 3306

# CMD [ "yarn", "dev2" ]