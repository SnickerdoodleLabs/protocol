import {
  PersistenceError,
  AjaxError,
  UninitializedError,
  BlockchainProviderError,
  IExtensionSdkConfigOverrides,
  ISnickerdoodleCore,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
export declare const initializeSDKCore: (
  config: IExtensionSdkConfigOverrides,
) => ResultAsync<
  ISnickerdoodleCore,
  PersistenceError | AjaxError | UninitializedError | BlockchainProviderError
>;
