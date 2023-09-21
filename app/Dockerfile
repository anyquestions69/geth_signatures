FROM node:16.14.0-alpine 
RUN apk add --no-cache tzdata
ENV TZ Europe/Moscow
ENV NODE_PATH /opt/server/node_modules
WORKDIR /opt/server
#COPY package*.json ./

#RUN npm i

COPY . .

EXPOSE 3000

CMD [ "npm" ,"run start"]

