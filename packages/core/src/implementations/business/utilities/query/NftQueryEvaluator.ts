import {
  EVMAccountAddress,
  TransactionFilter,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  PersistenceError,
  SDQL_Return,
  ChainId,
  WalletNFT,
  TokenAddress,
} from "@snickerdoodlelabs/objects";
import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { INftQueryEvaluator } from "@core/interfaces/business/utilities/query/INftQueryEvaluator";

@injectable()
export class NftQueryEvaluator implements INftQueryEvaluator {
  constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
  ) {}

  public eval(query: AST_NftQuery): ResultAsync<SDQL_Return, PersistenceError> {
    const {
      schema: { networkid: networkId, address },
    } = query;

    let chainId: undefined | ChainId[];

    if (networkId && networkId !== "*") {
      chainId = Array.isArray(networkId)
        ? [...networkId.map((id) => ChainId(Number(id)))]
        : [ChainId(Number(networkId))];
    }

    return this.dataWalletPersistence.getAccountNFTs(chainId).map((arr) => {
      return SDQL_Return(
        arr.reduce<WalletNFT[]>((array, nft) => {
          if (this.filter(nft, address)) {
            array.push(nft);
          }
          return array;
        }, []),
      );
    });
  }

  private filter(
    walletNFT: WalletNFT,
    address: string | undefined | string[],
  ): boolean {
    let addresses: undefined | TokenAddress[];

    if (address && address !== "*") {
      addresses = Array.isArray(address) ? [...address] : [address];

      return addresses.some((tokenAddress) => tokenAddress === walletNFT.token);
    }

    return true;
  }

  private setFilterProps<
    T extends { (value?: any): any },
    F extends { (value?: any): any },
    K,
  >(
    property: K | K[] | "*",
    returnType: T,
    conversionType: F,
  ): T[] | undefined {
    if (property && property !== "*") {
      return Array.isArray(property)
        ? [...property.map((element) => returnType(conversionType(element)))]
        : [returnType(conversionType(property))];
    }
    return undefined;
  }
}
