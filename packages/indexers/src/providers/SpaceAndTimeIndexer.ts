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
  EChain,
  EIndexerMethod,
  AccessToken,
  RefreshToken,
  AuthenticatedStorageSettings,
  EVMPrivateKey,
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
  protected _lastRestore = 0;
  private _unlockPromise: Promise<EVMPrivateKey>;
  private _settingsPromise: Promise<AuthenticatedStorageSettings>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;
  private _resolveSettings:
    | ((credentials: AuthenticatedStorageSettings) => void)
    | null = null;
  protected lastAuthTokenTimestamp: UnixTimestamp | null = null;
  protected currentAccessToken: AccessToken | null = null;
  protected refreshSeconds = 60 * 60 * 6; // 6 hours?

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

  protected queries = new Map<EChain, SxTQuery>([
    [EChain.EthereumMainnet, new SxTQuery(EChain.EthereumMainnet, "", "", "")],
    [EChain.Polygon, new SxTQuery(EChain.Polygon, "", "", "")],
    [EChain.Avalanche, new SxTQuery(EChain.Avalanche, "", "", "")],
    [EChain.Binance, new SxTQuery(EChain.Binance, "", "", "")],
    [EChain.Sui, new SxTQuery(EChain.Sui, "", "", "")],
    [EChain.Mumbai, new SxTQuery(EChain.Mumbai, "", "", "")],
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
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
    this._settingsPromise = new Promise<AuthenticatedStorageSettings>(
      (resolve) => {
        this._resolveSettings = resolve;
      },
    );
  }

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

  protected getAccessToken(): ResultAsync<AccessToken, AccountIndexingError> {
    return this.waitForSettings().andThen((settings) => {
      // Check if the lastAuthTokenTimestamp is null, we need to get a new token immediately
      const now = this.timeUtils.getUnixNow();
      // console.log("settings.refreshToken: " + settings.refreshToken);
      const refreshToken = settings["refresh_token"];
      if (
        this.lastAuthTokenTimestamp == null ||
        this.currentAccessToken == null ||
        now - this.lastAuthTokenTimestamp > this.refreshSeconds
      ) {
        // Need to get a new access token
        return this.getNewAuthToken(refreshToken).map((accessToken) => {
          this.lastAuthTokenTimestamp = now;
          this.currentAccessToken = accessToken;
          return this.currentAccessToken;
        });
      }
      return okAsync(this.currentAccessToken);
    });
  }

  protected getNewAuthToken(
    refreshToken: RefreshToken,
  ): ResultAsync<AccessToken, AccountIndexingError> {
    // Do the work of trading the refresh token for a new access token
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
    ]).andThen(([config, context]) => {
      const requestParams = {
        userId: userID,
        signature: signature,
        authCode: auth,
        key: apiKey,
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
      return this.ajaxUtils
        .post<{ access_token: AccessToken }>(
          new URL("https://api.spaceandtime.app/v1/auth/token/"),
          requestParams,
        )
        .map((token) => {
          return token.access_token;
        })
        .mapErr((e) => {
          return new AccountIndexingError("Refresh Token Url failed", e);
        });
    });
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

  private getSuiBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  private getEVMBalances(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError> {
    return okAsync([]);
  }

  public getTokensForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    if ((chain = EChain.Sui)) {
      return okAsync([]);
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
        FROM ${this.queries.get(chain)?.transactions}
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
        const sqlText = `{"sqlText":"SELECT * FROM ${
          this.queries.get(chain)?.transactions
        } LIMIT 1"}`;

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
          BigNumberString("1"),
          getChainInfoByChain(chain).nativeCurrency.decimals,
        );
        return nativeBalance;
      });
  }

  protected waitForSettings(): ResultAsync<
    AuthenticatedStorageSettings,
    never
  > {
    return ResultAsync.fromSafePromise(this._settingsPromise);
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

  private getEVMNFTs(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<
    EVMNFT[],
    AccountIndexingError | AjaxError | MethodSupportError
  > {
    return okAsync([]);
  }

  private retrieveSchemaName(): string {
    return "ETHEREUM";
  }

  private retrieveTableName(): string {
    return "BLOCKS";
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

export class SxTQuery {
  public constructor(
    public chain: EChain,
    public balances: string,
    public nfts: string,
    public transactions: string,
  ) {}
}
