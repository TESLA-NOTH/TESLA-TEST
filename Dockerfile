FROM node:20.17-buster

WORKDIR /app

COPY package*.json ./


RUN npm install -g npm@11.12.1

RUN npm install
RUN npm install -g pm2

COPY . .

EXPOSE 3000

CMD ["npm", "start"]