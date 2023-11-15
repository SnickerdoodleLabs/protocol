import {
  PersistenceError,
  AjaxError,
  UninitializedError,
  BlockchainProviderError,
  IExtensionConfigOverrides,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
export declare const initializeSDKCore: (
  extensionConfigOverrides: IExtensionConfigOverrides,
  coreConfigOverrides: IConfigOverrides,
) => ResultAsync<
  ISnickerdoodleCore,
  PersistenceError | AjaxError | UninitializedError | BlockchainProviderError
>;
