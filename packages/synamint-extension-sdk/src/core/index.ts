import "reflect-metadata";
import {
  PersistenceError,
  AjaxError,
  UninitializedError,
  BlockchainProviderError,
  ISnickerdoodleCore,
  IExtensionConfigOverrides,
  IConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";
import { ResultAsync } from "neverthrow";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

export const initializeSDKCore = (
  extensionConfigOverrides: IExtensionConfigOverrides,
  coreConfigOverrides: IConfigOverrides,
): ResultAsync<
  ISnickerdoodleCore,
  PersistenceError | AjaxError | UninitializedError | BlockchainProviderError
> => {
  const extensionCore = new ExtensionCore(
    extensionConfigOverrides,
    coreConfigOverrides,
  );
  // Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
  // eslint-disable-next-line no-restricted-globals
  self["extensionCore"] = extensionCore;
  return extensionCore.initialize();
};
