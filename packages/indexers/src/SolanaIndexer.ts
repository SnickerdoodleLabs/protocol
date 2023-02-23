import { Metaplex } from "@metaplex-foundation/js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  ISolanaBalanceRepository,
  ISolanaNFTRepository,
  ISolanaTransactionRepository,
  SolanaAccountAddress,
  TokenBalance,
  SolanaNFT,
  SolanaTransaction,
  EChain,
  URLString,
  SolanaTokenAddress,
  BigNumberString,
  EChainTechnology,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TickerSymbol,
  SolanaCollection,
  getChainInfoByChainId,
} from "@snickerdoodlelabs/objects";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class SolanaIndexer
  implements
    ISolanaBalanceRepository,
    ISolanaNFTRepository,
    ISolanaTransactionRepository
{
  private _connections?: ResultAsync<SolClients, never>;

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    if (chainId != ChainId(EChain.Solana)) {
      return errAsync(
        new AccountIndexingError("invalid chain id for solana", chainId),
      );
    }

    const url =
      "https://solana-mainnet.g.alchemy.com/v2/Svoz_lR2LW8DLWIPeJvRkxhTHiiizi3D";

    console.log("Solana Url: ", url);

    const backup = {
      method: "getTokenAccountsByOwner",
      jsonrpc: "2.0",
      params: [
        "Hqx7JKUrNMzZPfgapu3FK4xGFPzxdwJdYEJCeXkVBCbg",
        {
          mint: "0x41848d32f281383f214c69b7b248dc7c2e0a7374",
        },
        {
          encoding: "jsonParsed",
        },
      ],
    };

    return this.ajaxUtils
      .post<undefined>(new URL(url), JSON.stringify(backup), {
        headers: {
          "Content-Type": `application/json;`,
        },
      })
      .andThen((balance) => {
        console.log("Mapped Solana Balances: ", balance);
        return okAsync([]);
      });

    // .andThen((balances) => {
    //   return ResultUtils.combine(
    //     balances.map((balance) => {
    //       return ResultUtils.combine([
    //         this.tokenPriceRepo.getTokenInfo(chainId, balance.tokenAddress),
    //         // disabling until we can stop the rate limit
    //         // this.tokenPriceRepo.getTokenPrice(
    //         //   chainId,
    //         //   balance.tokenAddress,
    //         //   new Date(),
    //         // ),
    //       ])
    //         .andThen(([tokenInfo]) => {
    //           if (tokenInfo == null) {
    //             return okAsync(undefined);
    //           }

    //           return okAsync(
    //             new TokenBalance(
    //               EChainTechnology.Solana,
    //               tokenInfo.symbol,
    //               chainId,
    //               tokenInfo.address,
    //               accountAddress,
    //               balance.tokenAmount.amount,
    //               balance.tokenAmount.decimals,
    //             ),
    //           );
    //         })
    //         .orElse((e) => {
    //           this.logUtils.error("error retrieving token info", e);
    //           return okAsync(undefined);
    //         });
    //     }),
    //   ).map((balances) => {
    //     return balances.filter(
    //       (balance) => balance != null,
    //     ) as TokenBalance[];
    //   });
    // })
    // .andThen((balances) => {
    //   return this._getConnectionForChainId(chainId).andThen(([conn]) => {
    //     return ResultAsync.fromPromise(
    //       conn.getBalance(new PublicKey(accountAddress)),
    //       (e) => new AccountIndexingError("error getting native balance"),
    //     ).map((nativeBalanceValue) => {
    //       const nativeBalance = new TokenBalance(
    //         EChainTechnology.Solana,
    //         TickerSymbol("SOL"),
    //         chainId,
    //         null,
    //         accountAddress,
    //         BigNumberString(nativeBalanceValue.toString()),
    //         getChainInfoByChainId(chainId).nativeCurrency.decimals,
    //       );
    //       return [nativeBalance, ...balances];
    //     });
    //   });
    // });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaNFT[], AccountIndexingError | AjaxError> {
    return this._getConnectionForChainId(chainId)
      .andThen(([conn, metaplex]) => {
        return ResultAsync.fromPromise(
          metaplex
            .nfts()
            .findAllByOwner({ owner: new PublicKey(accountAddress) }),
          (e) => new AccountIndexingError("error finding sol nfts", e),
        );
      })
      .orElse((e) => {
        this.logUtils.error("error fetching solana nfts", e);
        return okAsync([]);
      })
      .map((nfts) => {
        return nfts
          .map((nft) => {
            return new SolanaNFT(
              chainId,
              accountAddress,
              SolanaTokenAddress(nft.address.toBase58()),
              nft.collection
                ? new SolanaCollection(
                    SolanaTokenAddress(nft.collection?.address.toBase58()),
                    nft.collection?.verified,
                  )
                : null,
              nft.uri,
              nft.isMutable,
              nft.primarySaleHappened,
              nft.sellerFeeBasisPoints,
              SolanaAccountAddress(nft.updateAuthorityAddress.toBase58()),
              nft.tokenStandard,
              TickerSymbol(nft.symbol),
              nft.name,
            );
          })
          .filter((val, i, arr) => {
            return (
              i ==
              arr.findIndex((ind) => {
                return ind.mint == val.mint;
              })
            );
          }); // remove duplicates
      });
  }

  public getSolanaTransactions(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<SolanaTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]); //TODO
  }

  private _getConnectionForChainId(
    chainId: ChainId,
  ): ResultAsync<[Connection, Metaplex], AccountIndexingError> {
    return this._getConnections().andThen((connections) => {
      switch (chainId) {
        case ChainId(EChain.Solana):
          return okAsync(connections.mainnet);
        case ChainId(EChain.SolanaTestnet):
          return okAsync(connections.testnet);
        default:
          return errAsync(
            new AccountIndexingError("invalid chain id for solana"),
          );
      }
    });
  }

  private _getConnections(): ResultAsync<SolClients, never> {
    if (this._connections) {
      return this._connections;
    }

    this._connections = this.configProvider.getConfig().andThen((config) => {
      return ResultUtils.combine([
        this._getConnectionForEndpoint(config.alchemyEndpoints.solana),
        this._getConnectionForEndpoint(config.alchemyEndpoints.solanaTestnet),
      ]).map(([mainnet, testnet]) => {
        return {
          mainnet,
          testnet,
        };
      });
    });

    return this._connections;
  }

  private _getConnectionForEndpoint(
    endpoint: string,
  ): ResultAsync<[Connection, Metaplex], never> {
    const connection = new Connection(endpoint);
    const metaplex = new Metaplex(connection);
    return okAsync([connection, metaplex]);
  }

  private _lamportsToSol(lamports: number): BigNumberString {
    return BigNumberString((lamports / LAMPORTS_PER_SOL).toString());
  }
}

interface SolClients {
  mainnet: [Connection, Metaplex];
  testnet: [Connection, Metaplex];
}

type ISolscanBalanceResponse = {
  tokenAddress: SolanaTokenAddress;
  tokenAmount: {
    amount: BigNumberString;
    decimals: number;
    uiAmount: number;
    uiAmountString: BigNumberString;
  };
  tokenAccount: string;
  tokenName: string;
  tokenIcon: URLString;
  rentEpoch: number;
  lamports: number;
}[];

type IAlchemyBalanceRequest = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};

type IAlchemyBalanceResponse = {
  id: number;
  jsonrpc: string;
  result: {
    context: {
      slot: number;
    };
    value: {
      amount: string;
      decimals: number;
      uiAmountString: string;
    };
  };
};
