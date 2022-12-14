// These values are appropriate for Develop environment
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.ASSET_PATH = "/";

var path = require("path");

var fs = require("fs-extra");
var webpack = require("webpack");

var config = require("../webpack.config.cjs");

// Get the build environments
const buildEnv = process.argv[2];
console.log(`Building extension for ${buildEnv} to build-${buildEnv}`);

config.mode = "development";

webpack(config, function (err) {
  if (err) throw err;

  console.log("Complete webpack build");

  const envBuildPath = path.join(__dirname, `../build-${buildEnv}`);

  // Remove the existing build
  fs.rmSync(envBuildPath, { recursive: true, force: true });

  // move the build directory to the output location
  fs.move(path.join(__dirname, "../build"), envBuildPath, function (err) {
    if (err) throw err;

    fs.remove;
  });
});
