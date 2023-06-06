import "reflect-metadata";
import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

// this adds sqliteWorker instance to serviceworker's global scope
// do not remove the importScripts
importScripts("./db/sw.js");

// use that instance anywhere under any package
// do not change the hardcoded dist field
// put typeof <> == "undefined" condition and ts-ignore decorator before you use the instance to avoid any compiling issue
// ready to test functions with the serviceworker's console
// since this is a web worker code types are not defined assign types from sqlite/types package, be careful, some of the functions not gonna work the same way
// and

// @ts-ignore
sqliteWorker({ dist: "./db", name: "sdl-db" }).then(
  ({ all, get, query, raw, transaction }) => {
    self["query"] = query;
    self["all"] = all;
    self["raw"] = raw;
    self["get"] = get;
    self["transaction"] = transaction;
  },
);

export const extensionCore = new ExtensionCore();

// Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
// eslint-disable-next-line no-restricted-globals
self["extensionCore"] = extensionCore;
