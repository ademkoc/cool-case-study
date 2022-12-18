FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ARG HUSKY=0

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]