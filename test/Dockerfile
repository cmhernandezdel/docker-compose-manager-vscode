FROM node:22 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM node:22-alpine AS runtime
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .
ENTRYPOINT [ "npm", "start" ]