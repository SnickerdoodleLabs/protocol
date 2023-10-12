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
  EVMNFT,
  MethodSupportError,
  EComponentStatus,
  EChain,
  IndexerSupportSummary,
  EExternalApi,
  EDataProvider,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP, urlJoin } from "url-join-ts";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";

@injectable()
export class CovalentEVMTransactionRepository implements IEVMIndexer {
  private ENDPOINT_TRANSACTIONS = "transactions_v2";
  private ENDPOINT_BALANCES = "balances_v2";
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();
  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.Arbitrum, true, true, false),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Arbitrum, true, true, false),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Arbitrum, true, true, false),
    ],
  ]);

  public constructor(
    @inject(IIndexerConfigProviderType)
    protected configProvider: IIndexerConfigProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
    @inject(IIndexerContextProviderType)
    protected contextProvider: IIndexerContextProvider,
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.configProvider.getConfig().map((config) => {
      const keys = this.indexerSupport.keys();
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, key: EChain) => {
          if (config.apiKeys.covalentApiKey == null) {
            this.health.set(key, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(key, EComponentStatus.Available);
          }
        },
      );
    });
  }

  public name(): string {
    return EDataProvider.Covalent;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError> {
    return this.generateQueryConfig(
      chain,
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
                chain,
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
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return errAsync(
      new MethodSupportError(
        "getTokensForAccount not supported for Covalent Indexer",
        400,
      ),
    );
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.generatePrimer(startTime, endTime).andThen((primer) => {
      return this.fetchPages(
        chain,
        this.ENDPOINT_TRANSACTIONS,
        accountAddress,
        primer,
      );
    });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
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
    chain: EChain,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    primer?: string,
    pageNumber?: number,
  ): ResultAsync<EVMTransaction[], AccountIndexingError | AjaxError> {
    return this.generateQueryConfig(
      chain,
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
    chain: EChain,
  ): EVMTransaction {
    const busObj = new EVMTransaction(
      chain,
      EVMTransactionHash(tx.tx_hash),
      UnixTimestamp(Math.floor(Date.parse(tx.block_signed_at) / 1000)),
      tx.block_height,
      tx.to_address != null
        ? EVMAccountAddress(tx.to_address.toLowerCase())
        : null,
      tx.from_address != null
        ? EVMAccountAddress(tx.from_address.toLowerCase())
        : null,
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
    chain: EChain,
    endpoint: string,
    accountAddress: EVMAccountAddress,
    primer?: string,
    pageNumber?: number,
  ): ResultAsync<IRequestConfig, never> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).map(([config, context]) => {
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
        chain.toString(),
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

      context.privateEvents.onApiAccessed.next(EExternalApi.Covalent);
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
