import { TokenAddress } from "@objects/interfaces";
import { AccountAddress, ChainId } from "@objects/primitives";

export interface AccountNFT {
  chain: ChainId;
  owner: AccountAddress;
  token: TokenAddress;
}
