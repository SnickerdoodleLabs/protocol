ARG BASE_TAG=local
FROM snickerdoodlelabs/protocol-docker-base:${BASE_TAG} as builder

RUN cd packages/web-integration-test && yarn postCompile

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/web-integration-test/dist/bundle /usr/share/nginx/html
COPY --from=builder /build/packages/web-integration-test/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/packages/web-integration-test/default.conf /etc/nginx/conf.d/default.conf

