import * as ed from "@noble/ed25519";
import {
  ILogUtils,
  ILogUtilsType,
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AccountIndexingError,
  AjaxError,
  EVMAccountAddress,
  EVMTransaction,
  TokenBalance,
  TickerSymbol,
  EChainTechnology,
  ITokenPriceRepositoryType,
  ITokenPriceRepository,
  EVMTransactionHash,
  UnixTimestamp,
  getEtherscanBaseURLForChain,
  EVMNFT,
  MethodSupportError,
  getChainInfoByChain,
  getChainInfoByChainId,
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
  Signature,
  ED25519Signature,
  EVMContractAddress,
  BigNumberString,
  TokenUri,
  AuthCode,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import nacl from "tweetnacl";

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
  private _resolveUnlock: ((spaceAndTimeKey: EVMPrivateKey) => void) | null =
    null;
  private _resolveSettings:
    | ((credentials: AuthenticatedStorageSettings) => void)
    | null = null;
  protected lastAuthTokenTimestamp: UnixTimestamp | null = null;
  protected currentAccessToken: AccessToken | null = null;
  protected refreshSeconds = 60 * 25; // 25 minutes?
  protected privateKey: string | null = null;
  protected publicKey: string | null = null;
  protected userId: string | null = null;

  protected health: Map<EChain, EComponentStatus> = new Map<
    EChain,
    EComponentStatus
  >();

  protected supportedChains = new Map<EChain, IndexerSupportSummary>([
    [
      EChain.EthereumMainnet,
      new IndexerSupportSummary(EChain.EthereumMainnet, false, true, false),
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
    [
      EChain.EthereumMainnet,
      new SxTQuery(EChain.EthereumMainnet, "", "", "ETHEREUM.TRANSACTIONS"),
    ],
    [
      EChain.Polygon,
      new SxTQuery(EChain.Polygon, "", "", "POLYGON.TRANSACTIONS"),
    ],
    [
      EChain.Avalanche,
      new SxTQuery(EChain.Avalanche, "", "", "AVALANCHE_C.TRANSACTIONS"),
    ],
    [EChain.Binance, new SxTQuery(EChain.Binance, "", "", "BNB.TRANSACTIONS")],

    // Non-EVM Data
    [EChain.Sui, new SxTQuery(EChain.Sui, "", "", "SUI.TRANSACTIONS")],
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
    return this.configProvider.getConfig().andThen((config) => {
      if (
        config.apiKeys.spaceAndTimeCredentials.privateKey == "" ||
        config.apiKeys.spaceAndTimeCredentials.privateKey == null
      ) {
        this.health.set(EChain.EthereumMainnet, EComponentStatus.NoKeyProvided);
        return okAsync(undefined);
      }

      this.privateKey = config.apiKeys.spaceAndTimeCredentials.privateKey
        ? config.apiKeys.spaceAndTimeCredentials.privateKey
        : "";
      this.userId = config.apiKeys.spaceAndTimeCredentials.userId
        ? config.apiKeys.spaceAndTimeCredentials.userId
        : "";
      this.health = this.health.set(
        EChain.EthereumMainnet,
        EComponentStatus.Available,
      );

      // derive public key from private key
      return this.cryptoUtils
        .getEd25519PublicKeyFromPrivateKey(this.privateKey)
        .map((publicKey) => {
          this.publicKey = publicKey;
        });
    });
  }

  /* Space and Time Logic */
  private authenticate(
    privateKey: string,
    publicKey: string,
    authCode: string,
    userId: string,
  ): ED25519Signature {
    const privateKeyUint = this.base64ToUint8(privateKey, publicKey);
    return this.signWithED25519(authCode, privateKeyUint);
  }

  protected getAccessToken(): ResultAsync<AccessToken, AccountIndexingError> {
    // Check if the lastAuthTokenTimestamp is null, we need to get a new token immediately
    const now = this.timeUtils.getUnixNow();
    if (
      this.lastAuthTokenTimestamp == null ||
      this.currentAccessToken == null ||
      now - this.lastAuthTokenTimestamp >= this.refreshSeconds
    ) {
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
        userId: this.userId,
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
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.getNewAuthCode(),
    ]).andThen(([config, context, auth_code]) => {
      if (
        this.privateKey == null ||
        this.publicKey == null ||
        this.userId == null
      ) {
        return errAsync(
          new AccountIndexingError(
            "Error: Space and Time Private Key or User Id was not properly provided.",
          ),
        );
      }
      const signature = this.authenticate(
        this.privateKey,
        this.publicKey,
        auth_code,
        this.userId,
      );

      const payload = {
        userId: this.userId,
        authCode: auth_code,
        signature: signature,
        key: this.publicKey,
        scheme: "ed25519",
      };

      context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
      return this.ajaxUtils
        .post<{ accessToken: AccessToken; refreshToken: RefreshToken }>(
          new URL("https://api.spaceandtime.app/v1/auth/token/"),
          payload,
        )
        .map((token) => {
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
      const sqlText = {
        resources: [this.queries.get(chain)?.balances],
        sqlText: `SELECT * FROM ${
          this.queries.get(chain)?.balances
        } WHERE lower(FROM_ADDRESS) = lower(\"${accountAddress}\") OR lower(TO_ADDRESS) = lower(\"${accountAddress}\")`,
      };

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
          return response.map((balance) => {
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
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAccessToken(),
    ])
      .andThen(([context, accessToken]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        const sqlText = {
          resources: ["SNICKERDOODLE.User_Transaction_History"],
          sqlText: `SELECT TRANSACTION_HASH, BLOCK_NUMBER, TO_ADDRESS, FROM_ADDRESS, VALUE_, GAS, TRANSACTION_FEE, TIME_STAMP FROM SNICKERDOODLE.User_Transaction_History WHERE lower(FROM_ADDRESS) = lower(\"${accountAddress}\") OR lower(TO_ADDRESS) = lower(\"${accountAddress}\")`,
          biscuits: [
            // TODO: remove the hardcoded biscuit
            "EpABCiYKDnN4dDpjYXBhYmlsaXR5CgEqGAMiDwoNCIAIEgMYgQgSAxiBCBIkCAASIIogmGsWsrgfbJvdMMKdTcZA5rXaqsguEUIBl1_m718TGkBUoA3ppUV78Hiscs2jY6VULsBYGwxZdQRV5mhrIghl5uSGLpwGQbnQPLWe79LZ1uKotiZoOrdM-NrHuQO63XQOIiIKIH7IR-53EtE5ruyIAs2gjp_3TAMMjkqYzR0FjeQP5JNH",
          ],
        };

        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<ISxTTransaction[]>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      })
      .map((response) => {
        return response.map((transaction) => {
          return new EVMTransaction(
            getChainInfoByChain(chain).chainId,
            transaction.TRANSACTION_HASH,
            UnixTimestamp(
              Math.floor(new Date(transaction.TIME_STAMP).getTime() / 1000.0),
            ),
            transaction.BLOCK_NUMBER,
            transaction.TO_ADDRESS,
            transaction.FROM_ADDRESS,
            transaction.VALUE_,
            BigNumberString(transaction.TRANSACTION_FEE.toString()),
            null,
            null,
            "Transfer Funds",
            null,
            null,
            this.timeUtils.getUnixNow(),
          );
        });
      })
      .mapErr((error) => {
        return error;
      });
  }

  public healthStatus(): Map<EChain, EComponentStatus> {
    return this.health;
  }

  public getSupportedChains(): Map<EChain, IndexerSupportSummary> {
    return this.supportedChains;
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
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getAccessToken(),
    ])
      .andThen(([context, accessToken]) => {
        const url = new URL("https://api.spaceandtime.app/v1/sql/dql");
        const sqlText = {
          resources: [this.queries.get(chain)?.nfts],
          sqlText: `SELECT * FROM ${
            this.queries.get(chain)?.nfts
          } WHERE lower(OWNER) = lower(\"${accountAddress}\")`,
        };

        context.privateEvents.onApiAccessed.next(EExternalApi.SpaceAndTime);
        return this.ajaxUtils.post<ISxTNft[]>(new URL(url), sqlText, {
          headers: {
            Accept: `application/json;`,
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      })
      .map((response) => {
        return response.map((nft) => {
          return new EVMNFT(
            EVMContractAddress(nft.token),
            BigNumberString(nft.tokenId),
            nft.contractType,
            EVMAccountAddress(nft.owner),
            TokenUri(nft.tokenUri),
            { raw: ObjectUtils.serialize(nft) },
            BigNumberString(nft.amount),
            nft.name,
            chain,
            BlockNumber(nft.blocknumber),
            UnixTimestamp(nft.lastOwnerTimeStamp),
          );
        });
      })
      .mapErr((error) => {
        return error;
      });
  }

  /* CODE BLOCK FROM Space and Time SDK.js file */
  private base64ToUint8(
    base64PrivateKey: string,
    base64PublicKey: string,
  ): Uint8Array {
    const privateKeyBuffer = Buffer.from(base64PrivateKey, "base64");
    const publicKeyBuffer = Buffer.from(base64PublicKey, "base64");

    // eslint-disable-next-line prefer-const
    let privateKeyUint8 = new Uint8Array(
      privateKeyBuffer.buffer,
      privateKeyBuffer.byteOffset,
      privateKeyBuffer.byteLength,
    );
    // eslint-disable-next-line prefer-const
    let publicKeyUint8 = new Uint8Array(
      publicKeyBuffer.buffer,
      publicKeyBuffer.byteOffset,
      publicKeyBuffer.byteLength,
    );

    if (privateKeyUint8.length === publicKeyUint8.length) {
      // eslint-disable-next-line prefer-const
      let temporaryPrivateKey: number[] = [];

      for (let idx = 0; idx < privateKeyUint8.length; idx++) {
        temporaryPrivateKey[idx] = privateKeyUint8[idx];
      }

      for (let idx = 0; idx < publicKeyUint8.length; idx++) {
        temporaryPrivateKey[privateKeyUint8.length + idx] = publicKeyUint8[idx];
      }

      privateKeyUint8 = new Uint8Array(temporaryPrivateKey);
    }

    const PrivateKeyUint8Array = new Uint8Array(privateKeyUint8.length);
    for (let i = 0; i < privateKeyUint8.length; i++) {
      PrivateKeyUint8Array[i] = privateKeyUint8[i];
    }

    return PrivateKeyUint8Array;
  }

  private signWithED25519(
    message: string,
    privateKeyUint: Uint8Array,
  ): ED25519Signature {
    const authCode = new TextEncoder().encode(message);
    // The NACL Binding for signature generation uses "only" ED25519
    const signatureArray = nacl.sign(authCode, privateKeyUint);
    let signature = Buffer.from(
      signatureArray.buffer,
      signatureArray.byteOffset,
      signatureArray.byteLength,
    ).toString("hex");
    signature = signature.slice(0, 128);
    return ED25519Signature(signature);
  }
}

interface ISxTBalance {
  TIME_STAMP: string;
  BLOCK_NUMBER: BlockNumber;
  WALLET_ADDRESS: EVMAccountAddress;
  BALANCE: BigNumberString;
}

interface ISxTNft {
  token: string;
  tokenId: string;
  contractType: string;
  owner: string;
  tokenUri: string;
  metadata: string;
  amount: string;
  name: string;
  blocknumber: number;
  lastOwnerTimeStamp: number;
}

interface ISxTTransaction {
  TRANSACTION_HASH: EVMTransactionHash;
  BLOCK_NUMBER: BlockNumber;
  FROM_ADDRESS: EVMAccountAddress;
  TO_ADDRESS: EVMAccountAddress;
  VALUE_: BigNumberString;
  GAS: number;
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
