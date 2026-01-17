FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN mkdir -p /app/node_modules

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
