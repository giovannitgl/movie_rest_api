from node:16.2.0-alpine3.13

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD ["nodemon"]
