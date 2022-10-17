import { TokenAddress } from "@objects/businessObjects";
import { AccountAddress, ChainId } from "@objects/primitives";

export interface IAccountNFT {
  chain: ChainId;
  owner: AccountAddress;
  token: TokenAddress;
}
