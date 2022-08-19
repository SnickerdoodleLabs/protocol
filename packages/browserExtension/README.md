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

First build the extension:

```shell
cd /packages/browserExtension/
yarn install
yarn build
```

This will create a folder called `build`. Open Chrome Browser, visit URL [`chrome://extensions`](chrome://exentions), and enable developer Mode. Next,
click on ‘Load unpacked’ and choose the `/build` directory that was just created.

Once you have installed the extension, you will need to run the [onboarding pages application](/packages/extension-onboarding/README.md). 