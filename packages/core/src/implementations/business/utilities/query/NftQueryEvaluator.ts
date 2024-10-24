import {
  PersistenceError,
  SDQL_Return,
  ChainId,
  EChain,
  TokenAddress,
  EVMNFT,
  UnixTimestamp,
  ISDQLTimestampRange,
  NftHolding,
  QueryPerformanceEvent,
  EQueryEvents,
  IpfsCID,
  EStatus,
  EChainTechnology,
  BigNumberString,
  AccountIndexingError,
  AjaxError,
  InvalidParametersError,
  MethodSupportError,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { INftQueryEvaluator } from "@core/interfaces/business/utilities/query/index.js";
import {
  INftRepositoryType,
  INftRepository,
} from "@core/interfaces/data/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class NftQueryEvaluator implements INftQueryEvaluator {
  constructor(
    @inject(INftRepositoryType)
    protected nftRepository: INftRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
  ) {}

  public eval(
    query: AST_NftQuery,
    queryCID: IpfsCID,
    queryTimestamp: UnixTimestamp,
  ): ResultAsync<
    SDQL_Return,
    | PersistenceError
    | AccountIndexingError
    | AjaxError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      const networkId = query.schema.networkid;
      const address = query.schema.address;
      const timestampRange = query.schema.timestampRange;

      let chainIds: undefined | ChainId[];

      if (networkId && networkId !== "*") {
        chainIds = Array.isArray(networkId)
          ? [...networkId.map((id) => ChainId(Number(id)))]
          : [ChainId(Number(networkId))];
      }
      context.publicEvents.queryPerformance.next(
        new QueryPerformanceEvent(
          EQueryEvents.NftDataAccess,
          EStatus.Start,
          queryCID,
          query.name,
        ),
      );
      return this.nftRepository
        .getNfts(queryTimestamp, chainIds)
        .map((nfts) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.NftDataAccess,
              EStatus.End,
              queryCID,
              query.name,
            ),
          );
          return SDQL_Return(
            this.getNftHoldings(nfts, address, timestampRange),
          );
        })
        .mapErr((err) => {
          context.publicEvents.queryPerformance.next(
            new QueryPerformanceEvent(
              EQueryEvents.NftDataAccess,
              EStatus.End,
              queryCID,
              query.name,
              err,
            ),
          );
          return err;
        });
    });
  }

  private getNftHoldings(
    nfts: WalletNFT[],
    address: string | string[] | undefined,
    timestampRange: ISDQLTimestampRange | undefined,
  ): NftHoldings {
    return this.nftsToNftHoldings(
      this.filterNfts(nfts, address, timestampRange),
    );
  }

  private nftsToNftHoldings(nfts: WalletNFT[]): NftHoldings {
    return nfts.reduce<NftHoldings>((nftholdings, nft) => {
      const chain = this.chainGuard(nft.chain);
      const currentNft = this.walletNftToNftHolding(chain, nft);
      const index = nftholdings.findIndex(
        ({ chain, tokenAddress }) =>
          chain == currentNft.chain && tokenAddress == currentNft.tokenAddress,
      );

      if (index !== undefined && index > -1) {
        nftholdings[index].amount += currentNft.amount;

        if (nftholdings[index].measurementTime < currentNft.measurementTime) {
          nftholdings[index].measurementTime = currentNft.measurementTime;
        }
      } else {
        nftholdings.push(currentNft);
      }

      return nftholdings;
    }, [] as NftHolding[]);
  }

  private walletNftToNftHolding(
    chain: keyof typeof EChain | "not registered",
    nft: WalletNFT,
  ): NftHolding {
    return new NftHolding(
      chain,
      nft.token,
      Number(nft.amount),
      nft.name,
      nft.measurementDate,
    );
  }

  //Type guard https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards, needed for narrowing
  private chainGuard(chain: any): keyof typeof EChain | "not registered" {
    if (this.isValidChain(EChain[chain])) {
      chain = EChain[chain];
    } else {
      chain = "not registered";
    }
    return chain;
  }

  private isValidChain(chain: string): chain is keyof typeof EChain {
    return chain in EChain;
  }

  private filterNfts(
    nfts: WalletNFT[],
    address: string | string[] | undefined,
    timestampRange: ISDQLTimestampRange | undefined,
  ): WalletNFT[] {
    return nfts.reduce<WalletNFT[]>((array, nft) => {
      if (this.validNft(nft, address, timestampRange)) {
        array.push(nft);
      }
      return array;
    }, []);
  }

  private validNft(
    nft: WalletNFT,
    address: string | undefined | string[],
    timestampRange: undefined | ISDQLTimestampRange,
  ): boolean {
    if (address && address !== "*") {
      if (this.checkInvalidAddress(nft.token, address)) {
        return false;
      }
    }
    if (this.isEVMWithHistory(nft) && nft.lastOwnerTimeStamp) {
      if (
        timestampRange &&
        !(timestampRange.end === "*" && timestampRange.start === "*")
      ) {
        if (
          this.checkInvalidTimestamp(nft.lastOwnerTimeStamp, timestampRange)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  private isEVMWithHistory(nft: WalletNFT): nft is EVMNFT & {
    totalAmount: BigNumberString;
    measurementDate: UnixTimestamp;
  } {
    return nft.type === EChainTechnology.EVM;
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
    timestampRange: ISDQLTimestampRange,
  ): boolean {
    const start = timestampRange.start;
    const end = timestampRange.end;
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
}

export type NftHoldings = NftHolding[];
