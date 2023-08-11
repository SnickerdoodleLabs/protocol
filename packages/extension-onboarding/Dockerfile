ARG BASE_TAG=local
FROM snickerdoodlelabs/protocol-docker-base:${BASE_TAG} as builder

ARG BUILD_ENV=PROD
ENV __BUILD_ENV__ $BUILD_ENV

ARG INFURA_ID=""
ENV __INFURA_ID__ $INFURA_ID

ARG GAPI_CLIENT_ID=""
ENV __GAPI_CLIENT_ID__ $GAPI_CLIENT_ID

ARG GA_TRACKING_ID="UA-219658390-2"
ENV __GA_TRACKING_ID__ $GA_TRACKING_ID

ARG HOTJAR_ID="3259314"
ENV __HOTJAR_ID__ $HOTJAR_ID

ARG HOTJAR_SNIPPET_VERSION="6"
ENV __HOTJAR_SNIPPET_VERSION__ $HOTJAR_SNIPPET_VERSION

ARG GOOGLE_CLOUD_BUCKET=""
ENV __GOOGLE_CLOUD_BUCKET__ $GOOGLE_CLOUD_BUCKET

ARG IPFS_FETCH_BASE_URL="https://ipfs-gateway.snickerdoodle.dev/ipfs/"
ENV __IPFS_FETCH_BASE_URL__ $IPFS_FETCH_BASE_URL

ARG INFURA_ID="a6271a49218848a7ad939ee62d225914"
ENV __PRIMARY_INFURA_KEY__ $INFURA_ID

ARG IFRAME_URL="http://localhost:9010"
ENV __IFRAME_URL__ $IFRAME_URL

RUN cd packages/extension-onboarding && yarn postCompile

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/extension-onboarding/dist/bundle /usr/share/nginx/html
COPY --from=builder /build/packages/extension-onboarding/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/packages/extension-onboarding/default.conf /etc/nginx/conf.d/default.conf
