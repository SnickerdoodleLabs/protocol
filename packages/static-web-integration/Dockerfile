ARG BASE_TAG=local
FROM snickerdoodlelabs/protocol-docker-base:${BASE_TAG} as builder

RUN cd packages/static-web-integration && yarn postCompile

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/static-web-integration/dist/bundle /usr/share/nginx/html
COPY --from=builder /build/packages/static-web-integration/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/packages/static-web-integration/default.conf /etc/nginx/conf.d/default.conf

