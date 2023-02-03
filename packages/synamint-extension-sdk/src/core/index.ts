import "reflect-metadata";
import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

export const extensionCore = new ExtensionCore();

// Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
// eslint-disable-next-line no-restricted-globals
self["extensionCore"] = extensionCore;
