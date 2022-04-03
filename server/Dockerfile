FROM node:alpine

WORKDIR /trade/server

COPY package*.json .

RUN npm ci
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]