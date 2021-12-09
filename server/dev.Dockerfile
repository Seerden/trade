FROM node:alpine

WORKDIR /trade/server

ENV NODE_ENV=development

COPY package*.json .

RUN npm install
COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]