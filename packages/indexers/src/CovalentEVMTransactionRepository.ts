import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  IRequestConfig,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
  EVMAccountAddress,
  EVMTransaction,
  IEVMTransactionRepository,
  ChainId,
  UnixTimestamp,
  BigNumberString,
  EVMEvent,
  IEVMAccountBalanceRepository,
  IEVMBalance,
  AccountBalanceError,
  TickerSymbol,
  EVMContractAddress,
  toUnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { urlJoinP, urlJoin } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider.js";

interface ICovalentEVMTransactionResponseItem {
  block_signed_at: string;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label?: string | null;
  to_address: string | null;
  to_address_label?: string | null;
  value: number | null;
  value_quote: number | null;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  fees_paid: string;
  gas_quote: number;
  gas_quote_rate: number;

  log_events: {
    block_signed_at: string;
    block_height: number;
    tx_offset: number;
    log_offset: number;
    tx_hash: string;
    raw_log_topics: string[];
    sender_contract_decimals: number;
    sender_name: string;
    sender_contract_ticker_symbol: string;
    sender_address: string;
    sender_address_label: string;
    sender_logo_url: string;
    raw_log_data: string;
    decoded: {
      name: string;
      signature: string;
      params:
        | {
            name: string;
            type: string;
            indexed: boolean;
            decoded: boolean;
            value: string;
          }[]
        | null;
    };
  }[];
}

interface ICovalentEVMTransactionResponse {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currenncy: string;
    chain_id: number;

    items: ICovalentEVMTransactionResponseItem[];

    pagination: {
      has_more: boolean;
      page_number: number;
      page_size: number;
      total_count?: number | null;
    };
  };

  error: boolean;
  error_message: string | null;
  error_code: number | null;
}

interface ICovalentEVMBalanceResponse {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    items: IEVMTokenInfo[];
  };
}

interface IEVMTokenInfo {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  balance: BigNumberString;
  quote: number;

  contract_name?: string;
  logo_url?: string;
  last_transferred_at?: string;
  type?: string;
}

