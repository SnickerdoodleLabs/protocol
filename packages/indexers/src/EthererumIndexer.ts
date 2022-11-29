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
  EVMNFT,
  IEVMAccountBalanceRepository,
  IEVMNftRepository,
  IEVMTransactionRepository,
  TokenBalance,
  EChain,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
  EVMContractAddress,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  TokenUri,
  EVMBlockNumber,
  EVMTransactionHash,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class EthereumIndexer
  implements IEVMTransactionRepository, IEVMAccountBalanceRepository
{
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(ITokenPriceRepositoryType)
    protected tokenPriceRepo: ITokenPriceRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this._getBlockNumber(chainId, startTime),
      this._getBlockNumber(chainId, endTime),
    ]).andThen(([config, fromBlock, toBlock]) => {
      const params = {
        module: "account",
        action: "txlist",
        address: accountAddress,
        startblock: fromBlock,
        endblock: endTime ? toBlock : undefined,
        page: 1,
        offset: 100,
        sort: "asc",
        apikey: config.etherscanApiKey,
      };

      return this._paginateTransactions(
        chainId,
        params,
        config.etherscanTransactionsBatchSize,
      );
    });
  }

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return this.configProvider.getConfig().andThen((config) => {
      const url = new URL(
        urlJoinP("https://api.etherscan.io/", ["api"], {
          module: "account",
          action: "addresstokenbalance",
          address: accountAddress,
          page: 1,
          offset: 1000,
          apikey: config.etherscanApiKey,
        }),
      );

      return this.ajaxUtils
        .get<IEtherscanTokenBalanceResponse>(url)
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
              return this.tokenPriceRepo
                .getTokenInfo(chainId, item.TokenAddress)
                .andThen((info) => {
                  if (info == null) {
                    return okAsync(undefined);
                  }

                  return okAsync(
                    new TokenBalance(
                      EChainTechnology.EVM,
                      TickerSymbol(item.TokenSymbol),
                      chainId,
                      EVMContractAddress(item.TokenAddress),
                      accountAddress,
                      BigNumberString(
                        ethers.utils.formatUnits(
                          item.TokenQuantity,
                          item.TokenDivisor,
                        ),
                      ),
                      BigNumberString("0"),
                    ),
                  );
                });
            }),
          ).andThen((balances) => {
            return okAsync(
              balances.filter((x) => x != undefined) as TokenBalance[],
            );
          });
        })
        .andThen((balances) => {
          const url = new URL(
            urlJoinP("https://api.etherscan.io", ["api"], {
              module: "account",
              action: "balance",
              address: accountAddress,
              tag: "latest",
              apikey: config.etherscanApiKey,
            }),
          );
          return this.ajaxUtils
            .get<IEtherscanNativeBalanceResponse>(url)
            .map((response) => {
              const nativeBalance = new TokenBalance(
                EChainTechnology.EVM,
                TickerSymbol("ETH"),
                chainId,
                null,
                accountAddress,
                BigNumberString(ethers.utils.formatEther(response.result)),
                BigNumberString("0"),
              );
              return [nativeBalance, ...balances];
            });
        });
    });
  }

  private _paginateTransactions(
    chain: ChainId,
    params: IEtherscanRequestParameters,
    maxRecords: number,
  ): ResultAsync<EVMTransaction[], AccountIndexingError> {
    return this._getEtherscanBaseURL(chain).andThen((baseUrl) => {
      const offset = params.offset;
      const page = params.page;
      if (offset * page > maxRecords) {
        return okAsync([]);
      }

      const url = new URL(urlJoinP(baseUrl, ["api"], params));
      return this.ajaxUtils
        .get<IEtherscanTransactionResponse>(url)
        .andThen((response) => {
          if (response.status != "1") {
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
              chain,
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
          return this._paginateTransactions(chain, params, maxRecords).map(
            (otherTxs) => {
              return [...txs, ...otherTxs];
            },
          );
        })
        .mapErr(
          (e) => new AccountIndexingError("error fetching transactions", e),
        );
    });
  }

  private _getBlockNumber(
    chain: ChainId,
    timestamp: Date | undefined,
  ): ResultAsync<number, AccountIndexingError> {
    if (timestamp == undefined) {
      return okAsync(-1);
    }

    return ResultUtils.combine([
      this._getEtherscanBaseURL(chain),
      this.configProvider.getConfig(),
    ]).andThen(([baseUrl, config]) => {
      const url = new URL(
        urlJoinP(baseUrl, ["api"], {
          module: "block",
          action: "getblocknobytime",
          timestamp: (timestamp.getTime() / 1000).toFixed(0),
          closest: "before",
          apikey: config.etherscanApiKey,
        }),
      );

      return this.ajaxUtils
        .get<{
          status: string;
          message: string;
          result: BigNumberString;
        }>(url)
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

  private _getEtherscanBaseURL(
    chain: ChainId,
  ): ResultAsync<string, AccountIndexingError> {
    switch (chain) {
      case ChainId(EChain.EthereumMainnet):
        return okAsync("https://api.etherscan.io");
      case ChainId(EChain.Goerli):
        return okAsync("https://api-goerli.etherscan.io/");
      case ChainId(EChain.Kovan):
        return okAsync("https://api-kovan.etherscan.io/");
      default:
        return errAsync(
          new AccountIndexingError("invalid chainId for etherscan"),
        );
    }
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
