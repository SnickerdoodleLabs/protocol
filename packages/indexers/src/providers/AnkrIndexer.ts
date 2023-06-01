import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ILogUtils,
  ILogUtilsType,
  IRequestConfig,
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
      new IndexerSupportSummary(EChain.EthereumMainnet, false, true, true),
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
  ]);

  protected supportedNfts = new Map<string, EChain>([
    ["polygon", EChain.Polygon],
    ["bsc", EChain.Binance],
    ["eth", EChain.EthereumMainnet],
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
    return "ankr";
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url =
        "https://rpc.ankr.com/multichain/" +
        config.apiKeys.ankrApiKey +
        "/?ankr_getAccountBalance";
      console.log("Ankr url: " + url);
      const requestParams = {
        jsonrpc: "2.0",
        method: "ankr_getAccountBalance",
        params: {
          walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
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
          console.log(
            "Ankr balance 1 response is: " + JSON.stringify(response),
          );

          return ResultUtils.combine(
            response.result.assets.map((item) => {
              return okAsync(
                new TokenBalance(
                  EChainTechnology.EVM,
                  item.tokenSymbol,
                  chainId,
                  null,
                  accountAddress,
                  BigNumberString(item.balanceUsd),
                  item.tokenDecimals,
                ),
              );
            }),
          );
        })
        .andThen((vals) => {
          console.log("Ankr balances 2 response is: " + JSON.stringify(vals));
          return okAsync(vals);
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
          walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
        },
        id: 1,
      };

      console.log("Ankr tokens url is: " + url);
      return this.ajaxUtils
        .post<IAnkrNftReponse>(new URL(url), requestParams, {
          headers: {
            "Content-Type": `application/json;`,
          },
        })
        .andThen((response) => {
          console.log("Ankr tokens response is: " + JSON.stringify(response));
          return ResultUtils.combine(
            response.result.assets.map((item) => {
              console.log(
                "getChainInfoByChain(this.supportedNfts.get(item.blockchain)).chainId: " +
                  getChainInfoByChain(this.supportedNfts.get(item.blockchain)!)
                    .chainId,
              );
              console.log("chainId: " + chainId);

              // if (
              //   getChainInfoByChain(this.supportedNfts.get(item.blockchain)!)
              //     .chainId !== chainId
              // ) {
              //   return okAsync(null);
              // }

              return okAsync(
                new EVMNFT(
                  item.contractAddress,
                  BigNumberString(item.tokenId),
                  item.contractType,
                  accountAddress,
                  TokenUri(item.imageUrl),
                  item.traits,
                  BigNumberString(item.blockNumber),
                  item.name,
                  getChainInfoByChain(
                    this.supportedNfts.get(item.blockchain)!,
                  ).chainId, // chainId
                  undefined,
                  UnixTimestamp(Number(item.timestamp)),
                ),
              );

              //   const items = response.data.map((token) => {
              //     const assets = token.assets.map((asset) => {
              //       return new EVMNFT(
              //         EVMContractAddress(asset.contract_address),
              //         BigNumberString(asset.token_id),
              //         asset.erc_type,
              //         EVMAccountAddress(asset.owner),
              //         TokenUri(asset.token_uri),
              //         { raw: asset.metadata_json },
              //         BigNumberString(asset.amount),
              //         asset.name,
              //         chainId,
              //         undefined,
              //         UnixTimestamp(Number(asset.own_timestamp)),
              //       );
              //     });
              //     return assets;
              // );
            }),
          );
          // .map((balances) => {
          //   console.log("Ankr Token Balances 1: " + JSON.stringify(balances));
          //   return Promise.all(balances).then((balance) => {
          //     return (
          //       balance
          //         //@ts-ignore
          //         .filter((obj) => obj.value != null)
          //         .map((tokenBalance) => {
          //           //@ts-ignore
          //           return tokenBalance.value;
          //         })
          //     );
          //   });
          // });
        })
        .andThen((vals) => {
          console.log("Ankr Token Balances 2: " + JSON.stringify(vals));
          return okAsync(vals);
        });
    });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return okAsync([]);
    // return this.configProvider.getConfig().andThen((config) => {
    //   const url =
    //     "https://rpc.ankr.com/multichain/" +
    //     config.apiKeys.ankrApiKey +
    //     "/?ankr_getTransactionsByAddress";
    //   const requestParams = {
    //     jsonrpc: "2.0",
    //     method: "ankr_getTransactionsByAddress",
    //     params: {
    //       walletAddress: "0x633b0E4cc5b72e7196e12b6B8aF1d79c7D406C83",
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
          console.log("Ankr key: " + config.apiKeys.ankrApiKey);
          if (
            config.apiKeys.ankrApiKey == "" ||
            config.apiKeys.ankrApiKey == undefined
          ) {
            console.log("Ankr component set to NoKeyProvided");
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            console.log("Ankr component set to Available");
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

interface IHealthCheck {
  status?: string;
  message?: string;
}
