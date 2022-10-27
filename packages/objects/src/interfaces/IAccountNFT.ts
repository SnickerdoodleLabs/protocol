import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import { AccountAddress, ChainId } from "@objects/primitives";

export interface IAccountNFT {
  type: EChainTechnology;
  chain: ChainId;
  owner: AccountAddress;
  token: TokenAddress;
}
