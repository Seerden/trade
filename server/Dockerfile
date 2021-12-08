FROM node:alpine

WORKDIR /trade/server

ENV NODE_ENV=development

COPY package*.json .

RUN npm install
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]