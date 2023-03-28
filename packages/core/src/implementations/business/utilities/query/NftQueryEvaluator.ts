import {
  PersistenceError,
  SDQL_Return,
  ChainId,
  EChain,
  WalletNFT,
  TokenAddress,
  EVMNFT,
  UnixTimestamp,
  ISDQLTimestampRange,
  NftHolding,
} from "@snickerdoodlelabs/objects";
import { AST_NftQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { INftQueryEvaluator } from "@core/interfaces/business/utilities/query/INftQueryEvaluator";
import {
  IPortfolioBalanceRepository,
  IPortfolioBalanceRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class NftQueryEvaluator implements INftQueryEvaluator {
  constructor(
    @inject(IPortfolioBalanceRepositoryType)
    protected portfolioBalanceRepository: IPortfolioBalanceRepository,
  ) {}

  public eval(query: AST_NftQuery): ResultAsync<SDQL_Return, PersistenceError> {
    const networkId = query.schema.networkid;
    const address = query.schema.address;
    const timestampRange = query.schema.timestampRange;

    let chainIds: undefined | ChainId[];

    if (networkId && networkId !== "*") {
      chainIds = Array.isArray(networkId)
        ? [...networkId.map((id) => ChainId(Number(id)))]
        : [ChainId(Number(networkId))];
    }

    return this.portfolioBalanceRepository
      .getAccountNFTs(chainIds)
      .map((walletNfts) => {
        return SDQL_Return(
          this.getNftHoldings(walletNfts, address, timestampRange),
        );
      });
  }

  private getNftHoldings(
    walletNfts: WalletNFT[],
    address: string | string[] | undefined,
    timestampRange: ISDQLTimestampRange | undefined,
  ): NftHoldings {
    const filteredNfts = this.filterNfts(walletNfts, address, timestampRange);
    return this.walletNftsToNftHoldings(filteredNfts);
  }

 
  private walletNftsToNftHoldings(walletNfts : WalletNFT[]) :NftHoldings {
    return walletNfts.reduce<NftHoldings>( (  nftholdings , nft  ) => {
     
      const chain = this.chainGuard(nft.chain);
      const nftHolding = this.walletNftToNftHolding(chain , nft);

      if(nftholdings[chain]){
        const elementIndex = nftholdings[
          nftHolding.chain
        ]?.findIndex(
          ({ tokenAddress }) =>
            tokenAddress === nftHolding.tokenAddress,
        );

        if (elementIndex !== undefined && elementIndex > -1) {
          nftholdings[nftHolding.chain]![
            elementIndex
          ].amount += nftHolding.amount;
        } else {
          nftholdings[
            nftHolding.chain
          ]?.push(nftHolding);
        }

      } else {
        nftholdings[chain] = [nftHolding];
      }

     return nftholdings
      
    } , {})
  }

  private walletNftToNftHolding( chain : keyof typeof EChain | "not registered" , nft : WalletNFT) : NftHolding {
    if (nft instanceof EVMNFT) {
      return new NftHolding(chain  , nft.token , Number(nft.amount) , nft.name);
   }else{
      return new NftHolding(chain , nft.token , 1 , nft.name);
   }
  }

   //Type guard https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards, needed for narrowing 
  private chainGuard( chain : any) : keyof typeof EChain | "not registered" {
    if(this.isValidChain(EChain[chain])){
      chain =  EChain[chain];
    } else {
      chain = "not registered";
    }
    return chain;
  }
  
  private isValidChain(chain: string): chain is keyof typeof EChain  {
    return chain in EChain;
}

  private filterNfts(
    walletNfts: WalletNFT[],
    address: string | string[] | undefined,
    timestampRange: ISDQLTimestampRange | undefined,
  ): WalletNFT[] {
    return walletNfts.reduce<WalletNFT[]>((array, nft) => {
      if (this.validNft(nft, address, timestampRange)) {
        array.push(nft);
      }
      return array;
    }, []);
  }

  private validNft(
    walletNFT: WalletNFT,
    address: string | undefined | string[],
    timestampRange: undefined | ISDQLTimestampRange,
  ): boolean {
    if (address && address !== "*") {
      if (this.checkInvalidAddress(walletNFT.token, address)) {
        return false;
      }
    }
    if (walletNFT instanceof EVMNFT && walletNFT.lastOwnerTimeStamp) {
      if (
        timestampRange &&
        !(timestampRange.end === "*" && timestampRange.start === "*")
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


export type NftHoldings = {
	[chain in keyof typeof EChain | "not registered"]?: NftHolding[]
};
