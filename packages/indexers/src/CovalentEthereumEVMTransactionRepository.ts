import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  AccountIndexingError,
  AjaxError,
  BlockNumber,
  EVMAccountAddress,
  EVMTransaction,
  IEthereumEVMTransactionRepository,
  ChainId,
  UnixTimestamp,
  BigNumberString,
  IAvalancheEVMTransactionRepository,
} from "@snickerdoodlelabs/objects";
import { EVMEvent } from "@snickerdoodlelabs/objects/src/businessObjects/EVMEvent";
import { inject, injectable } from "inversify";
import { err, okAsync, ResultAsync } from "neverthrow";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "./IIndexerConfigProvider";

interface ICovalentEthereumTransactionResponse {
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

@injectable()
export class CovalentEthereumEVMTransactionRepository
  implements
    IEthereumEVMTransactionRepository,
    IAvalancheEVMTransactionRepository
{
  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getEVMTransactions(
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.generateQueryConfig(accountAddress, startTime, endTime).andThen(
      (queryConfig: any) => {
        return this.ajaxUtils
          .get<ICovalentEthereumTransactionResponse>(
            queryConfig.url,
            queryConfig,
          )
          .andThen((queryResult: ICovalentEthereumTransactionResponse) => {
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

            return okAsync(transactions);
          });
      },
    );
  }

  private generateQueryConfig(
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<any, never> {
    return this.configProvider.getConfig().map((config) => {
      let primer: string = JSON.stringify({
        block_signed_at: {
          $gt: startTime.toString(),
        },
      });

      if (endTime !== undefined) {
        primer = JSON.stringify({
          block_signed_at: {
            $and: [
              {
                block_signed_at: {
                  $gt: startTime.toString(),
                },
              },
              {
                block_signed_at: {
                  $lte: endTime.toString(),
                },
              },
            ],
          },
        });
      }

      const result = {
        method: "get",
        url: `https://api.covalenthq.com/v1/${config.chainId}/address/${accountAddress}/transactions_v2/?key=${config.apiKey}&match=${primer}`,
        headers: {},
      };

      return result;
    });
  }
}
