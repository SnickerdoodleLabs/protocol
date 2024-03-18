import { EChain } from "@objects/enum/EChain.js";
import { EVMContractAddress } from "@objects/primitives/EVMContractAddress.js";
import { URLString } from "@objects/primitives/URLString.js";

export interface IBrandInformation {
  name: string;
  logoImage?: URLString;
  coverImage?: URLString;
  description?: string;
  links: {
    name: string;
    url: URLString;
  }[];
  tokenReward?: {
    contractAddress?: EVMContractAddress;
    chainId?: EChain;
    name?: string;
  };
}
