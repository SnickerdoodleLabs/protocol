import { TokenAddress } from "@objects/businessObjects";
import { EChainTechnology } from "@objects/enum";
import { ChainId } from "@objects/primitives";

export type NftHoldings = {
  [type in keyof typeof EChainTechnology]?: {
    [chain: ChainId]: {
      [tokenAddress: TokenAddress]: {
        amount: number;
        name: string;
      };
    };
  };
};
