import {
  ILogUtils,
  ILogUtilsType,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AccountIndexingError,
  AjaxError,
  EVMAccountAddress,
  EVMTransaction,
  TokenBalance,
  TickerSymbol,
  BigNumberString,
  EChainTechnology,
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
  BlockNumber,
  EChain,
  AccessToken,
  RefreshToken,
  AuthenticatedStorageSettings,
  EVMPrivateKey,
  AuthCode,
  Signature,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
  protected refreshSeconds = 60 * 25; // 25 minutes?

  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, true, true, true),
    ],
    // [
    //   EChain.Polygon,
    //   new IndexerSupportSummary(EChain.Polygon, false, false, false),
    // ],
    // [
    //   EChain.Avalanche,
    //   new IndexerSupportSummary(EChain.Avalanche, false, false, false),
    // ],
    // [
    //   EChain.Binance,
    //   new IndexerSupportSummary(EChain.Binance, false, false, false),
    // ],
    // [EChain.Sui, new IndexerSupportSummary(EChain.Sui, false, false, false)],
    // [
    //   EChain.Mumbai,
    //   new IndexerSupportSummary(EChain.Mumbai, false, false, false),
    // ],
  ]);

  protected queries = new Map<EChain, SxTQuery>([
    [EChain.EthereumMainnet, new SxTQuery(EChain.EthereumMainnet, "", "", "")],
    // [EChain.Polygon, new SxTQuery(EChain.Polygon, "", "", "")],
    // [EChain.Avalanche, new SxTQuery(EChain.Avalanche, "", "", "")],
    // [EChain.Binance, new SxTQuery(EChain.Binance, "", "", "")],
    // [EChain.Sui, new SxTQuery(EChain.Sui, "", "", "")],
    // [EChain.Mumbai, new SxTQuery(EChain.Mumbai, "", "", "")],
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
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
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
      if (
        config.apiKeys.spaceAndTimeCredentials.PublicKey == "" ||
        config.apiKeys.spaceAndTimeCredentials.PublicKey == null
      ) {
        this.health.set(EChain.EthereumMainnet, EComponentStatus.NoKeyProvided);
      } else {
        this.health = this.health.set(
          EChain.EthereumMainnet,
          EComponentStatus.Available,
        );
      }
    });
  }

  /* Space and Time Logic */
  public authenticate(
    privateKey: string,
    publicKey: string,
    authCode: string,
    userID: string,
  ): Signature {
    const privateKeyUint = this.cryptoUtils.base64ToUint8(
      privateKey,
      publicKey,
    );
    const signature = this.cryptoUtils.generateSignature(
      authCode,
      privateKeyUint,
    );
    return Signature(signature);
  }

  protected getAccessToken(): ResultAsync<AccessToken, AccountIndexingError> {
    // Check if the lastAuthTokenTimestamp is null, we need to get a new token immediately
    const now = this.timeUtils.getUnixNow();

    // console.log("this.currentAccessToken: " + this.currentAccessToken);
    if (
      this.lastAuthTokenTimestamp == null ||
      this.currentAccessToken == null ||
      now - this.lastAuthTokenTimestamp >= this.refreshSeconds
    ) {
      console.log("now: ", now);
      console.log(
        "this.lastAuthTokenTimestamp: ",
        this.lastAuthTokenTimestamp!,
      );
      console.log(
        "now - this.lastAuthTokenTimestamp: ",
        now - this.lastAuthTokenTimestamp!,
      );
      console.log("this.refreshSeconds: ", this.refreshSeconds);
      // Need to get a new access token
      return this.getNewAuthToken().map((accessToken) => {
        this.lastAuthTokenTimestamp = now;
        this.currentAccessToken = accessToken;
        return this.currentAccessToken;
      });
    }
    return okAsync(this.currentAccessToken);
  }

  protected getNewAuthCode(): ResultAsync<AuthCode, AccountIndexingError> {
    // Do the work of trading the refresh token for a new access token
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      const requestParams = {
        userId: config.apiKeys.spaceAndTimeCredentials.UserId
          ? config.apiKeys.spaceAndTimeCredentials.UserId
          : "",
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
      return this.ajaxUtils
        .post<{ authCode: AuthCode }>(
          new URL("https://api.spaceandtime.app/v1/auth/code/"),
          requestParams,
          {
            headers: {
              accept: `application/json;`,
              "Content-Type": `application/json;`,
            },
          },
        )
        .map((token) => {
          console.log("token.authCode: " + token.authCode);
          return token.authCode;
        })
        .mapErr((e) => {
          return new AccountIndexingError(
            "Space and Time Auth Code Url failed",
            e,
          );
        });
    });
  }

  protected getNewAuthToken(): ResultAsync<AccessToken, AccountIndexingError> {
    // Do the work of trading the refresh token for a new access token
    console.log("get new auth token: ");
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      // this.getUserID(),
      this.getNewAuthCode(),
    ]).andThen(([config, context, auth_code]) => {
      const signature = this.authenticate(
        config.apiKeys.spaceAndTimeCredentials.PrivateKey
          ? config.apiKeys.spaceAndTimeCredentials.PrivateKey
          : "",
        config.apiKeys.spaceAndTimeCredentials.PublicKey
          ? config.apiKeys.spaceAndTimeCredentials.PublicKey
          : "",
        auth_code,
        config.apiKeys.spaceAndTimeCredentials.UserId
          ? config.apiKeys.spaceAndTimeCredentials.UserId
          : "",
      );

      let publicKey = config.apiKeys.spaceAndTimeCredentials.PublicKey;
      if (publicKey == null) {
        publicKey = "";
      }

      let userID = config.apiKeys.spaceAndTimeCredentials.UserId;
      if (userID == null) {
        userID = "";
      }

      const payload = {
        userId: userID, // userID: snickerdoodledev
        authCode: auth_code,
        signature: signature,
        key: publicKey,
        scheme: "ed25519",
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
      return this.ajaxUtils
        .post<{ accessToken: AccessToken; refreshToken: RefreshToken }>(
          new URL("https://api.spaceandtime.app/v1/auth/token/"),
          payload,
        )
        .map((token) => {
          console.log("Success: " + JSON.stringify(token));
          return token.accessToken;
        })
        .mapErr((e) => {
          return new AccountIndexingError("Access Token Url failed", e);
        });
    });
  }

  public name(): EDataProvider {
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
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAccessToken(),
    ]).andThen(([context, accessToken]) => {
      const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
      const sqlText = `SELECT * 
        FROM ${this.queries.get(chain)?.balances} 
        WHERE WALLET_ADDRESS = "${accountAddress}"
        ORDER BY BLOCK_NUMBER DESC
        "}`;

      console.log("getEVMBalances sqlText: " + sqlText);
      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
      return this.ajaxUtils
        .post<ISxTBalance[]>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })
        .map((response) => {
          console.log("getEVMBalances response: " + response);
          return response.map((balance) => {
            console.log("balance: " + JSON.stringify(balance));
            return new TokenBalance(
              EChainTechnology.EVM,
              TickerSymbol("ETH"),
              EChain.EthereumMainnet,
              MasterIndexer.nativeAddress,
              accountAddress,
              balance.BALANCE,
              18,
            );
          });
        })
        .mapErr((error) => {
          console.log("getEVMBalances error: " + error);
          return error;
        });
    });
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
    console.log("Space and Time EVM Transactions");
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAccessToken(),
    ])
      .andThen(([context, accessToken]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        // const sqlTextFrom = {
        //   sqlText: `SELECT TRANSACTION_HASH, BLOCK_NUMBER, TO_ADDRESS, FROM_ADDRESS, VALUE_, GAS, TRANSACTION_FEE, TIME_STAMP FROM ETHEREUM.TRANSACTIONS  WHERE lower(FROM_ADDRESS) = lower(\"${accountAddress}\")`,
        // };

        const sqlTextFrom = {
          resources: ["SNICKERDOODLE.User_Transaction_History"],
          sqlText: `SELECT TRANSACTION_HASH, BLOCK_NUMBER, TO_ADDRESS, FROM_ADDRESS, VALUE_, GAS, TRANSACTION_FEE, TIME_STAMP FROM SNICKERDOODLE.User_Transaction_History WHERE lower(FROM_ADDRESS) = lower(\"${accountAddress}\")`,
          biscuits: [
            "EpABCiYKDnN4dDpjYXBhYmlsaXR5CgEqGAMiDwoNCIAIEgMYgQgSAxiBCBIkCAASIIogmGsWsrgfbJvdMMKdTcZA5rXaqsguEUIBl1_m718TGkBUoA3ppUV78Hiscs2jY6VULsBYGwxZdQRV5mhrIghl5uSGLpwGQbnQPLWe79LZ1uKotiZoOrdM-NrHuQO63XQOIiIKIH7IR-53EtE5ruyIAs2gjp_3TAMMjkqYzR0FjeQP5JNH",
          ],
        };

        console.log(
          "getEVMTransactions sqlText: " + JSON.stringify(sqlTextFrom),
        );

        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<ISxTTransaction[]>(
          new URL(url),
          sqlTextFrom,
          {
            headers: {
              Accept: `application/json;`,
              authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );
      })
      .map((response) => {
        console.log("getEVMTransactions response: " + JSON.stringify(response));
        return response.map((transaction) => {
          console.log("transaction: " + JSON.stringify(transaction));
          console.log("transaction.TIME_STAMP: " + transaction.TIME_STAMP);
          console.log(
            "transaction.TIME_STAMP: " +
              Number.parseInt(transaction.TIME_STAMP),
          );
          console.log(
            "UnixTimestamp transaction.TIME_STAMP: " +
              UnixTimestamp(Number.parseInt(transaction.TIME_STAMP)),
          );

          return new EVMTransaction(
            getChainInfoByChain(chain).chainId,
            transaction.TRANSACTION_HASH,
            UnixTimestamp(13001519),
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
      })
      .mapErr((error) => {
        console.log("getEVMTransactions error " + error);
        return error;
      });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.supportedChains;
  }

  private getNativeBalance(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance, AccountIndexingError | AjaxError> {
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.getAccessToken(),
      getEtherscanBaseURLForChain(chain),
    ])
      .andThen(([config, context, accessToken, baseURL]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        const sqlText = `{"sqlText":"SELECT * FROM ${
          this.queries.get(chain)?.transactions
        } LIMIT 1"}`;

        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<unknown>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${accessToken}`,
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

interface ISxTBalance {
  TIME_STAMP: string;
  BLOCK_NUMBER: BlockNumber;
  WALLET_ADDRESS: EVMAccountAddress;
  BALANCE: BigNumberString;
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
  TIME_STAMP: string;
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
