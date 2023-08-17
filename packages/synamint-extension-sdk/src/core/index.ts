import "reflect-metadata";
import {
  PersistenceError,
  AjaxError,
  UninitializedError,
  BlockchainProviderError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";
import { IExtensionConfigOverrides } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

export const initializeSDKCore = (
  configOverrides: IExtensionConfigOverrides,
): ResultAsync<
  void,
  PersistenceError | AjaxError | UninitializedError | BlockchainProviderError
> => {
  const extensionCore = new ExtensionCore(configOverrides);
  // Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
  // eslint-disable-next-line no-restricted-globals
  self["extensionCore"] = extensionCore;
  return extensionCore.initialize();
};
