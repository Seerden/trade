FROM node:alpine

WORKDIR /trade/client

COPY package*.json .

RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "run", "serve"]

