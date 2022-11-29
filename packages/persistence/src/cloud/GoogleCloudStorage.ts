// import { fs } from "fs";
// import { path } from "path";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { config } from "process";
import { Stream } from "stream";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { Datastore, Key } from "@google-cloud/datastore";
import {
  GetServiceAccountResponse,
  GetSignedUrlResponse,
  Storage,
} from "@google-cloud/storage";
import {
  CryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  LogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  AESEncryptedString,
  BackupIndex,
  BackupIndexEntry,
  CeramicStreamID,
  EncryptedString,
  EVMPrivateKey,
  IDataWalletBackup,
  InitializationVector,
  ModelTypes,
  PersistenceError,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  LinkedAccount,
  URLString,
  AjaxError,
  DataWalletAddress,
  EVMContractAddress,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { DID } from "dids";
import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IPersistenceConfig } from "..";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class GoogleCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  private _storage?: Storage;

  private _restored: Set<string> = new Set();
  private key?: EVMPrivateKey;

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils, // @inject(IDataWalletPersistenceType) // protected persistenceRepo: IDataWalletPersistence,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError | PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    this.key = derivedKey;
    return okAsync(undefined);
  }

  public clear(): ResultAsync<void, PersistenceError | AjaxError> {
    return this._init().andThen(({ client, writeUrl }) => {
      return ResultAsync.fromPromise(
        client.bucket("ceramic-replacement-bucket").deleteFiles(),
        (e) =>
          new PersistenceError("unable to delete files from Google Cloud", e),
      );
    });
  }

  private _getSignedUrl(): ResultAsync<
    GetSignedUrlResponse[],
    PersistenceError | AjaxError
  > {
    console.log("Inside _getGoogleCloudClient");
    console.log("Passed the storage phase!");

    return ResultUtils.combine([this._configProvider.getConfig()]).andThen(
      ([config]) => {
        return this.waitForUnlock().andThen((privateKey) => {
          console.log("privateKey: ", privateKey);
          return this._cryptoUtils
            .deriveCeramicSeedFromEVMPrivateKey(privateKey)
            .andThen((seed) => {
              console.log("Seed: ", seed);
              return this._authenticateDID(seed).andThen((did) => {
                console.log("did: ", did);
                const baseURL = URLString("http://localhost:3006");
                console.log("baseURL: ", baseURL);
                if (this.key == undefined) {
                  this.key = EVMPrivateKey("");
                }
                return this.insightPlatformRepo
                  .getAuthBackups(this.key, baseURL, JSON.stringify(did))
                  .andThen((signedUrls) => {
                    console.log("signedUrlResponse: ", signedUrls);
                    return okAsync(signedUrls);
                  });
              });
            });
        });
      },
    );
  }

  private _authenticateDID(
    seed: Uint8Array,
  ): ResultAsync<DID, PersistenceError> {
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider, resolver: getResolver() });
    return ResultAsync.fromPromise(
      did.authenticate(),
      (e) => new PersistenceError("error authenticated ceramic DID", e),
    ).andThen((_) => okAsync(did));
  }

  private _getGoogleCloudClient(): ResultAsync<
    Storage,
    PersistenceError | AjaxError
  > {
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    return okAsync(storage);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  private _init(): ResultAsync<
    {
      client: Storage;
      config: IPersistenceConfig;
      readUrl: GetSignedUrlResponse;
      writeUrl: GetSignedUrlResponse;
    },
    PersistenceError | AjaxError
  > {
    return ResultUtils.combine([
      this._getGoogleCloudClient(),
      this._configProvider.getConfig(),
      this._getSignedUrl(),
    ]).andThen(([gcpClient, config, signedUrls]) => {
      return okAsync({
        client: gcpClient,
        config: config,
        readUrl: signedUrls[0],
        writeUrl: signedUrls[1],
      });
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError | AjaxError> {
    const bucketName = "ceramic-replacement-bucket";
    return this._init().andThen(({ client, config, writeUrl }) => {
      const bucket = client.bucket(bucketName);
      const file = bucket.file(
        config.ceramicModelAliases.definitions.backupIndex,
      );

      console.log(
        "config.ceramicModelAliases.definitions.backupIndex: ",
        config.ceramicModelAliases.definitions.backupIndex,
      );

      console.log("writeurl: ", writeUrl);
      const passthroughStream = new Stream.PassThrough();
      passthroughStream.write(JSON.stringify(backup));
      passthroughStream.end();
      passthroughStream.pipe(file.createWriteStream()).on("finish", () => {
        this._restored.add(file.metadata.generation);
        this._backups.set(file.metadata.generation, backup);
      });
      return okAsync(CeramicStreamID(""));
    });
  }

  pollBackups(): ResultAsync<
    IDataWalletBackup[],
    PersistenceError | AjaxError
  > {
    return this._init().andThen(({ client, config }) => {
      // Get a v4 signed URL for reading the file
      return ResultAsync.fromPromise(
        client.bucket("ceramic-replacement-bucket").getFiles({
          autoPaginate: true,
          versions: true,
          prefix: config.ceramicModelAliases.definitions.backupIndex,
        }),
        (e) => new PersistenceError("unable to get backup index", e),
      ).andThen((files) => {
        if (files == undefined) {
          return okAsync([]);
        }
        const backups = files[0];
        if (backups.length == 0) {
          return okAsync([]);
        }

        const recent = backups.map((record) => record.metadata.generation);
        // record.metadata.generation
        const found = [...recent].filter((x) => this._restored.has(x));
        const walletBackups = found.map((generationID) => {
          return this._backups.get(generationID) as IDataWalletBackup;
        });
        if (walletBackups[0] == undefined) {
          return okAsync([]);
        }
        return okAsync(walletBackups);
      });
    });
  }
}
