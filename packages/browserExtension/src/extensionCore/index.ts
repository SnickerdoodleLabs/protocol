import "reflect-metadata";
import { ExtensionCore } from "@implementations/ExtensionCore";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

const extensionCore = new ExtensionCore();

// Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
// eslint-disable-next-line no-restricted-globals
self["extensionCore"] = extensionCore;

extensionCore
  .initialize()
  .map(() => {
    console.log("ExtensionCore Initialized!");
  })
  .mapErr((e) => {
    console.error("Error while initializing ExtensionCore", e);
  });
