FROM node:16 AS builder

WORKDIR /app

# Install all the yarn stuff
COPY .yarn .yarn
COPY package.json yarn.lock .yarnrc.yml ./
COPY packages/browserExtension/package.json ./packages/browserExtension/
COPY packages/cinnamon/package.json ./packages/cinnamon/
COPY packages/common-utils/package.json ./packages/common-utils/
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/contracts-sdk/package.json ./packages/contracts-sdk/
COPY packages/core/package.json ./packages/core/
COPY packages/extension-onboarding/package.json ./packages/extension-onboarding/
COPY packages/indexers/package.json ./packages/indexers/
COPY packages/insight-platform-api/package.json ./packages/insight-platform-api/
COPY packages/objects/package.json ./packages/objects/
COPY packages/persistence/package.json ./packages/persistence/
COPY packages/query-parser/package.json ./packages/query-parser/
COPY packages/signatureVerification/package.json ./packages/signatureVerification/
COPY packages/test-harness/package.json ./packages/test-harness/
COPY packages/utils/package.json ./packages/utils/
RUN yarn install --network-timeout 60000

# Now build the code
COPY . .
RUN yarn compile

WORKDIR /app/packages/extension-onboarding

ARG BUILD_ENV=PROD
ENV __BUILD_ENV__ $BUILD_ENV

ARG INFURA_ID=""
ENV __INFURA_ID__ $INFURA_ID

ARG GAPI_CLIENT_ID=""
ENV __GAPI_CLIENT_ID__ $GAPI_CLIENT_ID

ARG GA_TRACKING_ID=""
ENV __GA_TRACKING_ID__ $GA_TRACKING_ID

ARG HJID=""
ENV __HJID__ $HJID

ARG HJSV=""
ENV __HJSV__ $HJSV

RUN yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /app/packages/extension-onboarding/dist/bundle /usr/share/nginx/html
COPY --from=builder /app/packages/extension-onboarding/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/packages/extension-onboarding/default.conf /etc/nginx/conf.d/default.conf