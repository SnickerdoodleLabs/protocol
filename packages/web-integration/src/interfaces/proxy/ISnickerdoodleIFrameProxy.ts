import {
  DomainName,
  ISdlDataWallet,
  PageInvitation,
  ProxyError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

export interface ISnickerdoodleIFrameProxy extends ISdlDataWallet {
  activate(): ResultAsync<void, ProxyError>;
  checkURLForInvitation(url: URLString): ResultAsync<void, ProxyError>;
  requestDashboardView(): ResultAsync<void, ProxyError>;
  getInvitationByDomain(
    domain: DomainName,
    path: string,
  ): ResultAsync<PageInvitation | null, ProxyError>;
  onIframeDisplayRequested: Observable<void>;
}

export const ISnickerdoodleIFrameProxyType = Symbol.for(
  "ISnickerdoodleIFrameProxy",
);
