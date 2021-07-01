# FROM node:10.23.3
FROM node:lts-alpine3.12

ENV APP_ROOT /src

WORKDIR ${APP_ROOT}

# RUN npm i yarn -g
COPY package.json .
# COPY package-lock.json .
RUN yarn
#RUN npm install
COPY . .

CMD yarn start
