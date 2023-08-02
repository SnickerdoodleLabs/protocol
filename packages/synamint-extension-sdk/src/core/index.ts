import "reflect-metadata";
import { ResultAsync } from "neverthrow";

import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";
import { IExtensionConfigOverrides } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

export const initializeSDKCore = (
  configOverrides: IExtensionConfigOverrides,
): ResultAsync<void, never> => {
  const extensionCore = new ExtensionCore(configOverrides);
  console.log("initializeSDKCore is called");
  // Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
  // eslint-disable-next-line no-restricted-globals
  self["extensionCore"] = extensionCore;
  console.log("initializeSDKCore is called 2");

  return extensionCore.initialize().map(() => {
    console.log("completed extensionCore initialize");
  });
};
