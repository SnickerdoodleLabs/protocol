import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  AccountIndexingError,
  AjaxError,
  ChainId,
  TokenBalance,
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  EChain,
  EVMNFT,
  TokenUri,
  EVMTransaction,
  UnixTimestamp,
  EComponentStatus,
  IEVMIndexer,
  IndexerSupportSummary,
  getChainInfoByChain,
  MethodSupportError,
  EDataProvider,
  EExternalApi,
  EVMTransactionHash,
  URLString,
  DecimalString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class AnkrIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, false, true),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, true, true, true),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, true, true, true),
    ],
    [
      EChain.Optimism,
      new IndexerSupportSummary(EChain.Optimism, true, true, true),
    ],
    [
      EChain.Avalanche,
      new IndexerSupportSummary(EChain.Avalanche, true, true, true),
    ],
    [
      EChain.Arbitrum,
      new IndexerSupportSummary(EChain.Arbitrum, true, true, true),
    ],
  ]);

  protected supportedNfts = new Map<string, EChain>([
    ["polygon", EChain.Polygon],
    ["bsc", EChain.Binance],
    ["eth", EChain.EthereumMainnet],
    ["avalanche", EChain.Avalanche],
    ["arbitrum", EChain.Arbitrum],
    ["optimism", EChain.Optimism],
  ]);

  protected supportedAnkrChains = new Map<ChainId, string>([
    [ChainId(1), "eth"],
    [ChainId(137), "polygon"],
    [ChainId(80001), "polygon_mumbai"],
    [ChainId(43114), "avalanche"],
    [ChainId(43113), "avalanche_fuji"],
    [ChainId(56), "bsc"],
    [ChainId(42161), "arbitrum"],
    [ChainId(10), "optimism"],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public name(): string {
    return EDataProvider.Ankr;
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getAccountBalance";

      const balanceSupportChain = this.supportedAnkrChains.get(chainId);
      if (balanceSupportChain == undefined) {
        return okAsync([]);
      }

      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getAccountBalance",
        params: {
          walletAddress: accountAddress,
          blockchain: [balanceSupportChain],
        },
        id: 1,
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
      return this.ajaxUtils
        .post<IAnkrBalancesReponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          return ResultUtils.combine(
            response.result.assets.map((item) => {
              if (item.tokenType == "NATIVE") {
                return okAsync(
                  new TokenBalance(
                    EChainTechnology.EVM,
                    item.tokenSymbol,
                    chainId,
                    MasterIndexer.nativeAddress,
                    accountAddress,
                    item.balanceRawInteger,
                    item.tokenDecimals,
                  ),
                );
              }
              return okAsync(
                new TokenBalance(
                  EChainTechnology.EVM,
                  item.tokenSymbol,
                  chainId,
                  item.contractAddress,
                  accountAddress,
                  item.balanceRawInteger,
                  item.tokenDecimals,
                ),
              );
            }),
          );
        });
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMNFT[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getNFTsByOwner";

      const nftSupportChain = this.supportedAnkrChains.get(chainId);
      if (nftSupportChain == undefined) {
        return okAsync([]);
      }

      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getNFTsByOwner",
        params: {
          walletAddress: accountAddress,
          pageSize: 50,
          blockchain: [nftSupportChain],
        },
        id: 1,
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
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
              undefined,
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
    return this.configProvider.getConfig().andThen((config) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getTransactionsByAddress";
      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getTransactionsByAddress",
        params: {
          address: [accountAddress],
          blockchain: [this.supportedAnkrChains.get(chainId)],
        },
        id: 1,
      };

      return this.ajaxUtils
        .post<IAnkrTransactionReponse>(new URL(url), requestParams, {
          headers: {
            Accept: `application/json`,
            "Content-Type": `application/json`,
          },
        })
        .andThen((response) => {
          console.log(
            "Ankr transactions response is: " + JSON.stringify(response),
          );

          return ResultUtils.combine(
            response.result.transactions.map((item) => {
              return okAsync(
                new EVMTransaction(
                  chainId,
                  EVMTransactionHash(item.hash),
                  UnixTimestamp(item.timestamp),
                  item.blockNumber,
                  EVMAccountAddress(item.to),
                  EVMAccountAddress(item.from),
                  BigNumberString(item.value),
                  BigNumberString(item.gasPrice),
                  null,
                  item.input,
                  item.type,
                  null,
                  null,
                ),
              );
            }),
          );
        })
        .andThen((vals) => {
          return okAsync(vals);
        });
    });
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    return this.configProvider.getConfig().andThen((config) => {
      this.supportedChains.forEach(
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
    return this.supportedChains;
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
  contractAddress: EVMContractAddress;
  blockchain: string;
  tokenName: string;
  tokenSymbol: TickerSymbol;
  tokenDecimals: number;
  tokenType: string;
  holderAddress: EVMAccountAddress;
  balance: BigNumberString;
  balanceRawInteger: BigNumberString;
  balanceUsd: DecimalString;
  tokenPrice: DecimalString;
  thumbnail: URLString;
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
    transactions: IAnkrTransaction[];
  };
  nextPageToken: string;
}

interface IAnkrTransaction {
  v: string;
  r: string;
  s: string;
  nonce: string;
  blockNumber: number;
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
  timestamp: number;
}
