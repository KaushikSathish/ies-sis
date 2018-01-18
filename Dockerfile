FROM node:6
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm install
RUN npm install -g bower
RUN bower install --allow-root
ENV NODE_ENV=dev
COPY . /usr/src/app
EXPOSE 8008
CMD ["node","bin/www"]
