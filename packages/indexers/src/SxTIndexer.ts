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
  IEVMAccountBalanceRepository,
  IEVMTransactionRepository,
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
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

export class SxTIndexer
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

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    

    return ResultUtils.combine()
  }

  protected _paginateTransactions(
    chain: ChainId,
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
          .mapErr((e) => {
            return new AccountIndexingError("error fetching transactions", e);
          });
      });
  }

  private refreshBearerToken(): ResultAsync<
    EVMTransaction[],
    AccountIndexingError
  > {
    const url = new URL("https://api.spaceandtime.app/v1/auth/clearAllBackups");
    // eslint-disable-next-line @typescript-eslint/ban-types
    return this.ajaxUtils.post<Object>(url, {
      userId: "andrewstrimaitis",
    } as unknown as Record<string, unknown>);
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
