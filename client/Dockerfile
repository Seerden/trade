FROM node:alpine

WORKDIR /trade/client

COPY package*.json .

RUN npm ci

COPY . .
EXPOSE 3000

CMD ["npm", "run", "serve"]