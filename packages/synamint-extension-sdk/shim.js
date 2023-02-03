/* eslint-disable @typescript-eslint/no-var-requires */
const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const lineReader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const REQUIRED_PERMISSIONS = ["cookies", "tabs", "storage", "activeTab"];

const INJECTABLE_BUNDLE_NAME = "dataWalletProxy.bundle.js";
const INJECTABLE_BUNDLE_PATH = "injectables/";
const ALL_URLS = "<all_urls>";

const ACCESSIBLE_RESOURCE = {
  resources: [INJECTABLE_BUNDLE_NAME],
  matches: [ALL_URLS],
};

const V3_MANIFEST_KEYS = {
  permissions: "permissions",
  web_accessible_resources: "web_accessible_resources",
};

let manifestAbsolutePath;

const rootDir = path.join(__dirname, "../../..");

exec(`find ${rootDir} -name manifest.json -print`, (err, stdout, stderr) => {
  if (err) {
    console.error("Auto configuration failed", "\n", stderr);
  } else {
    const pathList = stdout
      .split("\n")
      .filter((path) => Boolean(path) && !path.includes("src"));
    if (!pathList.length) {
      return console.warn("could not detect build folder");
    } else if (pathList.length > 1) {
      lineReader.question(
        `Multiple file paths found containing the manifest file\nSelect one below.\n${pathList
          .map((path, index) => `${index} - ${path}\n`)
          .join("")}`,
        (index) => {
          if (Number(index) > pathList.length - 1 || Number(index) < 0) {
            console.error("Invalid selection");
          } else {
            manifestAbsolutePath = pathList[index];
            configure();
          }
          lineReader.close();
        },
      );
    } else {
      manifestAbsolutePath = pathList[0];
      configure();
    }
  }
});

const copyBundle = () => {
  const buildDir = path.dirname(manifestAbsolutePath);
  exec(
    `cp build/${INJECTABLE_BUNDLE_PATH}${INJECTABLE_BUNDLE_NAME} ${buildDir}`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(
          "bundle could not coppied please try manual configuration",
          "\n",
          stderr,
        );
      } else {
        console.log("bundle successfully copied");
        ovverideManifest();
      }
    },
  );
};

const ovverideManifest = () => {
  fs.readFile(manifestAbsolutePath, "utf8", (err, data) => {
    if (err) {
      console.error("could not read manifest file", err);
      return;
    }
    let manifestObj = {};
    try {
      manifestObj = JSON.parse(data);
    } catch (error) {
      console.error("could not parse manifest file", err);
      return;
    }
    // update permissions
    manifestObj[V3_MANIFEST_KEYS.permissions] = Array.from(
      new Set([
        ...REQUIRED_PERMISSIONS,
        ...(Array.isArray(manifestObj[V3_MANIFEST_KEYS.permissions])
          ? manifestObj[V3_MANIFEST_KEYS.permissions]
          : []),
      ]),
    );
    // update resources
    const resourcesIndex = manifestObj[
      V3_MANIFEST_KEYS.web_accessible_resources
    ]?.findIndex((resource) => resource?.matches?.includes?.(ALL_URLS));
    if (resourcesIndex > -1) {
      manifestObj[V3_MANIFEST_KEYS.web_accessible_resources][resourcesIndex] = {
        ...manifestObj[V3_MANIFEST_KEYS.web_accessible_resources][
          resourcesIndex
        ],
        resources: Array.from(
          new Set([
            ...ACCESSIBLE_RESOURCE.resources,
            ...manifestObj[V3_MANIFEST_KEYS.web_accessible_resources][
              resourcesIndex
            ].resources,
          ]),
        ),
      };
    } else {
      manifestObj[V3_MANIFEST_KEYS.web_accessible_resources] = [
        ...(Array.isArray(
          manifestObj[V3_MANIFEST_KEYS.web_accessible_resources],
        )
          ? manifestObj[V3_MANIFEST_KEYS.web_accessible_resources]
          : []),
        ACCESSIBLE_RESOURCE,
      ];
    }
    fs.writeFile(manifestAbsolutePath, JSON.stringify(manifestObj), (err) => {
      if (err) console.err(err);
      else {
        console.log("manifest configuration completed");
        process.exit();
      }
    });
  });
};

const configure = () => {
  copyBundle();
};
