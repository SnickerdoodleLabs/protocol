ARG BASE_TAG=local
FROM snickerdoodlelabs/protocol-docker-base:${BASE_TAG} as builder

ARG LOGO_PATH=https://webpackage.snickerdoodle.com/snickerdoodle.png
ENV __LOGO_PATH__ $LOGO_PATH

ARG INTEGRATION_PATH=https://webpackage.snickerdoodle.com/
ENV __INTEGRATION_PATH__ $INTEGRATION_PATH

RUN cd packages/static-web-integration && yarn postCompile

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/static-web-integration/dist/bundle /usr/share/nginx/html
COPY --from=builder /build/packages/static-web-integration/src/snickerdoodle.png /usr/share/nginx/html
COPY --from=builder /build/packages/static-web-integration/static-demo.html /usr/share/nginx/html
COPY --from=builder /build/packages/static-web-integration/src/favicon /usr/share/nginx/html
COPY --from=builder /build/packages/static-web-integration/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/packages/static-web-integration/default.conf /etc/nginx/conf.d/default.conf

