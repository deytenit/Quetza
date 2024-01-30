FROM node:20-alpine as builder

RUN apk add --no-cache python3
RUN apk add --no-cache curl
RUN apk add --no-cache make
RUN apk add --no-cache gcc
RUN apk add --no-cache build-base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

RUN mkdir ./dist/bin/
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/src/app/dist/bin/yt-dlp
RUN chmod a+rx /usr/src/app/dist/bin/yt-dlp

RUN pnpm install --prod


FROM node:20-alpine

RUN apk update
RUN apk add --no-cache ffmpeg
RUN apk add --no-cache python3

USER node
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./

CMD [ "node", "./src/index.js" ]
