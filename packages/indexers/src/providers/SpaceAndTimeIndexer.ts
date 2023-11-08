import { EChain, EIndexerMethod } from "@objects/enum/index.js";
import {
  ILogUtils,
  ILogUtilsType,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AccountIndexingError,
  AjaxError,
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
  getEtherscanBaseURLForChain,
  EVMNFT,
  MethodSupportError,
  getChainInfoByChain,
  EComponentStatus,
  IndexerSupportSummary,
  EExternalApi,
  EDataProvider,
  ISO8601DateString,
  BlockNumber,
} from "@snickerdoodlelabs/objects";
import { application } from "express";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoinP } from "url-join-ts";

import {
  IEVMIndexer,
  IIndexerConfigProvider,
  IIndexerConfigProviderType,
  IIndexerContextProvider,
  IIndexerContextProviderType,
} from "@indexers/interfaces/index.js";
import { MasterIndexer } from "@indexers/MasterIndexer.js";

@injectable()
export class SpaceAndTimeIndexer implements IEVMIndexer {
  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected indexerSupport = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, false, false),
    ],
    [
      EChain.Polygon,
      new IndexerSupportSummary(EChain.Polygon, false, false, false),
    ],
    [
      EChain.Avalanche,
      new IndexerSupportSummary(EChain.Avalanche, false, false, false),
    ],
    [
      EChain.Binance,
      new IndexerSupportSummary(EChain.Binance, false, false, false),
    ],
    [EChain.Sui, new IndexerSupportSummary(EChain.Sui, false, false, false)],
    [
      EChain.Mumbai,
      new IndexerSupportSummary(EChain.Mumbai, false, false, false),
    ],
  ]);

  protected SchemaTitles = new Map<EChain, SxTSchemaSupport>([
    [
      EChain.EthereumMainnet,
      new SxTSchemaSupport(EChain.EthereumMainnet, "", "", ""),
    ],
    [EChain.Polygon, new SxTSchemaSupport(EChain.Polygon, "", "", "")],
    [EChain.Avalanche, new SxTSchemaSupport(EChain.Avalanche, "", "", "")],
    [EChain.Binance, new SxTSchemaSupport(EChain.Binance, "", "", "")],
    [EChain.Sui, new SxTSchemaSupport(EChain.Sui, "", "", "")],
    [EChain.Mumbai, new SxTSchemaSupport(EChain.Mumbai, "", "", "")],
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
      this.indexerSupport.forEach(
        (value: IndexerSupportSummary, chain: EChain) => {
          const chainInfo = getChainInfoByChain(chain);
          if (
            config.apiKeys.spaceAndTimeKey == "" ||
            config.apiKeys.spaceAndTimeKey == null
          ) {
            this.health.set(chain, EComponentStatus.NoKeyProvided);
          } else {
            this.health.set(chain, EComponentStatus.Available);
          }
        },
      );
    });
  }

  private retrieveSchemaName(): string {
    return "ETHEREUM";
  }

  private retrieveTableName(): string {
    return "BLOCKS";
  }

  public name(): string {
    return EDataProvider.SpaceAndTime;
  }

  public getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    if ((chain = EChain.Sui)) {
      return this.getSuiBalance(chain, accountAddress);
    }

    return this.getEVMBalances(chain, accountAddress);
  }

  private getEVMBalances(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {}

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    if ((chain = EChain.Sui)) {
      return this.getSuiNFTs(chain, accountAddress);
    }

    return this.getEVMNFTs(chain, accountAddress);
  }

  public getEVMTransactions(
    chain: EChain,
    accountAddress: EVMAccountAddress,
    startTime: Date,
    endTime?: Date | undefined,
  ): ResultAsync<
    EVMTransaction[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this._getApiKey(chain),
    ])
      .andThen(([context, apiKey]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        const sqlText = `{"sqlText":"SELECT *
        FROM ${this.SchemaTitles.get(chain)?.transactions}
        WHERE FROM_ADDRESS = "${accountAddress}" 
        OR TO_ADDRESS = "${accountAddress}""}`;

        console.log("sqlText: " + sqlText);
        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<ISxTTransaction[]>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
      })
      .map((response) => {
        console.log("response: " + response);
        return response.map((transaction) => {
          return new EVMTransaction(
            getChainInfoByChain(chain).chainId,
            transaction.TRANSACTION_HASH,
            transaction.TIME_STAMP,
            transaction.BLOCK_NUMBER,
            transaction.TO_ADDRESS,
            transaction.FROM_ADDRESS,
            transaction.VALUE_,
            BigNumberString(transaction.GAS),
            null,
            null,
            null,
            null,
            null,
            this.timeUtils.getUnixNow(),
          );
        });
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
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this._getApiKey(chain),
      getEtherscanBaseURLForChain(chain),
    ])
      .andThen(([config, context, apiKey, baseURL]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        const sqlText = `{"sqlText":"SELECT * FROM ${schema}.${table} LIMIT 1"}`;

        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<unknown>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
      })
      .map((response) => {
        console.log("response: " + response);
        const nativeBalance = new TokenBalance(
          EChainTechnology.EVM,
          TickerSymbol(getChainInfoByChain(chain).nativeCurrency.symbol),
          getChainInfoByChain(chain).chainId,
          MasterIndexer.nativeAddress,
          accountAddress,
          BigNumberString(response.result),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return nativeBalance;
      });
  }

  protected _getApiKey(
    chain: EChain,
  ): ResultAsync<string, AccountIndexingError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const chainInfo = getChainInfoByChain(chain);
      const key = chainInfo.name;
      if (
        config.apiKeys.spaceAndTimeKey == "" ||
        config.apiKeys.spaceAndTimeKey == undefined
      ) {
        this.logUtils.error("Error inside _getApiKey");
        return errAsync(
          new AccountIndexingError("no space and time api key available"),
        );
      }
      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(config.apiKeys.spaceAndTimeKey!);
    });
  }
}

interface ISxTTransaction {
  TRANSACTION_HASH: EVMTransactionHash;
  BLOCK_NUMBER: BlockNumber;
  FROM_ADDRESS: EVMAccountAddress;
  TO_ADDRESS: EVMAccountAddress;
  VALUE_: BigNumberString;
  GAS: string;
  TRANSACTION_FEE: BigNumberString;
  RECEIPT_CUMULATIVE_GAS_USED: number;
  TIME_STAMP: UnixTimestamp;
  RECEIPT_STATUS: number;
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

interface ISxTNativeBalanceResponse {
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

export class SxTSchemaSupport {
  public constructor(
    public chain: EChain,
    public balances: string,
    public nfts: string,
    public transactions: string,
  ) {}

  // Static methods are safer on business objects, because they survive serialization.
  public static isMethodSupported(
    supportSummary: SxTSchemaSupport,
    method: EIndexerMethod,
  ): boolean {
    if (method == EIndexerMethod.Balances) {
      return supportSummary.balances;
    } else if (method == EIndexerMethod.Transactions) {
      return supportSummary.transactions;
    } else if (method == EIndexerMethod.NFTs) {
      return supportSummary.nfts;
    }
    return false;
  }
}
