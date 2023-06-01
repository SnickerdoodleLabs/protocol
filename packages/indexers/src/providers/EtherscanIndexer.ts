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
  EVMAccountAddress,
  EVMTransaction,
  TokenBalance,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
  EVMContractAddress,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMTransactionHash,
  UnixTimestamp,
  getChainInfoByChainId,
  getEtherscanBaseURLForChain,
  IEVMIndexer,
  EVMNFT,
  MethodSupportError,
  getChainInfoByChain,
  EChain,
  EComponentStatus,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { IRequestConfig } from "packages/common-utils/src";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";
import { IIndexerHealthCheck } from "@indexers/interfaces/IIndexerHealthCheck.js";

@injectable()
export class EtherscanIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, true, true),
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

  public name(): string {
    return "etherscan";
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.getNonNativeBalance(chain, accountAddress),
      this.getNativeBalance(chain, accountAddress),
    ]).map(([nonNativeBalance, nativeBalance]) => {
      return [nativeBalance, ...nonNativeBalance];
    });
  }

  public getTokensForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    // throw new Error("Method not implemented.");
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for AlchemyIndexer",
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
      this.configProvider.getConfig(),
      this._getEtherscanApiKey(chainId),
      this._getBlockNumber(chainId, startTime),
      this._getBlockNumber(chainId, endTime),
    ]).andThen(([config, apiKey, fromBlock, toBlock]) => {
      const params = {
        module: "account",
        action: "txlist",
        address: accountAddress,
        startblock: fromBlock + 1, // start is inclusive. this occasionally fails when we are fully caught up but the poller eats the error.
        page: 1,
        offset: 100,
        sort: "asc",
        apikey: apiKey,
      };

      if (endTime != undefined) {
        params["endblock"] = toBlock;
      }

      return this._paginateTransactions(
        chainId,
        params,
        config.etherscanTransactionsBatchSize,
      );
    });
  }

  public getHealthCheck(): ResultAsync<
    Map<EChain, EComponentStatus>,
    AjaxError
  > {
    // console.log("Etherscan Indexer Health: ", this.health);
    return this.configProvider.getConfig().andThen((config) => {
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          // console.log(
          //   "Etherscan Indexer Health config.apiKeys.etherscanApiKeys: ",
          //   config.apiKeys.etherscanApiKeys,
          // );
          // console.log("config.apiKeys.etherscanApiKeys key: ", key);

          if (
            config.apiKeys.etherscanApiKeys[getChainInfoByChain(key).name] ==
              "" ||
            config.apiKeys.etherscanApiKeys[getChainInfoByChain(key).name] ==
              undefined
          ) {
            // console.log("key: " + key + " is set to NoKeyProvided");
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            // console.log("key: " + key + " is set to Available");
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

  private getNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getEtherscanApiKey(chain),
      getEtherscanBaseURLForChain(chain),
    ])
      .andThen(([apiKey, baseURL]) => {
        const url = new URL(
          urlJoinP(baseURL, ["api"], {
            module: "account",
            action: "balance",
            address: accountAddress,
            tag: "latest",
            apikey: apiKey,
          }),
        );
        return this.ajaxUtils.get<IEtherscanNativeBalanceResponse>(url);
      })
      .map((response) => {
        console.log("Ankr Native Balance: " + response);
        const nativeBalance = new TokenBalance(
          EChainTechnology.EVM,
          TickerSymbol(getChainInfoByChain(chain).nativeCurrency.symbol),
          getChainInfoByChain(chain).chainId,
          null,
          accountAddress,
          BigNumberString(response.result),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return nativeBalance;
      });
  }

  private getNonNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this._getEtherscanApiKey(chain),
      getEtherscanBaseURLForChain(chain),
    ])
      .andThen(([apiKey, baseURL]) => {
        const url = new URL(
          urlJoinP(baseURL, ["api"], {
            module: "account",
            action: "addresstokenbalance",
            address: accountAddress,
            page: 1,
            offset: 1000,
            apikey: apiKey,
          }),
        );
        return this.ajaxUtils.get<IEtherscanTokenBalanceResponse>(url);
      })
      .andThen((response) => {
        if (response.status != "1") {
          this.logUtils.warning(
            "error fetching erc20 balances from etherscan",
            response.message,
            "usually indicates that the address has no tokens",
          );
          return okAsync([]);
        }

        return ResultUtils.combine(
          response.result.map((item) => {
            if (
              this.tokenPriceRepo.getTokenInfoFromList(item.TokenAddress) ==
              undefined
            ) {
              return okAsync(undefined);
            }

            return okAsync(
              new TokenBalance(
                EChainTechnology.EVM,
                TickerSymbol(item.TokenSymbol),
                getChainInfoByChain(chain).chainId,
                EVMContractAddress(item.TokenAddress),
                accountAddress,
                BigNumberString(item.TokenQuantity),
                Number.parseInt(item.TokenDivisor),
              ),
            );
          }),
        );
      })

      .andThen((balances) => {
        return okAsync(
          balances.filter((x) => x != undefined) as TokenBalance[],
        );
      });
  }

  protected _paginateTransactions(
    chain: EChain,
    params: IEtherscanRequestParameters,
    maxRecords: number,
  ): ResultAsync<EVMTransaction[], AccountIndexingError> {
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
          .get<IEtherscanTransactionResponse>(url)
          .andThen((response) => {
            if (
              response.status != "1" ||
              response.message == "No transactions found"
            ) {
              if (response.result != null) {
                return okAsync([]);
              }

              return errAsync(
                new AccountIndexingError(
                  "error fetching transactions from etherscan",
                  response.message,
                ),
              );
            }

            const txs = response.result.map((tx) => {
              // etherscan uses "" instead of null
              return new EVMTransaction(
                getChainInfoByChain(chain).chainId,
                EVMTransactionHash(tx.hash),
                UnixTimestamp(Number.parseInt(tx.timeStamp)),
                tx.blockNumber == "" ? null : Number.parseInt(tx.blockNumber),
                tx.to == "" ? null : EVMAccountAddress(tx.to),
                tx.from == "" ? null : EVMAccountAddress(tx.from),
                tx.value == "" ? null : BigNumberString(tx.value),
                tx.gasPrice == "" ? null : BigNumberString(tx.gasPrice),
                tx.contractAddress == ""
                  ? null
                  : EVMContractAddress(tx.contractAddress),
                tx.input == "" ? null : tx.input,
                tx.methodId == "" ? null : tx.methodId,
                tx.functionName == "" ? null : tx.functionName,
                null,
              );
            });

            params.page += 1;
            return this._paginateTransactions(
              getChainInfoByChain(chain).chainId,
              params,
              maxRecords,
            ).map((otherTxs) => {
              return [...txs, ...otherTxs];
            });
          })
          .mapErr((e) => {
            return new AccountIndexingError("error fetching transactions", e);
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
        .get<IEtherscanBlockNumberResponse>(url)
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

  protected _getEtherscanApiKey(
    chain: EChain,
  ): ResultAsync<string, AccountIndexingError> {
    return this.configProvider.getConfig().andThen((config) => {
      const key = getChainInfoByChain(chain).name;
      // console.log("Etherscan Key: " + key);
      // console.log(
      //   "config.apiKeys.etherscanApiKeys[key] Key: " +
      //     config.apiKeys.etherscanApiKeys[key],
      // );
      if (
        config.apiKeys.etherscanApiKeys[key] == "" ||
        config.apiKeys.etherscanApiKeys[key] == undefined
      ) {
        this.logUtils.error("Error inside _getEtherscanApiKey");
        return errAsync(
          new AccountIndexingError("no etherscan api key for chain", chain),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.apiKeys.etherscanApiKeys[key]!);
    });
  }
}

interface IEtherscanTransactionResponse {
  status: string;
  message: string;
  result: {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;
    isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
    methodId: string;
    functionName: string;
    value_quote: number | null;
  }[];
}

interface IEtherscanTokenBalanceResponse {
  status: string;
  message: string;
  result: {
    TokenAddress: EVMContractAddress;
    TokenName: string;
    TokenSymbol: TickerSymbol;
    TokenQuantity: BigNumberString;
    TokenDivisor: BigNumberString;
  }[];
}

interface IEtherscanNativeBalanceResponse {
  status: string;
  message: string;
  result: string;
}

interface IEtherscanRequestParameters {
  module: string;
  action: string;
  address: EVMAccountAddress;
  page: number;
  offset: number;
  apikey: string;
}

interface IEtherscanBlockNumberResponse {
  status: string;
  message: string;
  result: BigNumberString;
}

interface IHealthCheck {
  status?: string;
  message?: string;
}
