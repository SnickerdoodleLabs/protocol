const fs = require("fs-extra");

const ROOT_DIR = "../../";

const PACKAGE_PATH = "node_modules/cross-fetch/dist/browser-ponyfill.js";

const FILE_PATH = `${ROOT_DIR}${PACKAGE_PATH}`;

(() => {
  fs.readFile(FILE_PATH, "utf8", (error, data) => {
    if (error) {
      return console.log(`file not exist for given path: ${FILE_PATH}`);
    }
    if (data.includes("var ctx = __self__;")) {
      const updatedContent = data.replace(
        /var ctx = __self__;/g,
        "var ctx = global.fetch ? global : __self__;",
      );
      fs.writeFile(FILE_PATH, updatedContent, "utf8", (error) => {
        if (error) return console.log(error);
        return console.log("success");
      });
    }
  });
})();
