import {
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ILogUtilsType,
  ILogUtils,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  ChainId,
  EVMAccountAddress,
  EVMTransaction,
  ITokenPriceRepository,
  ITokenPriceRepositoryType,
  TokenBalance,
  EChain,
  EChainTechnology,
  BigNumberString,
  TickerSymbol,
  EVMContractAddress,
  getChainInfoByChainId,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  PolygonTransaction,
  EPolygonTransactionType,
  IEVMIndexer,
  EVMNFT,
  MethodSupportError,
  getChainInfoByChain,
  EComponentStatus,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
// import { Network, Alchemy, TokenMetadataResponse } from "alchemy-sdk";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { IIndexerHealthCheck } from "@indexers/interfaces/IIndexerHealthCheck.js";

@injectable()
export class PolygonIndexer implements IEVMIndexer {
  protected health: EComponentStatus = EComponentStatus.Disabled;
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, true, true, true),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}
  getHealthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    this.health = EComponentStatus.Available;
    return okAsync(this.health);
  }
  healthStatus(): EComponentStatus {
    return this.health;
  }
  getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
  }
  getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for AlchemyIndexer",
        400,
      ),
    );
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
    // return this._getAlchemyClient(chainId).andThen((alchemy) => {
    //   return ResultUtils.combine([
    //     ResultAsync.fromPromise(
    //       alchemy.core.getTokenBalances(accountAddress),
    //       (e) =>
    //         new AccountIndexingError("error fetching balances from alchemy", e),
    //     ).andThen((response) => {
    //       return ResultUtils.combine(
    //         response.tokenBalances.map((balance) => {
    //           if (balance.tokenBalance == null) {
    //             return okAsync(null);
    //           }

    //           const balanceValue = BigNumber.from(
    //             balance.tokenBalance,
    //           ).toString();
    //           if (balanceValue == "0") {
    //             return okAsync(null);
    //           }

    //           return this._getTokenMetadata(
    //             chainId,
    //             EVMContractAddress(balance.contractAddress),
    //           ).andThen((metadata) => {
    //             if (metadata.decimals == null || metadata.symbol == null) {
    //               return okAsync(null);
    //             }

    //             return okAsync(
    //               new TokenBalance(
    //                 EChainTechnology.EVM,
    //                 TickerSymbol(metadata.symbol),
    //                 chainId,
    //                 EVMContractAddress(balance.contractAddress),
    //                 accountAddress,
    //                 BigNumberString(
    //                   BigNumber.from(balance.tokenBalance).toString(),
    //                 ),
    //                 metadata.decimals,
    //               ),
    //             );
    //           });
    //         }),
    //       ).map((arr) => arr.filter((x) => x != null) as TokenBalance[]);
    //     }),
    //     ResultAsync.fromPromise(
    //       alchemy.core.getBalance(accountAddress),
    //       (e) =>
    //         new AccountIndexingError("error fetching native matic balance", e),
    //     ),
    //   ]).andThen(([tokenBalances, nativeBalance]) => {
    //     tokenBalances.push(
    //       new TokenBalance(
    //         EChainTechnology.EVM,
    //         TickerSymbol("MATIC"),
    //         chainId,
    //         null,
    //         accountAddress,
    //         BigNumberString(nativeBalance.toString()),
    //         getChainInfoByChainId(chainId).nativeCurrency.decimals,
    //       ),
    //     );
    //     return okAsync(tokenBalances);
    //   });
    // });
  }

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getBlockNumber(chainId, startTime),
      this._getBlockNumber(chainId, endTime),
    ]).andThen(([fromBlock, toBlock]) => {
      return ResultUtils.combine([
        this._getERC20Transactions(chainId, accountAddress, fromBlock, toBlock),
        this._getNFTTransactions(
          chainId,
          accountAddress,
          "tokennfttx",
          EPolygonTransactionType.ERC721,
          fromBlock,
          toBlock,
        ),
        this._getNFTTransactions(
          chainId,
          accountAddress,
          "token1155tx",
          EPolygonTransactionType.ERC1155,
          fromBlock,
          toBlock,
        ),
      ]).map(([erc20, erc721, erc1155]) => {
        return [...erc20, ...erc721, ...erc1155];
      });
    });
  }

  private _getNFTTransactions(
    chain: ChainId,
    address: EVMAccountAddress,
    action: string,
    type: EPolygonTransactionType,
    fromBlock: number,
    toBlock: number,
  ): ResultAsync<PolygonTransaction[], AccountIndexingError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._getEtherscanApiKey(chain),
    ])
      .andThen(([config, apiKey]) => {
        const params = {
          module: "account",
          action: action,
          address: address,
          startblock: fromBlock + 1, // start is inclusive. this occasionally fails when we are fully caught up but the poller eats the error.
          page: 1,
          offset: 100,
          sort: "asc",
          apikey: apiKey,
        };

        if (toBlock > 0) {
          params["endblock"] = toBlock;
        }

        return this._getTransactions(
          chain,
          params,
          config.etherscanTransactionsBatchSize,
        ).map((rawTxs) => {
          return rawTxs.map((tx) => {
            return new PolygonTransaction(
              chain,
              EVMTransactionHash(tx.hash),
              UnixTimestamp(Number.parseInt(tx.timeStamp)),
              tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
              tx.to == "" ? null : EVMAccountAddress(tx.to),
              tx.from == "" ? null : EVMAccountAddress(tx.from),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              null,
              tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
              tx.contractAddress == ""
                ? null
                : EVMContractAddress(tx.contractAddress),
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              tx.tokenID == "" ? null : tx.tokenID!,
              type,
            );
          });
        });
      })
      .orElse((e) => {
        return okAsync([]);
      });
  }

  private _getERC20Transactions(
    chain: ChainId,
    address: EVMAccountAddress,
    fromBlock: number,
    toBlock: number,
  ): ResultAsync<PolygonTransaction[], AccountIndexingError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._getEtherscanApiKey(chain),
    ]).andThen(([config, apiKey]) => {
      const params = {
        module: "account",
        action: "tokentx",
        address: address,
        startblock: fromBlock + 1, // start is inclusive. this occasionally fails when we are fully caught up but the poller eats the error.
        page: 1,
        offset: 100,
        sort: "asc",
        apikey: apiKey,
      };

      if (toBlock > 0) {
        params["endblock"] = toBlock;
      }

      return this._getTransactions(
        chain,
        params,
        config.etherscanTransactionsBatchSize,
      ).map((rawTxs) => {
        return rawTxs.map((tx) => {
          return new PolygonTransaction(
            chain,
            EVMTransactionHash(tx.hash),
            UnixTimestamp(Number.parseInt(tx.timeStamp)),
            tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
            tx.to == "" ? null : EVMAccountAddress(tx.to),
            tx.from == "" ? null : EVMAccountAddress(tx.from),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tx.value == "" ? null : BigNumberString(tx.value!),
            tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
            tx.contractAddress == ""
              ? null
              : EVMContractAddress(tx.contractAddress),
            null,
            EPolygonTransactionType.ERC20,
          );
        });
      });
    });
  }

  private _getBlockNumber(
    chain: EChain,
    timestamp: Date | undefined,
  ): ResultAsync<number, AccountIndexingError> {
    if (timestamp == undefined) {
      return okAsync(-1);
    }

    return ResultUtils.combine([
      getEtherscanBaseURLForChain(chain),
      this._getEtherscanApiKey(chain),
    ]).andThen(([baseUrl, apiKey]) => {
      const url = new URL(
        urlJoinP(baseUrl, ["api"], {
          module: "block",
          action: "getblocknobytime",
          timestamp: (timestamp.getTime() / 1000).toFixed(0),
          closest: "before",
          apikey: apiKey,
        }),
      );

      return this.ajaxUtils
        .get<IPolygonscanBlockNumberResponse>(url)
        .andThen((resp) => {
          if (resp.status != "1") {
            // this is a bit noisy
            // this.logUtils.warning(
            //   "error fetching block number for timestamp from etherscan",
            //   resp.status,
            //   resp.message,
            // );
            return okAsync(0);
          }
          return okAsync(Number.parseInt(resp.result));
        })
        .mapErr(
          (e) => new AccountIndexingError("error loading block number", e),
        );
    });
  }

  protected _getTransactions<T>(
    chain: ChainId,
    params: IPolygonscanRequestParameters,
    maxRecords: number,
  ): ResultAsync<IPolygonscanRawTx[], AccountIndexingError> {
    return getEtherscanBaseURLForChain(chain)
      .map((baseUrl) => {
        const offset = params.offset;
        const page = params.page;
        if (offset * page > maxRecords) {
          return undefined;
        }

        return new URL(urlJoinP(baseUrl, ["api"], params));
      })
      .andThen((url) => {
        if (url == undefined) {
          return okAsync([]);
        }

        return this.ajaxUtils
          .get<IPolygonscanTransactionResponse>(url)
          .andThen((response) => {
            if (response.status != "1") {
              // polygonscan error behavior is super inconsistent
              if (
                response.result != null ||
                response.message == "No transactions found"
              ) {
                return okAsync([]);
              }

              return errAsync(
                new AccountIndexingError(
                  "error fetching transactions from etherscan",
                  response.message,
                ),
              );
            }

            params.page += 1;
            return this._getTransactions(chain, params, maxRecords).map(
              (otherTxs) => {
                return [...response.result, ...otherTxs];
              },
            );
          })
          .mapErr(
            (e) => new AccountIndexingError("error fetching transactions", e),
          );
      });
  }

  protected _getEtherscanApiKey(
    chain: EChain,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      const chainId = getChainInfoByChain(chain).chainId;
      if (!config.apiKeys.etherscanApiKeys[chainId] !== undefined) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.apiKeys.etherscanApiKeys[chainId]!);
    });
  }

  public healthCheck(): ResultAsync<string, AjaxError> {
    const url = urlJoinP("https://api.poap.tech", ["health-check"]);
    console.log("Poap URL: ", url);
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const result: IRequestConfig = {
          method: "get",
          url: url,
          headers: {
            accept: "application/json",
            "X-API-Key": config.apiKeys.poapApiKey,
          },
        };
        return okAsync(result);
      })
      .andThen((requestConfig) => {
        return this.ajaxUtils.get<IHealthCheck>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        );
      })
      .andThen((result) => {
        /* If status: healthy , its message is undefined */
        if (result.status !== undefined) {
          return okAsync("good");
        }
        return okAsync("bad");
      });
  }

  public get supportedChains(): Array<EChain> {
    const supportedChains = [
      EChain.Arbitrum,
      EChain.EthereumMainnet,
      EChain.Mumbai,
      EChain.Optimism,
      EChain.Polygon,
      EChain.Solana,
    ];
    return supportedChains;
  }
}

interface IPolygonscanRequestParameters {
  module: string;
  action: string;
  address: EVMAccountAddress;
  page: number;
  offset: number;
  apikey: string;
}

interface IPolygonscanTransactionResponse {
  status: string;
  message: string;
  result: IPolygonscanRawTx[];
}

interface IPolygonscanRawTx {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value?: string;
  gas: string;
  gasPrice: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  tokenID?: BigNumberString;
}

interface IPolygonscanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}

interface IHealthCheck {
  status?: string;
  message?: string;
}
