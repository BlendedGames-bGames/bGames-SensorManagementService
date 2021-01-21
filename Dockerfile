FROM node:lts-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . ./
RUN ls -l
CMD ["npm-run-all", "--serial", "prestart", "start"]