
# Static Web Integration

## Summary

This package serves to create a javascript file that "static" websites can include on their site via some JS helper code and a configuration utility similar to Google Analytics. This JS file is just a prepacked version of web-integration with some bells and whistles that allow it to be configured and perform some basic operations via extremely minimal programming- no NPM required.

## Getting Started

If you are contributing to this project and developing on your local machine, you must run the SPA application when trying to use a local build of the 
[extension](/packages/static-web-integration/README.md). Use the following commands to create a local webserver on port `9001` serving the onboarding SPA:

```shell
cd /packages/extensions-onboarding/
yarn install
yarn build
yarn start
```

You should then be able to visit `http://localhost:9001` and see the onboarding application.