FROM node:18-slim

# we need tmux for background sessions and curl for fetching avalanche tools
RUN apt update -y \
  && apt install -y vim tmux curl git

WORKDIR /root

# copy the contracts package into the working directory
COPY . .

# install contracts package dependencies
#RUN npm install

#ENTRYPOINT [ "/bin/bash", "entrypoint.sh" ]