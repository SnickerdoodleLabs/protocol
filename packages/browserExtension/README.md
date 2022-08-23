![Core](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Browser Extension

## Package Contents

- [src](/packages/browserExtension/src/): source code for the browser extension which instantiates and instance of the Core package
- [utils](/packages/browserExtension/utils/): scripts and configs for building the browser extension bundle

## Summary

![Data Wallet Logic Layers](/documentation/images/datawallet-architecture.png)

The package bundles the Core package as a browser extension form-factor which is used in conjunction with the [onboarding]() [SPA]() which itself also functions as the 
primary user interface of the Snickerdoodle protocol. This repository was bootstrapped using [Chrome Extension Boilerplate](https://github.com/lxieyang/chrome-extension-boilerplate-react).

## Local Development

You need a different version of the extension for each environment you want to run it against. For local dev, we support running it in the Webpack dev server with hot reload. For other environments, you will build a different static version. 

For all builds, you need to build the project like you normally would. See the README.md at the root for instructions. It is mostly:

```shell
yarn install
yarn compile
```

For local testing, you will need to have the browser extension running in one terminal, and the extension-onboarding package in another. See the [README](/packages/extension-onboarding/README.md) in extension-onboarding for instructions for that package. 
To start the browser extension, open a terminal:

```shell
cd /packages/browserExtension/
yarn start
```

This will create a folder called `build`. Open Chrome Browser, visit URL [`chrome://extensions`](chrome://exentions), and enable developer Mode. Next,
click on ‘Load unpacked’ and choose the `/build` directory that was just created.

## Other environments
You can build the extension for any environment you want, without the benefit of hot reload. The output is put into a build-{env} folder, so the dev build ends up in build-dev, and production in build-prod.

You can use the commands

```shell
yarn build-dev
```
or
```shell
yarn build-prod
```