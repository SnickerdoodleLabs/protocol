import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  ObjectUtils,
  ITimeUtils,
  ITimeUtilsType,
  ValidationUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  EChainTechnology,
  TickerSymbol,
  AccountIndexingError,
  AjaxError,
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
  IndexerSupportSummary,
  getChainInfoByChain,
  MethodSupportError,
  EDataProvider,
  EExternalApi,
  URLString,
  DecimalString,
  EVMTransactionHash,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { from } from "rxjs";

import {
  IEVMIndexer,
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
      new IndexerSupportSummary(EChain.EthereumMainnet, true, true, true),
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
    [EChain.Fuji, new IndexerSupportSummary(EChain.Fuji, true, true, true)],
    [EChain.Amoy, new IndexerSupportSummary(EChain.Amoy, true, true, true)],
    [EChain.Base, new IndexerSupportSummary(EChain.Base, true, true, true)],
    // [
    //   EChain.BinanceTestnet,
    //   new IndexerSupportSummary(EChain.BinanceTestnet, true, false, false),
    // ],
  ]);

  protected supportedNfts = new Map<string, EChain>([
    ["polygon", EChain.Polygon],
    ["bsc", EChain.Binance],
    ["eth", EChain.EthereumMainnet],
    ["avalanche", EChain.Avalanche],
    ["arbitrum", EChain.Arbitrum],
    ["optimism", EChain.Optimism],
    ["avalanche_fuji", EChain.Fuji],
    ["polygon_amoy", EChain.Amoy],
    ["base", EChain.Base],
  ]);

  protected supportedAnkrChains = new Map<EChain, string>([
    [EChain.EthereumMainnet, "eth"],
    [EChain.Polygon, "polygon"],
    [EChain.Amoy, "polygon_amoy"],
    [EChain.Avalanche, "avalanche"],
    [EChain.Binance, "bsc"],
    [EChain.Arbitrum, "arbitrum"],
    [EChain.Optimism, "optimism"],
    [EChain.Fuji, "avalanche_fuji"],
    [EChain.Base, "base"],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.supportedAnkrChains.forEach((indexerSupportSummary, chain) => {
        if (
          config.apiKeys.ankrApiKey == "" ||
          config.apiKeys.ankrApiKey == null
        ) {
          this.health.set(chain, EComponentStatus.NoKeyProvided);
        } else {
          this.health.set(chain, EComponentStatus.Available);
        }
      });
    });
  }

  public name(): EDataProvider {
    return EDataProvider.Ankr;
  }

  public getBalancesForAccount(
    chain: EChain,
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

      const balanceSupportChain = this.supportedAnkrChains.get(chain);
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
          return response.result?.assets
            ? ResultUtils.combine(
                response.result?.assets.map((item) => {
                  if (item.tokenType == "NATIVE") {
                    return okAsync(
                      new TokenBalance(
                        EChainTechnology.EVM,
                        item.tokenSymbol,
                        chain,
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
                      chain,
                      item.contractAddress,
                      accountAddress,
                      item.balanceRawInteger,
                      item.tokenDecimals,
                    ),
                  );
                }),
              )
            : okAsync([]);
        });
    });
  }

  public getTokensForAccount(
    chain: EChain,
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

      const nftSupportChain = this.supportedAnkrChains.get(chain);
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
          return response.result?.assets
            ? response.result.assets.map((item) => {
                const tokenStandard = ValidationUtils.stringToTokenStandard(
                  item.contractType,
                );
                return new EVMNFT(
                  item.contractAddress,
                  BigNumberString(item.tokenId),
                  tokenStandard,
                  accountAddress,
                  TokenUri(item.imageUrl),
                  { raw: ObjectUtils.serialize(item) },
                  item.name,
                  getChainInfoByChain(
                    this.supportedNfts.get(item.blockchain)!,
                  ).chainId, // chainId
                  BigNumberString("1"),
                  this.timeUtils.getUnixNow(),
                  undefined,
                  undefined,
                );
              })
            : [];
        })
        .map((unfilteredNfts) => {
          return unfilteredNfts
            .filter((nft) => {
              return nft.chain == chain;
            })
            .map((filteredNfts) => {
              return filteredNfts;
            });
        });
    });
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getTransactionsByAddress";
      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getTransactionsByAddress",
        params: {
          address: [accountAddress],
          blockchain: [this.supportedAnkrChains.get(chain)],
          fromTimestamp: UnixTimestamp(startTime.getTime() / 1000), // Needs it in seconds
        },
        id: 1,
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.Ankr);
      return this.ajaxUtils
        .post<IAnkrTransactionReponse>(new URL(url), requestParams, {
          headers: {
            Accept: `application/json`,
            "Content-Type": `application/json`,
          },
        })
        .map((response) => {
          if (
            !response.result || // API returns without the 'result' field (eg.querying to early and the block number / timestamp doesn't exist yet)
            !response.result.transactions ||
            response.result.transactions.length === 0
          ) {
            return []; // Return an empty array if 'transactions' is null, undefined, or empty
          }
          return response.result.transactions.map((item) => {
            return new EVMTransaction(
              getChainInfoByChain(chain).chainId,
              EVMTransactionHash(item.hash),
              UnixTimestamp(Number(item.timestamp)), // Returned as hexadecimal string, convert to number
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
              this.timeUtils.getUnixNow(),
            );
          });
        })
        .mapErr((error) => {
          return error;
        });
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
    transactions?: IAnkrTransaction[];
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
  timestamp: string; // Unix timestamp returned in hexadecimal string
}
