import { ISdlDataWallet, ProxyError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface ISnickerdoodleIFrameProxy extends ISdlDataWallet {
  activate(): ResultAsync<void, ProxyError>;

  onIframeDisplayRequested: Observable<void>;
}

export const ISnickerdoodleIFrameProxyType = Symbol.for(
  "ISnickerdoodleIFrameProxy",
);
