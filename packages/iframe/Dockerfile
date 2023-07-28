ARG BASE_TAG=local
FROM snickerdoodlelabs/protocol-docker-base:${BASE_TAG} as builder

ARG DEBUG=true
ENV __DEBUG__ $DEBUG

ARG CONTROL_CHAIN_ID=31337
ENV __CONTROL_CHAIN_ID__ $CONTROL_CHAIN_ID

ARG IPFS_FETCH_BASE_URL="http://127.0.0.1:8080/ipfs"
ENV __IPFS_FETCH_BASE_URL__ $IPFS_FETCH_BASE_URL

ARG DEFAULT_INSIGHT_PLATFORM_BASE_URL="http://localhost:3006"
ENV __DEFAULT_INSIGHT_PLATFORM_BASE_URL__ $DEFAULT_INSIGHT_PLATFORM_BASE_URL

RUN cd packages/iframe && yarn postCompile

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/iframe/dist/bundle /usr/share/nginx/html

