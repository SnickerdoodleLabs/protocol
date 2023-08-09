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
COPY packages/static-web-integration/package.json /build/packages/static-web-integration/package.json
COPY packages/synamint-extension-sdk/package.json /build/packages/synamint-extension-sdk/package.json
COPY packages/test-harness/package.json /build/packages/test-harness/package.json
COPY packages/utils/package.json /build/packages/utils/package.json
COPY packages/web-integration/package.json /build/packages/web-integration/package.json
COPY packages/web-integration-test/package.json /build/packages/web-integration-test/package.json
# RUN yarn set version berry
RUN yarn install --network-timeout 60000

# Copy the rest of the stuff and build
COPY . /build
RUN yarn compile
