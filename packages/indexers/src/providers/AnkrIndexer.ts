import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  IRequestConfig,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  getChainInfoByChainId,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  BigNumberString,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMAccountAddress,
  EVMContractAddress,
  EChain,
  HexString,
  EVMNFT,
  AccountAddress,
  URLString,
  TokenUri,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
  EComponentStatus,
  IEVMIndexer,
  IndexerSupportSummary,
  getChainInfoByChain,
  MethodSupportError,
  EDataProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";
import Web3 from "web3";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { IIndexerHealthCheck } from "@indexers/interfaces/IIndexerHealthCheck.js";

@injectable()
export class AnkrIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, false, false, true),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, false, true, true),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, false, true, true),
    ],
    [
      EChain.Optimism,
      new IndexerSupportSummary(EChain.Optimism, false, true, true),
    ],
    [
      EChain.Avalanche,
      new IndexerSupportSummary(EChain.Avalanche, false, true, true),
    ],
    [
      EChain.Arbitrum,
      new IndexerSupportSummary(EChain.Arbitrum, false, true, true),
    ],
  ]);

  protected supportedNfts = new Map<string, EChain>([
    ["polygon", EChain.Polygon],
    ["bsc", EChain.Binance],
    ["eth", EChain.EthereumMainnet],
    ["avalanche", EChain.Avalanche],
    ["arbitrum", EChain.Arbitrum],
  ]);

  protected chainSupport = new Map<EChain, string>([
    [EChain.EthereumMainnet, "eth"],
    [EChain.Polygon, "polygon"],
    [EChain.Binance, "bsc"],
    [EChain.Avalanche, "avalanche"],
    [EChain.Arbitrum, "arbitrum"],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public name(): string {
    return EDataProvider.Ankr;
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      console.log("Config Api Keys: " + JSON.stringify(config.apiKeys));

      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getAccountBalance";
      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getAccountBalance",
        params: {
          blockchain: [
            this.chainSupport.get(getChainInfoByChainId(chainId).chain),
          ],
          walletAddress: accountAddress,
        },
        id: 1,
      };

      return this.ajaxUtils
        .post<IAnkrBalancesReponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          return ResultUtils.combine(
            response.result.assets.map((item) => {
              return okAsync(
                new TokenBalance(
                  EChainTechnology.EVM,
                  item.tokenSymbol,
                  chainId,
                  null,
                  accountAddress,
                  BigNumberString("1"),
                  item.tokenDecimals,
                ),
              );
            }),
          );
        })
        .map((unfilteredBalances) => {
          return unfilteredBalances
            .filter((balance) => {
              return balance.chainId == chainId;
            })
            .map((filteredBalances) => {
              return filteredBalances;
            });
        });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getNFTsByOwner";
      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getNFTsByOwner",
        params: {
          blockchain: [],
          walletAddress: accountAddress,
        },
        id: 1,
      };

      return this.ajaxUtils
        .post<IAnkrNftReponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .map((response) => {
          // return ResultUtils.combine(
          return response.result.assets.map((item) => {
            return new EVMNFT(
              item.contractAddress,
              BigNumberString(item.tokenId),
              item.contractType,
              accountAddress,
              TokenUri(item.imageUrl),
              { raw: ObjectUtils.serialize(item) },
              BigNumberString("1"),
              item.name,
              getChainInfoByChain(
                this.supportedNfts.get(item.blockchain)!,
              ).chainId, // chainId
              undefined,
              UnixTimestamp(Number(item.timestamp)),
            );
          });
        })
        .map((unfilteredNfts) => {
          return unfilteredNfts
            .filter((nft) => {
              return nft.chain == chainId;
            })
            .map((filteredNfts) => {
              return filteredNfts;
            });
        });
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getEVMTransactions not supported for AnkrIndexer",
        400,
      ),
    );
    // return this.configProvider.getConfig().andThen((config) => {
    //   const url =
    //     "https://rpc.ankr.com/multichain/" +
    //     config.apiKeys.ankrApiKey +
    //     "/?ankr_getTransactionsByAddress";
    //   const requestParams = {
    //     jsonrpc: "2.0",
    //     method: "ankr_getTransactionsByAddress",
    //     params: {
    //       walletAddress: accountAddress,
    //     },
    //     id: 1,
    //   };

    //   console.log("Ankr component set to NoKeyProvided");
    //   console.log("Ankr transactions url is: " + url);
    //   return this.ajaxUtils
    //     .post<IAnkrTransactionReponse>(new URL(url), requestParams, {
    //       headers: {
    //         "Content-Type": `application/json;`,
    //       },
    //     })
    //     .andThen((response) => {
    //       console.log(
    //         "Ankr transactions response is: " + JSON.stringify(response),
    //       );

    //       return ResultUtils.combine(
    //         response.result.transactions.map((item) => {
    //           return okAsync(
    //             new EVMTransaction(
    //               chainId,
    //               EVMTransactionHash(item.hash),
    //               UnixTimestamp(0), // item.timestamp
    //               null,
    //               EVMAccountAddress(item.to),
    //               EVMAccountAddress(item.from),
    //               BigNumberString(item.value),
    //               BigNumberString(item.gasPrice),
    //               item.contractAddress,
    //               item.input,
    //               null,
    //               null,
    //               null,
    //             ),
    //           );
    //         }),
    //       );
    //     })
    //     .andThen((vals) => {
    //       console.log("Ankr transactions response is: " + JSON.stringify(vals));
    //       return okAsync(vals);
    //     });
    // });
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (
            config.apiKeys.ankrApiKey == "" ||
            config.apiKeys.ankrApiKey == undefined
          ) {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
          }
        },
      );
      return okAsync(this.health);
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
}

interface IAnkrBalancesReponse {
  jsonrpc: string;
  id: number;
  result: {
    totalBalanceUsd: string;
    totalCount: number;
    assets: IAnkrBalanceAsset[];
  };
}

interface IAnkrBalanceAsset {
  blockchain: "eth";
  tokenName: "Ethereum";
  tokenSymbol: TickerSymbol;
  tokenDecimals: number;
  tokenType: "NATIVE";
  holderAddress: EVMAccountAddress;
  balance: TokenBalance;
  balanceRawInteger: "627238654657922210";
  balanceUsd: "1132.318127155933293695";
  tokenPrice: "1805.242898771069514074";
  thumbnail: "https://assets.ankr.com/charts/icon-only/eth.svg";
}

interface IAnkrNftReponse {
  jsonrpc: string;
  id: number;
  result: {
    owner: EVMAccountAddress;
    assets: IAnkrNftAsset[];
  };
  nextPageToken: string;
}

interface IAnkrNftAsset {
  blockchain: string;
  name: string;
  tokenId: string;
  tokenUrl: string;
  imageUrl: string;
  collectionName: string;
  symbol: string;
  contractType: string;
  contractAddress: EVMContractAddress;
  traits: {
    trait_type: string;
    value: string;
  }[];
}

interface IAnkrTransactionReponse {
  jsonrpc: string;
  id: number;
  result: {
    transactions: IAnkrNftAsset[];
  };
  nextPageToken: string;
}

interface IAnkrNftAsset {
  v: string;
  r: string;
  s: string;
  nonce: string;
  blockNumber: string;
  from: string;
  to: string;
  gas: string;
  gasPrice: string;
  input: string;
  transactionIndex: string;
  blockHash: string;
  value: string;
  type: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  hash: string;
  status: string;
  blockchain: string;
  timestamp: string;
}
