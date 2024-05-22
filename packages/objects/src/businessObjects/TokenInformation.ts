import {
  EChain,
  ESupportedTokenName,
  ETokenType,
} from "@objects/enum/index.js";
import { ChainId, EVMContractAddress } from "@objects/primitives/index.js";

// Designed to account for similar token names but existing on different chain
// Eg. Wrapped ETH ERC20 on other chains
export class SupportedToken {
  public constructor(
    public tokenName: ESupportedTokenName,
    public chain: EChain,
  ) {}
}

// Designed to be extended for different type of token types
export class TokenInformation {
  public constructor(
    public name: string,
    public symbol: string,
    public chainId: ChainId,
    public tokenType: ETokenType,
    public contractAddress: EVMContractAddress,
    public decimals: number,
  ) {}
}

// Extended to have ERC20 specific information
export class ERC20TokenInformation extends TokenInformation {
  constructor(
    public name: string,
    public symbol: string,
    public chainId: ChainId,
    public tokenType: ETokenType,
    public contractAddress: EVMContractAddress,
    public decimals: number,
    public transferGasLimit: number, // Sufficient for amount of gas required for erc20's transfer()
  ) {
    super(name, symbol, chainId, tokenType, contractAddress, decimals);
  }
}
