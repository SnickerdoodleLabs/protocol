// These values are appropriate for Develop environment
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";
process.env.ASSET_PATH = "/";

var webpack = require("webpack");
var config = require("../webpack.config");
var fs = require("fs-extra");
var path = require("path");

// Get the build environments
const buildEnv = process.argv[2];
console.log(`Building extension for ${buildEnv} to build-${buildEnv}`);

config.mode = "production";

webpack(config, function (err) {
  if (err) throw err;

  const envBuildPath = path.join(__dirname, `../build-${buildEnv}`)

  // Remove the existing build
  fs.rmSync(envBuildPath, { recursive: true, force: true });
  
  // move the build directory to the output location
  fs.move(path.join(__dirname, "../build"), envBuildPath, function (err) {
    if (err) throw err;

    fs.remove
  });
});

