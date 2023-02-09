import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import { AccountAddress, ChainId } from "@objects/primitives";

export abstract class WalletNFT {
  public constructor(
    public type: EChainTechnology,
    public chain: ChainId,
    public owner: AccountAddress,
    public token: TokenAddress,
    
  ) {}
}
// when to use async 
// making normal func to async 
// event loop javascript 
// better way to structure code class? -- polymhorpisim clean code core gateway
// make web3 query , -> nft , network query -> contract query ev, sdql calls we3 query , then nft
// also web3 query , webEval , sdql only klnow those