import { AccountBalanceError } from "@objects/errors/AccountBalanceError";
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
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/IIndexerConfigProvider";

interface ICovalentEVMTransactionResponse {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currenncy: string;
    chain_id: number;

    items: {
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
    }[];

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
  address: string;
  updated_at: string;
  next_update_at: string;
  quote_currency: string;
  chain_id: number;
  items: IEVMTokenInfo[];
}

interface IEVMTokenInfo {
  contract_decimals: number;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: string[];
  balance: BigNumberString;

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
    return this.generatePrimer(startTime, endTime).andThen((primer) => {
      return this.generateQueryConfig(
        chainId,
        "transactions_v2",
        accountAddress,
        primer,
      ).andThen((queryConfig) => {
        return this.ajaxUtils
          .get<ICovalentEVMTransactionResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(queryConfig.url!),
            queryConfig,
          )
          .map((queryResult: ICovalentEVMTransactionResponse) => {
            const chainId = ChainId(queryResult.data.chain_id);
            const transactions = queryResult.data.items.map((tx) => {
              const busObj = new EVMTransaction(
                chainId,
                tx.tx_hash,
                UnixTimestamp(
                  Math.floor(Date.parse(tx.block_signed_at) / 1000),
                ),
                tx.block_height,
                tx.to_address != null ? EVMAccountAddress(tx.to_address) : null,
                tx.from_address != null
                  ? EVMAccountAddress(tx.from_address)
                  : null,
                tx.value != null ? BigNumberString(tx.value.toString()) : null,
                tx.gas_price != null
                  ? BigNumberString(tx.gas_price.toString())
                  : null,
                tx.gas_offered != null
                  ? BigNumberString(tx.gas_offered.toString())
                  : null,
                tx.fees_paid != null
                  ? BigNumberString(tx.fees_paid.toString())
                  : null,
                null,
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
            });

            return transactions;
          });
      });
    });
  }

  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError> {
    return this.generateQueryConfig(
      chainId,
      this.ENDPOINT_BALANCES,
      accountAddress,
    ).andThen((requestConfig) => {
      return this.ajaxUtils
        .get<ICovalentEVMBalanceResponse>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          new URL(requestConfig.url!),
          requestConfig,
        )
        .map((queryResult) => {
          return queryResult.items.map((tokenInfo) => {
            return {
              ticker: tokenInfo.contract_ticker_symbol,
              chainId: chainId,
              accountAddress: accountAddress,
              balance: tokenInfo.balance,
            };
          });
        });
    });
  }

  private generatePrimer(
    startTime: Date,
    endTime?: Date,
  ): ResultAsync<string, never> {
    let primer: string = JSON.stringify({
      block_signed_at: {
        $gt: startTime.toISOString(),
      },
    });

    if (endTime !== undefined) {
      primer = JSON.stringify({
        $and: [
          {
            block_signed_at: {
              $gt: startTime.toISOString(),
            },
          },
          {
            block_signed_at: {
              $lt: endTime.toISOString(),
            },
          },
        ],
      });
    }

    return okAsync(primer);
  }

  private generateQueryConfig(
    chainId: ChainId,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    primer?: string,
  ): ResultAsync<IRequestConfig, never> {
    return this.configProvider.getConfig().map((config) => {
      let url = `https://api.covalenthq.com/v1/${chainId.toString()}/address/${accountAddress}/${endpoint}/?key=${
        config.covalentApiKey
      }`;
      if (primer != undefined) {
        url += `&match=${primer}`;
      }

      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: {},
      };
      return result;
    });
  }
}
