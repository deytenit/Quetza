FROM node:18-alpine

RUN apk update
RUN apk add --no-cache bash
RUN apk add --no-cache curl
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache python3

WORKDIR /usr/src/app

RUN mkdir bin
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/src/app/bin/youtube-dl
RUN chmod a+rx /usr/src/app/bin/youtube-dl

COPY . .
RUN npm ci

CMD [ "npm", "start" ]
