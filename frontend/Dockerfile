FROM node:18-alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g ts-node
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist/frontend"]
