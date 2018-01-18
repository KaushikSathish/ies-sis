FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN npm install -g bower
ENV NODE_ENV=dev
COPY . /usr/src/app
RUN bower install --allow-root
EXPOSE 8008
CMD ["node","bin/www"]
