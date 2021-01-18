FROM node:lts-alpine
WORKDIR /usr/src/app
COPY bGames-SensorManagementService/package*.json ./
RUN npm install
COPY bGames-SensorManagementService ./
RUN ls -l
CMD ["npm", "run", "prod"]