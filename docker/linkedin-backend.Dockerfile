FROM node:12.16.3


WORKDIR /home/node/app
RUN mkdir -p /home/node/app/data
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY  . .
EXPOSE 3001
RUN npm run build
CMD ["node", "dist/app/server.js" ]
