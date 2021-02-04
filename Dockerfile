FROM node:alpine

WORKDIR /app

COPY ./package*.json ./

RUN set -x ; cd /app \
  && npm i

COPY . .

EXPOSE 3000 3306

CMD [ "npm", "run","dev" ]