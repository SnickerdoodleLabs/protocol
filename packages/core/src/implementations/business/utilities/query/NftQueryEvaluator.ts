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
  EVMNFT,
  UnixTimestamp,
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
      schema: { networkid: networkId, address, timestampRange },
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
          if (this.validNft(nft, address, timestampRange)) {
            array.push(nft);
          }
          return array;
        }, []),
      );
    });
  }

  private validNft(
    walletNFT: WalletNFT,
    address: string | undefined | string[],
    timestampRange: undefined | { start: string; end: string },
  ): boolean {
    if (address && address !== "*") {
      if (this.checkInvalidAddress(walletNFT.token, address)) {
        return false;
      }
    }
    if (walletNFT instanceof EVMNFT && walletNFT.lastOwnerTimeStamp) {
      if (
        timestampRange &&
        !(
          timestampRange.start === timestampRange.end &&
          timestampRange.start === "*"
        )
      ) {
        if (
          this.checkInvalidTimestamp(
            walletNFT.lastOwnerTimeStamp,
            timestampRange,
          )
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private checkInvalidAddress(
    tokenAddress: TokenAddress,
    address: string | string[],
  ): boolean {
    const addresses = Array.isArray(address) ? [...address] : [address];

    return !addresses.some((allowedAddress) => allowedAddress === tokenAddress);
  }

  private checkInvalidTimestamp(
    lastOwnerTimeStamp: UnixTimestamp,
    { start, end }: { start: string; end: string },
  ): boolean {
    if (start !== "*") {
      const startTimeStamp = UnixTimestamp(Number(start));
      if (startTimeStamp > lastOwnerTimeStamp) {
        return true;
      }
    }

    if (end !== "*") {
      const endTimeStamp = UnixTimestamp(Number(end));
      if (endTimeStamp < lastOwnerTimeStamp) {
        return true;
      }
    }

    return false;
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
