FROM node:18.12.0

RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./startup.ci.sh /opt/startup.ci.sh
RUN sed -i 's/\r//g' /opt/startup.ci.sh

WORKDIR /usr/src/app
RUN cp env_example .env
RUN npx prisma generate
RUN npm run build

CMD ["/opt/startup.ci.sh"]