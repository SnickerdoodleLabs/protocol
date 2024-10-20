import {
  ILogUtilsType,
  ILogUtils,
  IAxiosAjaxUtilsType,
  IAxiosAjaxUtils,
  ITimeUtils,
  ITimeUtilsType,
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
  BigNumberString,
  EVMContractAddress,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  PolygonTransaction,
  EPolygonTransactionType,
  EVMNFT,
  MethodSupportError,
  getChainInfoByChain,
  EComponentStatus,
  IndexerSupportSummary,
  EDataProvider,
  EExternalApi,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProviderType,
  IIndexerConfigProvider,
  IIndexerContextProvider,
  IIndexerContextProviderType,
  IEVMIndexer,
} from "@indexers/interfaces/index.js";
@injectable()
export class PolygonIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, false, true, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      this.indexerSupport.forEach((indexerSupportSummary, chain) => {
        if (config.apiKeys.etherscanApiKeys[chain] == undefined) {
          this.health.set(chain, EComponentStatus.NoKeyProvided);
        } else {
          this.health.set(chain, EComponentStatus.Available);
        }
      });
    });
  }

  public name(): EDataProvider {
    return EDataProvider.Polygon;
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

    //           const balanceValue = BigInt(
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
    //                   BigInt(balance.tokenBalance).toString(),
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

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for PolygonIndexer",
        400,
      ),
    );
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

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
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
              this.timeUtils.getUnixNow(),
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
            this.timeUtils.getUnixNow(),
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
      this.contextProvider.getContext(),
    ]).andThen(([baseUrl, apiKey, context]) => {
      const url = new URL(
        urlJoinP(baseUrl, ["api"], {
          module: "block",
          action: "getblocknobytime",
          timestamp: (timestamp.getTime() / 1000).toFixed(0),
          closest: "before",
          apikey: apiKey,
        }),
      );

      context.privateEvents.onApiAccessed.next(EExternalApi.Polygon);
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
      if (config.apiKeys.etherscanApiKeys[chainId] == null) {
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.apiKeys.etherscanApiKeys[chainId]);
    });
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
