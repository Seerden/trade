FROM node:alpine

WORKDIR /trade/server

COPY package*.json .

RUN npm install
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]