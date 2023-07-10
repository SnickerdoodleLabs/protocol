# First step is to build everything
FROM node:14 AS builder

WORKDIR /build

# Copy all the stuff needed to run and cache yarn
COPY ./package.json /build/package.json
COPY ./yarn.lock /build/yarn.lock
COPY ./packages/governance-sdk/package.json /build/packages/governance-sdk/package.json
COPY ./packages/development/package.json /build/packages/development/package.json
COPY ./packages/hypernet-core/package.json /build/packages/hypernet-core/package.json
COPY ./packages/iframe/package.json /build/packages/iframe/package.json
COPY ./packages/gateway-connector/package.json /build/packages/gateway-connector/package.json
COPY ./packages/gateway-iframe/package.json /build/packages/gateway-iframe/package.json
COPY ./packages/mobile-integration/package.json /build/packages/mobile-integration/package.json
COPY ./packages/objects/package.json /build/packages/objects/package.json
COPY ./packages/test-gateway/package.json /build/packages/test-gateway/package.json
COPY ./packages/test-gateway-connector/package.json /build/packages/test-gateway-connector/package.json
COPY ./packages/user-dashboard/package.json /build/packages/user-dashboard/package.json
COPY ./packages/utils/package.json /build/packages/utils/package.json
COPY ./packages/web-demo/package.json /build/packages/web-demo/package.json
COPY ./packages/web-integration/package.json /build/packages/web-integration/package.json
COPY ./packages/web-ui/package.json /build/packages/web-ui/package.json
RUN yarn config set network-timeout 600000
RUN yarn install

# Configuration for the protocol is baked in at build time
# We create a bunch of ARGs so that we can configure it properly
# for the environment.
ARG BUILD_ENV=development
ENV __BUILD_ENV__ $BUILD_ENV
RUN echo $__BUILD_ENV__

ARG IFRAME_SOURCE=http://localhost:5000
ENV __IFRAME_SOURCE__ $IFRAME_SOURCE
RUN echo $__IFRAME_SOURCE__

ARG NATS_URL=wss://dev-nats.hypernet.foundation:4221
ENV __NATS_URL__ $NATS_URL

RUN echo $__NATS_URL__

ARG AUTH_URL=http://localhost:5040
ENV __AUTH_URL__ $AUTH_URL
RUN echo $__AUTH_URL__

ARG VALIDATOR_IFRAME_URL=http://localhost:5005
ENV __VALIDATOR_IFRAME_URL__ $VALIDATOR_IFRAME_URL
RUN echo $__VALIDATOR_IFRAME_URL__

ARG CERAMIC_NODE_URL=https://clay.ceramic.hypernet.foundation
ENV __CERAMIC_NODE_URL__ $CERAMIC_NODE_URL
RUN echo $__CERAMIC_NODE_URL__

ARG IPFS_API_URL=http://localhost:5021
ENV __IPFS_API_URL__ $IPFS_API_URL
RUN echo $__IPFS_API_URL__

ARG IPFS_GATEWAY_URL=http://localhost:8088
ENV __IPFS_GATEWAY_URL__ $IPFS_GATEWAY_URL
RUN echo $__IPFS_GATEWAY_URL__

ARG DEBUG=true
ENV __DEBUG__ $DEBUG

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/iframe && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/iframe/dist/bundle /usr/share/nginx/html

