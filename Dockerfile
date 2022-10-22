FROM node:16

RUN apt -y update
RUN apt install -y ffmpeg
RUN apt install -y python3-pip


WORKDIR /usr/src/app

RUN mkdir bin
RUN curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/src/app/bin/youtube-dl
RUN chmod a+rx /usr/src/app/bin/youtube-dl


COPY package*.json ./
RUN npm ci

COPY . .
run npm run build

CMD [ "npm", "start" ]