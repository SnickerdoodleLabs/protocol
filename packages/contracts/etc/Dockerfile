FROM node:16.15-slim

RUN apt update -y \
  && apt install -y vim tmux

WORKDIR /root

COPY . .

RUN npm install

ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]