import { ISdlDataWallet, ProxyError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISnickerdoodleIFrameProxy extends ISdlDataWallet {
  activate(): ResultAsync<void, ProxyError>;
}

export const ISnickerdoodleIFrameProxyType = Symbol.for(
  "ISnickerdoodleIFrameProxy",
);
