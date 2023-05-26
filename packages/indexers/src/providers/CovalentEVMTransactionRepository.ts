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
  ChainId,
  UnixTimestamp,
  BigNumberString,
  EVMEvent,
  TickerSymbol,
  EVMContractAddress,
  EVMTransactionHash,
  TokenBalance,
  EChainTechnology,
  IEVMIndexer,
  EVMNFT,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoinP, urlJoin } from "url-join-ts";

import {
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
} from "@indexers/interfaces/IIndexerConfigProvider.js";

@injectable()
export class CovalentEVMTransactionRepository implements IEVMIndexer {
  private ENDPOINT_TRANSACTIONS = "transactions_v2";
  private ENDPOINT_BALANCES = "balances_v2";
  protected health: EComponentStatus = EComponentStatus.Disabled;
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.Arbitrum,
      new IndexerSupportSummary(EChain.Arbitrum, true, false, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {}

  public getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    return this.generateQueryConfig(
      chainId,
      this.ENDPOINT_BALANCES,
      accountAddress,
    )
      .andThen((requestConfig) => {
        return this.ajaxUtils
          .get<ICovalentEVMBalanceResponse>(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            new URL(requestConfig.url!),
            requestConfig,
          )
          .map((queryResult) => {
            return queryResult.data.items.map((tokenInfo) => {
              return new TokenBalance(
                EChainTechnology.EVM,
                TickerSymbol(tokenInfo.contract_ticker_symbol),
                chainId,
                EVMContractAddress(tokenInfo.contract_address),
                accountAddress,
                BigNumberString(tokenInfo.balance),
                tokenInfo.contract_decimals,
              );
            });
          });
      })
      .mapErr(
        (e) =>
          new AccountIndexingError("error fetching balances from covalent", e),
      );
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
    return this.generatePrimer(startTime, endTime).andThen((primer) => {
      return this.fetchPages(
        chainId,
        this.ENDPOINT_TRANSACTIONS,
        accountAddress,
        primer,
      );
    });
  }

  public getHealthCheck(): ResultAsync<EComponentStatus, AjaxError> {
    this.health = EComponentStatus.Available;
    return this.configProvider.getConfig().andThen((config) => {
      console.log("Covalent Keys: " + config.apiKeys.covalentApiKey);
      return okAsync(this.health);
    });
  }

  public healthStatus(): EComponentStatus {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.indexerSupport;
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

  private fetchPages(
    chainId: ChainId,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    primer?: string,
    pageNumber?: number,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.generateQueryConfig(
      chainId,
      endpoint,
      accountAddress,
      primer,
      pageNumber,
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
            return this.fetchPages(
              chainId,
              endpoint,
              accountAddress,
              primer,
              queryResult.data.pagination.page_number + 1,
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
      EVMTransactionHash(tx.tx_hash),
      UnixTimestamp(Math.floor(Date.parse(tx.block_signed_at) / 1000)),
      tx.block_height,
      tx.to_address != null ? EVMAccountAddress(tx.to_address) : null,
      tx.from_address != null ? EVMAccountAddress(tx.from_address) : null,
      tx.value != null ? BigNumberString(tx.value.toString()) : null,
      tx.gas_price != null ? BigNumberString(tx.gas_price.toString()) : null,
      null,
      null,
      null,
      null,
      tx.log_events
        ? tx.log_events.map((event) => {
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
          })
        : null,
    );
    return busObj;
  }

  private generateQueryConfig(
    chainId: ChainId,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    primer?: string,
    pageNumber?: number,
  ): ResultAsync<IRequestConfig, never> {
    return this.configProvider.getConfig().map((config) => {
      const params = {
        key: config.apiKeys.covalentApiKey,
        "quote-currency": config.quoteCurrency,
      };

      if (pageNumber != undefined) {
        params["page-number"] = pageNumber;
      }
      if (primer != undefined) {
        params["match"] = primer;
      }
      const paramString = urlJoinP(undefined, [], params);

      const url = urlJoin(
        "https://api.covalenthq.com",
        "v1",
        chainId.toString(),
        "address",
        accountAddress,
        endpoint,
        paramString, // needs to be assembled separately to preserve trailing slash
      );

      const result: IRequestConfig = {
        method: "get",
        url: url,
        headers: { Accept: "application/json" },
      };
      return result;
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
