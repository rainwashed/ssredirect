FROM oven/bun:latest

WORKDIR /app

COPY . ./
COPY ./view ./view

RUN mkdir ./db
VOLUME ./db

RUN bun install
RUN cd view && bun install && bun run build && cd .. 

WORKDIR /app

RUN bun run build

ENV PORT=3002
ENV ADMIN_USER=admin
ENV ADMIN_PASSWORD=admin

EXPOSE 3002

CMD ["bun", "run", "start"]