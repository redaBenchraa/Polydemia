FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run nest build
CMD [ "node", "dist/main.js" ]
