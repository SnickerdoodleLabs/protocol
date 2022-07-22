// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";
// @TODO: replace to extension_onboarding url
process.env.__ONBOARDING_URL__ = "https://localhost:9005/";
process.env.__ACCOUNT_COOKIE_URL__ = "https://snickerdoodlelabs.io/";

var webpack = require("webpack"),
  config = require("../webpack.config");

config.mode = "production";

webpack(config, function (err) {
  if (err) throw err;
});
