FROM node:carbon

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 8000
EXPOSE 8080

CMD ["node", "index.js"]


