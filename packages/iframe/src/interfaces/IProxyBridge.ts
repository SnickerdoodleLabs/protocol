import { ISdlDataWallet } from "@snickerdoodlelabs/objects";

export interface IProxyBridge extends ISdlDataWallet {
  requestLinkAccount(): void;
}
