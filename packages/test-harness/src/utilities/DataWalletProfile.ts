import { readFile } from "node:fs/promises";
import path from "path";

import {
  ITimeUtils,
  ITimeUtilsType,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  BigNumberString,
  ChainId,
  DirectReward,
  EarnedReward,
  EChain,
  ECredentialType,
  ERewardType,
  EVMAccountAddress,
  EVMPrivateKey,
  EVMTransaction,
  IConfigOverrides,
  DataWalletBackup,
  IpfsCID,
  LazyReward,
  MetatransactionSignatureRequest,
  PageInvitation,
  RewardFunctionParam,
  SDQLQueryRequest,
  Signature,
  SiteVisit,
  UnixTimestamp,
  UnsupportedLanguageError,
  URLString,
  Web2Credential,
  Web2Reward,
  EVMContractAddress,
  TokenSecret,
  UnauthorizedError,
  AjaxError,
  BlockchainProviderError,
  PersistenceError,
  UninitializedError,
  ISO8601DateString,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { Subscription } from "rxjs";

import { Environment, TestHarnessMocks } from "@test-harness/mocks/index.js";
import { ApproveQuery } from "@test-harness/prompts/index.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";

@injectable()
export class DataWalletProfile {
  readonly core: SnickerdoodleCore;
  private defaultPathInfo = {
    name: "empty",
    path: "data/profiles/dataWallet/empty",
  };
  private _profilePathInfo = this.defaultPathInfo;

  private _destroyed = false;
  protected timeUtils: ITimeUtils;
  private coreSubscriptions = new Array<Subscription>();
  public acceptedInvitations = new Array<PageInvitation>();

  public constructor(readonly mocks: TestHarnessMocks) {
    this.core = this.createCore(mocks);
    this.timeUtils = new TimeUtils();
  }

  public get name(): string {
    return this._profilePathInfo.name;
  }

  public destroy(): void {
    this.destroyCore();
    this._destroyed = true;
  }

  public initCore(
    env: Environment,
  ): ResultAsync<
    void,
    PersistenceError | UninitializedError | BlockchainProviderError | AjaxError
  > {
    if (this.coreSubscriptions.length > 0) {
      this.destroyCore();
    }
    return this.core.initialize().map(() => {
      this.core.getEvents().map(async (events) => {
        this.coreSubscriptions.push(
          events.onAccountAdded.subscribe((addedAccount) => {
            console.log(`Added account`);
            console.log(addedAccount);
          }),
        );

        this.coreSubscriptions.push(
          events.onInitialized.subscribe((dataWalletAddress) => {
            console.log(`Initialized with address ${dataWalletAddress}`);
          }),
        );

        this.coreSubscriptions.push(
          events.onQueryPosted.subscribe(
            async (queryRequest: SDQLQueryRequest) => {
              console.log(
                `Recieved query for consentContract ${queryRequest.consentContractAddress} with id ${queryRequest.query.cid}`,
              );

              try {
                await new ApproveQuery(env, queryRequest).start();
              } catch (e) {
                console.error(e);
              }
            },
          ),
        );

        this.coreSubscriptions.push(
          events.onMetatransactionSignatureRequested.subscribe(
            async (request) => {
              // This method needs to happen in nicer form in all form factors
              console.log(
                `Metadata Transaction Requested!`,
                `Request account address: ${request.accountAddress}`,
              );

              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              await env
                .dataWalletProfile!.signMetatransactionRequest(request)
                .mapErr((e) => {
                  console.error(`Error signing forwarding request!`, e);
                  process.exit(1);
                });
            },
          ),
        );
      });
    });
  }

  protected destroyCore(): void {
    this.coreSubscriptions.map((subscription) => subscription.unsubscribe());
    this.coreSubscriptions = new Array<Subscription>();
  }

  protected createCore(mocks: TestHarnessMocks): SnickerdoodleCore {
    const discordConfig = {
      clientId: "1089994449830027344",
      clientSecret: TokenSecret("uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ"),
      oauthBaseUrl: URLString("https://discord.com/oauth2/authorize"),
      oauthRedirectUrl: URLString("https://localhost:9005/settings"),
      accessTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
      refreshTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
      dataAPIUrl: URLString("https://discord.com/api"),
      iconBaseUrl: URLString("https://cdn.discordapp.com/icons"),
      pollInterval: 2 * 1000, // days * hours * seconds * milliseconds
    };

    // Create the SnickerdoodleCore. All of these indexer keys should be just for dev purposes
    const core = new SnickerdoodleCore(
      {
        defaultInsightPlatformBaseUrl: "http://localhost:3006",
        dnsServerAddress: "http://localhost:3006/dns",
        devChainProviderURL: "http://127.0.0.1:8545",
        discordOverrides: discordConfig,
        heartbeatIntervalMS: 5000, // Set the heartbeat to 5 seconds
        alchemyApiKeys: {
          Arbitrum: "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF",
          Astar: "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7",
          Mumbai: "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf",
          Optimism: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
          Polygon: "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX",
          Solana: "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
          SolanaTestnet: "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",
        },
        etherscanApiKeys: {
          Ethereum: "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7",
          Polygon: "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G",
          Avalanche: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
          Binance: "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY",
          Moonbeam: "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71",
          Optimism: "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3",
          Arbitrum: "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV",
          Gnosis: "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
          Fuji: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
        },
        spaceAndTimeCredentials: {
          UserId: "snickerdoodledev",
          PublicKey: "C4ci88fgOy8NuK0xonhFJkJr6tKXKK7gKSFMkV1Hekk=",
          PrivateKey: "a35JJjDhLqFuHWqnbxseTHEU99BFAa3CApIFjbWBQ3E=",
        },

        covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
        moralisApiKey:
          "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
        poapApiKey:
          "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
        ankrApiKey:
          "74bbdfc0dea96f85aadde511a4fe8905342c864202f890ece7d0b8d1c60df637",
        bluezApiKey: "aed4aab2cbc573bbf8e7c6b448c916e5",
        raribleApiKey: "c5855db8-08ef-409f-9947-e46c141af1b4",
        blockvisionKey: "2WaEih5fqe8NUavbvaR2PSuVSSp",
        nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
        oklinkApiKey: "700c2f71-a4e2-4a85-b87f-58c8a341d1bf",
      } as IConfigOverrides,
      undefined,
      mocks.fakeDBVolatileStorage,
    );

    return core;
  }

  protected _loadOnError(e: Error, resourcePath: string): Error {
    if (e.message.includes("ENOENT")) {
      console.warn(`Could not load ${resourcePath}. Ignoring`);
      return new Error(`Ignorable IO error}`);
    } else {
      console.error(e.message);
      return e;
    }
  }

  public loadDefaultProfile(): ResultAsync<void, Error> {
    return this.loadFromPath(this.defaultPathInfo);
  }
  // #region profile loading from files
  public loadFromPath(pathInfo: {
    name: string;
    path: string;
  }): ResultAsync<void, Error> {
    console.log(`Loading data wallet accounts from ${pathInfo.path}.`);

    if (!this._destroyed) {
      return errAsync(
        new Error(
          "You must destroy your current wallet before loading a new profile.",
        ),
      );
    }

    // this.reset(); we don't need it because loading a profile is done after destroying a wallet

    this._profilePathInfo = pathInfo;

    const root = this._profilePathInfo.path;

    // this will leak memory as previous core will be populated with data if not unlocked before switching profiles.

    return ResultUtils.combine([
      this._loadAccounts(path.join(root, "accounts.json")),
      // this._loadDemographic(path.join(root, "demographic.json")),
      // this._loadSiteVisits(path.join(root, "siteVisits.json")),
      // this._loadEVMTransactions(path.join(root, "evmTransactions.json")),
      // this._loadEarnedRewards(path.join(root, "earnedRewards.json")),
      // this._loadBackup(path.join(root, "backup.json"))
    ]).andThen((res) => {
      // console.log(`Loaded data wallet accounts from ${this._profilePathInfo.path}.`);
      return okAsync(undefined);
    });
  }

  public loadFromPathAfterUnlocked(): ResultAsync<void, Error> {
    console.log(
      `Unlocked: Loading data wallet profile from ${this._profilePathInfo.path}.`,
    );
    const root = this._profilePathInfo.path;

    // this will leak memory as previous core will be populated with data if not unlocked before switching profiles.

    return ResultUtils.combine([
      // this._loadAccounts(path.join(root, "accounts.json")),
      this._loadDemographic(path.join(root, "demographic.json")),
      this._loadSiteVisits(path.join(root, "siteVisits.json")),
      this._loadEVMTransactions(path.join(root, "evmTransactions.json")),
      this._loadEarnedRewards(path.join(root, "earnedRewards.json")),
      // this._loadBackup(path.join(root, "backup.json"))
    ]).map((res) => {
      console.log(
        `Loaded data wallet profile from ${this._profilePathInfo.path}.`,
      );
    });
  }

  protected _loadAccounts(accountPath: string): ResultAsync<void, Error> {
    return this.readFile(accountPath, "utf-8")
      .map((content) => {
        const accounts = JSON.parse(content);
        const wallets = accounts.map(
          (account) =>
            new TestWallet(
              account.chainId as EChain,
              EVMPrivateKey(account.privateKey),
              this.mocks.cryptoUtils,
            ),
        );
        this.mocks.blockchain.updateAccounts(wallets);
        console.log(`loaded accounts from ${accountPath}`);
      })
      .mapErr((e) => this._loadOnError(e, accountPath));
  }

  protected _loadDemographic(
    demographicPath: string,
  ): ResultAsync<void, Error> {
    return this.readFile(demographicPath, "utf-8")
      .andThen((content) => {
        const demographic = JSON.parse(content);

        return ResultAsync.combine([
          demographic.birthday != undefined
            ? this.core.setBirthday(demographic.birthday)
            : okAsync(undefined),
          demographic.gender != undefined
            ? this.core.setGender(demographic.gender)
            : okAsync(undefined),
          demographic.location != undefined
            ? this.core.setLocation(demographic.location)
            : okAsync(undefined),
          // TODO: add more
        ]);
      })
      .map(() => console.log(`loaded demographic from ${demographicPath}`))
      .mapErr((e) => this._loadOnError(e, demographicPath));
  }

  protected _loadSiteVisits(siteVisitsPath: string): ResultAsync<void, Error> {
    return this.readFile(siteVisitsPath, "utf-8")
      .andThen((content) => {
        const siteVisits = JSON.parse(content).map(
          (sv) =>
            new SiteVisit(
              URLString(sv.url),
              UnixTimestamp(sv.startTime),
              UnixTimestamp(sv.endTime),
            ),
        );

        return this.core.addSiteVisits(siteVisits);
      })
      .map(() => console.log(`loaded site visits from ${siteVisitsPath}`))
      .mapErr((e) => this._loadOnError(e, siteVisitsPath));
  }
  protected _loadEVMTransactions(
    evmTransactionsPath: string,
  ): ResultAsync<void, Error> {
    return this.readFile(evmTransactionsPath, "utf-8")
      .andThen((content) => {
        const evmTransactions = JSON.parse(content).map(
          (evmT) =>
            new EVMTransaction(
              ChainId(evmT.chainId),
              evmT.hash,
              evmT.timestamp,
              evmT.blockHeight,
              EVMAccountAddress(evmT.to.toLowerCase()),
              EVMAccountAddress(evmT.from.toLowerCase()),
              evmT.value ? BigNumberString(evmT.value) : null,
              evmT.gasPrice ? BigNumberString(evmT.gasPrice) : null,
              evmT.contractAddress
                ? EVMContractAddress(evmT.contractAddress)
                : null,
              evmT.input ?? null,
              evmT.methodId ?? null,
              evmT.functionName ?? null,
              evmT.events,
              this.timeUtils.getUnixNow(),
            ),
        );

        return this.core.addTransactions(evmTransactions);
      })
      .map(() =>
        console.log(`loaded evm transactions from ${evmTransactionsPath}`),
      )
      .mapErr((e) => this._loadOnError(e, evmTransactionsPath));
  }
  protected _loadEarnedRewards(
    earnedRewardsPath: string,
  ): ResultAsync<void, Error> {
    return this.readFile(earnedRewardsPath, "utf-8")
      .andThen((content) => {
        const rewards = JSON.parse(content).reduce((all, r) => {
          switch (r.type) {
            case ERewardType.Direct:
              all.push(
                new DirectReward(
                  IpfsCID(r.queryCID),
                  "direct reward name",
                  IpfsCID("QmTYj6dCVn5R7u7m3X2pypSfAM4oF7zFFhgweneUEvXrmY"),
                  "direct reward description",
                  ChainId(r.chainId),
                  EVMContractAddress(r.contractAddress),
                  EVMAccountAddress(r.eoa),
                ),
              );
              break;
            case ERewardType.Lazy:
              all.push(
                new LazyReward(
                  IpfsCID(r.queryCID),
                  "lazy reward name",
                  IpfsCID("QmTYj6dCVn5R7u7m3X2pypSfAM4oF7zFFhgweneUEvXrmY"),
                  "lazy reward description",
                  ChainId(r.chainId),
                  EVMContractAddress(r.contractAddress),
                  EVMAccountAddress(r.eoa),
                  r.functionName,
                  r.functionParams as RewardFunctionParam[],
                ),
              );
              break;
            case ERewardType.Web2:
              all.push(
                new Web2Reward(
                  IpfsCID(r.queryCID),
                  "Winnie the Pooh",
                  null,
                  "Notice the resemblance?",
                  URLString(r.url),
                  r.credentialType as ECredentialType,
                  Web2Credential(r.credential),
                  r.instructions,
                ),
              );
          }
          return all;
        }, [] as EarnedReward[]);

        return this.core.addEarnedRewards(rewards);
      })
      .map(() => console.log(`loaded earned rewards from ${earnedRewardsPath}`))
      .mapErr((e) => this._loadOnError(e, earnedRewardsPath));
  }
  protected _loadBackup(backupPath: string): ResultAsync<void, Error> {
    return this.readFile(backupPath, "utf-8")
      .andThen((content) => {
        const backupJson = JSON.parse(content);
        return this.core.restoreBackup(backupJson as DataWalletBackup);
      })
      .map(() => console.log(`loaded backup from ${backupPath}`))
      .mapErr((e) => this._loadOnError(e, backupPath));
  }

  private readFile(
    path: string,
    encoding: BufferEncoding,
  ): ResultAsync<string, Error> {
    return ResultAsync.fromPromise(readFile(path, encoding), (e) => e as Error);
  }

  // #endregion

  public signMetatransactionRequest<TErr>(
    request: MetatransactionSignatureRequest<TErr>,
  ): ResultAsync<void, Error | TErr> {
    // This method needs to happen in nicer form in all form factors
    console.log(
      `Metadata Transaction Requested!`,
      `WARNING: This should no longer occur!`,
      `Request account address: ${request.accountAddress}`,
    );

    // We need to get a nonce for this account address from the forwarder contract
    return this.mocks.blockchain.minimalForwarder
      .getNonce(request.accountAddress)
      .andThen((nonce) => {
        // We need to take the types, and send it to the account signer
        const value = {
          to: request.contractAddress, // Contract address for the metatransaction
          from: request.accountAddress, // EOA to run the transaction as (linked account, not derived)
          value: BigNumber.from(request.value), // The amount of doodle token to pay. Should be 0.
          gas: BigNumber.from(request.gas), // The amount of gas to pay.
          nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
          data: request.data, // The actual bytes of the request, encoded as a hex string
        } as IMinimalForwarderRequest;

        // Get the wallet we are going to sign with
        const wallet = this.mocks.blockchain.getWalletForAddress(
          request.accountAddress,
        );

        return wallet
          .signMinimalForwarderRequest(value)
          .andThen((metatransactionSignature) => {
            console.log(
              `Metatransaction signature generated: ${metatransactionSignature}`,
            );

            return request.callback(metatransactionSignature, nonce);
          });
      });
  }

  public getSignatureForAccount(
    wallet: TestWallet,
  ): ResultAsync<Signature, UnsupportedLanguageError | UnauthorizedError> {
    return this.core.account
      .getLinkAccountMessage(this.mocks.languageCode, undefined)
      .andThen((message) => {
        return wallet.signMessage(message);
      });
  }
}
