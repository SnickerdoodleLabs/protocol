FROM node:16 AS builder

WORKDIR /app

# Install all the yarn stuff
COPY package.json yarn.lock lerna.json ./
COPY packages/extension-onboarding/package.json ./packages/extension-onboarding/
RUN yarn install --network-timeout 60000

# Now build the code
COPY . .
RUN yarn compile

WORKDIR /app/packages/extension-onboarding

ARG BUILD_ENV=development
ENV __BUILD_ENV__ $BUILD_ENV

ARG DOMAIN=""
ENV __DOMAIN__ $DOMAIN

ARG INFURA_ID=""
ENV __INFURA_ID__ $INFURA_ID

ARG GAPI_CLIENT_ID=""
ENV __GAPI_CLIENT_ID__ $GAPI_CLIENT_ID

RUN yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /app/packages/extension-onboarding/dist/bundle /usr/share/nginx/html
COPY --from=builder /app/packages/extension-onboarding/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/packages/extension-onboarding/default.conf /etc/nginx/conf.d/default.conf