@injectable()
export class CovalentEVMTransactionRepository
  implements IEVMTransactionRepository, IEVMAccountBalanceRepository
{
  private ENDPOINT_TRANSACTIONS = "transactions_v2";
  private ENDPOINT_BALANCES = "balances_v2";

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getEVMTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.scanTransactions(chainId, accountAddress, startTime, endTime);
  }

  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError> {
    return this.generateParams().andThen((params) => {
      return this.generateQueryConfig(
        chainId,
        this.ENDPOINT_BALANCES,
        accountAddress,
        params,
      ).andThen((requestConfig) => {
        return this.ajaxUtils
          .get<ICovalentEVMBalanceResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .map((queryResult) => {
            return queryResult.data.items.map((tokenInfo) => {
              return {
                ticker: TickerSymbol(tokenInfo.contract_ticker_symbol),
                chainId: chainId,
                accountAddress: accountAddress,
                balance: tokenInfo.balance,
                contractAddress: EVMContractAddress(tokenInfo.contract_address),
                quoteBalance: tokenInfo.quote,
              };
            });
          });
      });
    });
  }

  private scanTransactions(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
    start?: Date,
    end?: Date,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    console.log("scanning", chainId, accountAddress, start, end);
    return this.getDepth(chainId, accountAddress, start).andThen(
      (startTime) => {
        console.log("start", start);

        if (startTime == null) {
          return okAsync([]);
        }

        return this.generateParams(startTime, end, false, 0).andThen(
          (params) => {
            console.log("params", params);

            return this.fetchPages(
              chainId,
              this.ENDPOINT_TRANSACTIONS,
              accountAddress,
              params,
            ).andThen((txs) => {
              console.log("txs", txs.length);

              if (startTime.valueOf() >= toUnixTimestamp(new Date())) {
                console.log("caught up");
                return okAsync(txs);
              }

              return this.configProvider.getConfig().andThen((config) => {
                const newStart = new Date(
                  startTime.getTime() + config.txIndexingSpanMS,
                );
                console.log("newStart", newStart);

                if (end != undefined && newStart.getTime() > end?.getTime()) {
                  console.log("end reached", end, newStart);
                  return okAsync(txs);
                }

                return this.scanTransactions(
                  chainId,
                  accountAddress,
                  startTime,
                  end,
                ).andThen((nextTxs) => {
                  console.log("next", nextTxs.length);
                  return okAsync([...txs, ...nextTxs]);
                });
              });
            });
          },
        );
      },
    );
  }

  private getDepth(
    chainId: ChainId,
    accountAddr: EVMAccountAddress,
    start?: Date,
  ): ResultAsync<Date | null, AjaxError | AccountIndexingError> {
    if (start != undefined && start.getTime() > 0) {
      return okAsync(start);
    }

    console.log("depth");

    return this.generateParams(
      undefined,
      undefined,
      true,
      undefined,
      1,
      true,
    ).andThen((params) => {
      return this.generateQueryConfig(
        chainId,
        this.ENDPOINT_TRANSACTIONS,
        accountAddr,
        params,
      ).andThen((query) => {
        console.log("query", query);

        return (
          this.ajaxUtils
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .get<ICovalentEVMTransactionResponse>(new URL(query.url!), query)
            .andThen((response) => {
              console.log("response", response);

              if (response.data.items.length == 0) {
                return okAsync(null);
              }
              const timestamp = response.data.items[0].block_signed_at;
              return okAsync(new Date(timestamp));
            })
        );
      });
    });
  }

  private fetchPages(
    chainId: ChainId,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    params: object,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.generateQueryConfig(
      chainId,
      endpoint,
      accountAddress,
      params,
    ).andThen((requestConfig) => {
      return this.ajaxUtils
        .get<ICovalentEVMTransactionResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        )
        .andThen((queryResult) => {
          const chainId = ChainId(queryResult.data.chain_id);
          const transactions = queryResult.data.items.map((tx) =>
            this.mapTransaction(tx, chainId),
          );

          if (queryResult.data.pagination.has_more) {
            params["page-number"] += 1;
            return this.fetchPages(
              chainId,
              endpoint,
              accountAddress,
              params,
            ).andThen((otherTransactions) => {
              return okAsync([...transactions, ...otherTransactions]);
            });
          }

          return okAsync(transactions);
        });
    });
  }

  private mapTransaction(
    tx: ICovalentEVMTransactionResponseItem,
    chainId: ChainId,
  ): EVMTransaction {
    const busObj = new EVMTransaction(
      chainId,
      tx.tx_hash,
      UnixTimestamp(Math.floor(Date.parse(tx.block_signed_at) / 1000)),
      tx.block_height,
      tx.to_address != null ? EVMAccountAddress(tx.to_address) : null,
      tx.from_address != null ? EVMAccountAddress(tx.from_address) : null,
      tx.value != null ? BigNumberString(tx.value.toString()) : null,
      tx.gas_price != null ? BigNumberString(tx.gas_price.toString()) : null,
      tx.gas_offered != null
        ? BigNumberString(tx.gas_offered.toString())
        : null,
      tx.fees_paid != null ? BigNumberString(tx.fees_paid.toString()) : null,
      null,
      tx.value_quote,
    );

    if (tx.log_events != null) {
      busObj.events = tx.log_events.map((event) => {
        return new EVMEvent(
          event.tx_hash,
          event.raw_log_data,
          event.raw_log_topics,
          event.sender_contract_decimals,
          event.sender_name,
          event.sender_contract_ticker_symbol,
          event.sender_address,
          event.sender_address_label,
          event.sender_logo_url,
          event.raw_log_data,
          event.decoded,
        );
      });
    }

    return busObj;
  }

  private generateParams(
    start?: Date,
    end?: Date,
    asc?: boolean,
    pageNumber?: number,
    pageSize?: number,
    noLogs?: boolean,
  ): ResultAsync<object, never> {
    return this.configProvider.getConfig().map((config) => {
      const params = {
        key: config.covalentApiKey,
        "quote-currency": config.quoteCurrency,
        "no-logs": noLogs ?? false,
      };

      if (asc != undefined) {
        params["block-signed-at-asc"] = asc;
      }
      if (start != undefined) {
        params["block-signed-at-limit"] = toUnixTimestamp(start);
        params["block-signed-at-span"] = config.txIndexingSpanMS / 1000;

        if (end != undefined) {
          params["block-signed-at-span"] =
            (end.getTime() - start.getTime()) / 1000;
        }
      }
      if (pageNumber != undefined) {
        params["page-number"] = pageNumber;
      }
      if (pageSize != undefined) {
        params["page-size"] = pageSize;
      }

      return params;
    });
  }

  private generateQueryConfig(
    chainId: ChainId,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    params: object,
  ): ResultAsync<IRequestConfig, never> {
    const url = urlJoin(
      "https://api.covalenthq.com",
      "v1",
      chainId.toString(),
      "address",
      accountAddress,
      endpoint,
      urlJoinP(undefined, [], params), // needs to be assembled separately to preserve trailing slash
    );

    const result: IRequestConfig = {
      method: "get",
      url: url,
      headers: { Accept: "application/json" },
    };
    return okAsync(result);
  }
}
