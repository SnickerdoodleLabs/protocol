import {
  AccountAddress,
  ISdlDataWallet,
  ProxyError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface ISnickerdoodleIFrameProxy extends ISdlDataWallet {
  activate(): ResultAsync<void, ProxyError>;

  /**
   * This method should really replace addAccount() in the core
   * for the proxy. If the integrator detects that a new account
   * is in use by the user, it can tell the iframe about it and
   * the iframe can take action to suggest linking the account
   * @param accountAddress
   */
  suggestAddAccount(
    accountAddress: AccountAddress,
  ): ResultAsync<void, ProxyError>;

  onIframeDisplayRequested: Observable<void>;
}

export const ISnickerdoodleIFrameProxyType = Symbol.for(
  "ISnickerdoodleIFrameProxy",
);
