# Dockerfile for transaction-service

FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
