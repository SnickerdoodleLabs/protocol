import {
  AccountAddress,
  EChain,
  EChainTechnology,
  EVMAccountAddress,
  getChainInfoByChain,
} from "@snickerdoodlelabs/objects";

export class DataValidationUtils {
  public static removeChecksumFromAccountAddress(
    accountAddress: AccountAddress,
    chain: EChain,
  ): AccountAddress {
    const chainInfo = getChainInfoByChain(chain);

    if (chainInfo.chainTechnology == EChainTechnology.EVM) {
      return EVMAccountAddress(accountAddress.toLowerCase());
    }
    return accountAddress;
  }
}
