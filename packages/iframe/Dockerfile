# First step is to build everything
FROM node:18 AS builder
LABEL Author Charlie Sibbach <charlie@snickerdoodlelabs.io>

WORKDIR /build

# Copy all the stuff needed to run and cache yarn
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/browserExtension/package.json /build/packages/browserExtension/package.json
COPY packages/common-utils/package.json /build/packages/common-utils/package.json
COPY packages/contracts/package.json /build/packages/contracts/package.json
COPY packages/contracts-sdk/package.json /build/packages/contracts-sdk/package.json
COPY packages/core/package.json /build/packages/core/package.json
COPY packages/extension-onboarding/package.json /build/packages/extension-onboarding/package.json
COPY packages/iframe/package.json /build/packages/iframe/package.json
COPY packages/indexers/package.json /build/packages/indexers/package.json
COPY packages/insight-platform-api/package.json /build/packages/insight-platform-api/package.json
COPY packages/mobile/package.json /build/packages/mobile/package.json
COPY packages/objects/package.json /build/packages/objects/package.json
COPY packages/persistence/package.json /build/packages/persistence/package.json
COPY packages/query-parser/package.json /build/packages/query-parser/package.json
COPY packages/shared-components/package.json /build/packages/shared-components/package.json
COPY packages/signatureVerification/package.json /build/packages/signatureVerification/package.json
COPY packages/synamint-extension-sdk/package.json /build/packages/synamint-extension-sdk/package.json
COPY packages/test-harness/package.json /build/packages/test-harness/package.json
COPY packages/utils/package.json /build/packages/utils/package.json
COPY packages/web-integration/package.json /build/packages/web-integration/package.json
COPY packages/web-integration-test/package.json /build/packages/web-integration-test/package.json
# RUN yarn set version berry
RUN yarn install --network-timeout 60000

ARG DEBUG=true
ENV __DEBUG__ $DEBUG

ARG CONTROL_CHAIN_ID=31337
ENV __CONTROL_CHAIN_ID__ $CONTROL_CHAIN_ID

ARG IPFS_FETCH_BASE_URL="http://127.0.0.1:8080/ipfs"
ENV __IPFS_FETCH_BASE_URL__ $IPFS_FETCH_BASE_URL

ARG DEFAULT_INSIGHT_PLATFORM_BASE_URL="http://localhost:3006"
ENV __DEFAULT_INSIGHT_PLATFORM_BASE_URL__ $DEFAULT_INSIGHT_PLATFORM_BASE_URL

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/iframe && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/iframe/dist/bundle /usr/share/nginx/html

