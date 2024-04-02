import "reflect-metadata";
import "subworkers";
import {
  PersistenceError,
  AjaxError,
  UninitializedError,
  BlockchainProviderError,
  ISnickerdoodleCore,
  IExtensionConfigOverrides,
  IConfigOverrides,
  IExtensionSdkConfigOverrides,
} from "@snickerdoodlelabs/objects";
import { ExtensionCore } from "@synamint-extension-sdk/core/implementations/ExtensionCore";
import { ResultAsync } from "neverthrow";

console.log(
  "Creating ExtensionCore. Access via this.extensionCore in debugger",
);

export const initializeSDKCore = (
  config: IExtensionSdkConfigOverrides,
): ResultAsync<
  ISnickerdoodleCore,
  PersistenceError | AjaxError | UninitializedError | BlockchainProviderError
> => {
  const extensionCore = new ExtensionCore(config);
  // Assigning to self so that you can access the ExtensionCore via this.extensionCore in the serviceworker debugger
  // eslint-disable-next-line no-restricted-globals
  self["extensionCore"] = extensionCore;
  return extensionCore.initialize();
};
