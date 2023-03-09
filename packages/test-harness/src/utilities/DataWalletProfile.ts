import { readFile } from "node:fs/promises";
import path from "path";

import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AESEncryptedString,
  BigNumberString,
  ChainId,
  DirectReward,
  EarnedReward,
  EChain,
  ECredentialType,
  EncryptedString,
  ERewardType,
  EVMAccountAddress,
  EVMPrivateKey,
  EVMTransaction,
  IConfigOverrides,
  IDataWalletBackup,
  InitializationVector,
  IpfsCID,
  LazyReward,
  MetatransactionSignatureRequest,
  PageInvitation,
  RewardFunctionParam,
  SDQLQueryRequest,
  Signature,
  SiteVisit,
  TransactionReceipt,
  UnixTimestamp,
  UnsupportedLanguageError,
  URLString,
  Web2Credential,
  Web2Reward,
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  InvalidSignatureError,
  MinimalForwarderContractError,
  PersistenceError,
  UninitializedError,
  EVMContractAddress,
  EBackupPriority,
  AESKey,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { injectable } from "inversify";
import { err, errAsync, okAsync, ResultAsync } from "neverthrow";
// import fs from "fs";
import { ResultUtils } from "neverthrow-result-utils";
import { Subscription } from "rxjs";

import { Environment, TestHarnessMocks } from "@test-harness/mocks";
import { ApproveQuery } from "@test-harness/prompts/ApproveQuery.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";

@injectable()
export class DataWalletProfile {
  readonly core: SnickerdoodleCore;
  private _unlocked = false;
  private defaultPathInfo = {
    name: "default",
    path: "data/profiles/dataWallet/default",
  };
  private _profilePathInfo = this.defaultPathInfo;

  private _destroyed = false;

  private coreSubscriptions = new Array<Subscription>();
  public acceptedInvitations = new Array<PageInvitation>();

  public constructor(readonly mocks: TestHarnessMocks) {
    this.core = this.createCore(mocks);
  }

  public get name(): string {
    return this._profilePathInfo.name;
  }

  public get unlocked(): boolean {
    return this._unlocked;
  }

  public destroy(): void {
    this.destroyCore();
    this._destroyed = true;
  }

  public initCore(env: Environment): void {
    if (this.coreSubscriptions.length > 0) {
      this.destroyCore();
    }

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
  }
  public unlock(
    wallet: TestWallet,
  ): ResultAsync<
    void,
    | PersistenceError
    | AjaxError
    | BlockchainProviderError
    | UninitializedError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
    | MinimalForwarderContractError
    | Error
  > {
    return this.getSignatureForAccount(wallet)
      .andThen((signature) => {
        return this.core.unlock(
          wallet.accountAddress,
          signature,
          this.mocks.languageCode,
          wallet.chain,
        );
      })
      .andThen(() => {
        this._unlocked = true;
        console.log(`Unlocked account ${wallet.accountAddress}!`);
        return this.loadFromPathAfterUnlocked().map(() => {
          console.log(`Loaded complete profile for newly unlocked wallet`);
        });
      });
  }

  protected destroyCore(): void {
    this.coreSubscriptions.map((subscription) => subscription.unsubscribe());
    this.coreSubscriptions = new Array<Subscription>();
  }

  protected createCore(mocks: TestHarnessMocks): SnickerdoodleCore {
    const core = new SnickerdoodleCore(
      {
        defaultInsightPlatformBaseUrl: "http://localhost:3006",
        dnsServerAddress: "http://localhost:3006/dns",
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
          this.core.setBirthday(demographic.birthday ?? null),
          this.core.setGender(demographic.gender ?? null),
          this.core.setLocation(demographic.location ?? null),
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
              EVMAccountAddress(evmT.to),
              EVMAccountAddress(evmT.from),
              evmT.value ? BigNumberString(evmT.value) : null,
              evmT.gasPrice ? BigNumberString(evmT.gasPrice) : null,
              evmT.contractAddress
                ? EVMContractAddress(evmT.contractAddress)
                : null,
              evmT.input ?? null,
              evmT.methodId ?? null,
              evmT.functionName ?? null,
              evmT.events,
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

        const backup: IDataWalletBackup = {
          header: {
            hash: backupJson.hash,
            timestamp: UnixTimestamp(backupJson.timestamp),
            signature: backupJson.signature,
            priority: EBackupPriority.NORMAL,
            dataType: EBackupPriority.NORMAL,
          },
          blob: new AESEncryptedString(
            EncryptedString(backupJson.blob.data),
            InitializationVector(backupJson.blob.initializationVector),
          ),
        };
        return this.core.restoreBackup(backup);
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
  ): ResultAsync<Signature, UnsupportedLanguageError> {
    return this.core
      .getUnlockMessage(this.mocks.languageCode)
      .andThen((message) => {
        return wallet.signMessage(message);
      });
  }
}
