FROM node:latest

WORKDIR /app

COPY ./package*.json ./

RUN set -x ; cd /app \
  && npm install -g npm \
  && npm i
# && npm global install pm2

COPY . .

EXPOSE 4000

# CMD [ "npm", "run","dev" ]