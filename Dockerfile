FROM node:18-alpine as builder

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:18-alpine

RUN apk update
RUN apk add --no-cache bash
RUN apk add --no-cache curl
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache python3

RUN npm install -g pnpm

ENV NODE_ENV production
USER node

WORKDIR /usr/src/app

RUN mkdir bin
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/src/app/bin/yt-dlp
RUN chmod a+rx /usr/src/app/bin/yt-dlp

COPY prisma/ .
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

RUN pnpx prisma migrate deploy

COPY --from=builder /usr/src/app/dist ./dist

CMD [ "pnpm", "start" ]
