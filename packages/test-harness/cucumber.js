// export default `--format-options '{"snippetInterface": "synchronous"}' --publish-quiet`
const common = {
  paths: ["src/features/**/*.feature"],
  import: ["dist/steps/**/*.js"],
  format: ["progress-bar", "@cucumber/pretty-formatter"],
};

// This is setup to support Profiles. We can export other named objects to support different
// configs loaded with the -p flag in package.json
export default {
  ...common,
};
