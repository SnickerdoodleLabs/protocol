![Onboarding Pages](https://github.com/SnickerdoodleLabs/Snickerdoodle-Theme-Light/blob/main/snickerdoodle_horizontal_notab.png?raw=true)

# Onboarding Single Page Application

## Package Contents

- [src](/packages/browserExtension/src/): source code for the Snickerdoodle Protocol [SPA](https://en.wikipedia.org/wiki/Single-page_application) which handles web-based interaction with the data wallet

## Summary

![Onboarding SPA](/documentation/images/onboarding-page-one.png)

This package contains a [React](https://reactjs.org/)-based web application, the purpose of which is to serve as the primary user interface to the mobile and browser extension form 
factors of the Snickerdoodle Data wallet. The onboarding pages currently allow the user to:

1. Cryptographically link an [Externally Owned Account](https://ethereum.org/en/developers/docs/accounts/) (EOA)
2. Link your Google Account and import (or manually fill in) basic location and demographic information
3. View and manage the contents of your linked crypto and [SSO](https://en.wikipedia.org/wiki/Single_sign-on) accounts 

The SPA expects that the data wallet will inject its API into the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction). In the case where 
the API is not detected, the SPA will direct the user to install an appropriate form-factor of the data wallet. 

## Getting Started

If you are contributing to this project and developing on your local machine, you must run the SPA application when trying to use a local build of the 
[extension](/packages/browserExtension/README.md). Use the following commands to create a local webserver on port `9001` serving the onboarding SPA:

```shell
cd /packages/extensions-onboarding/
yarn install
yarn build
yarn start
```

You should then be able to visit `http://localhost:9001` and see the onboarding application.