import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  AxiosAjaxUtils,
  CryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
  URLString,
  AjaxError,
  DataWalletBackupID,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IGoogleFileBackup,
  IGoogleWalletBackupDirectory,
} from "@persistence/cloud/IGoogleBackup.js";
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

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IAxiosAjaxUtilsType)
    protected ajaxUtils: AxiosAjaxUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  public clear(): ResultAsync<void, PersistenceError | AjaxError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        return this.insightPlatformRepo.clearAllBackups(
          privateKey,
          config.defaultInsightPlatformBaseUrl,
          addr,
        );
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError | AjaxError> {
      return ResultUtils.combine([
        this.waitForUnlock(),
        this._configProvider.getConfig(),
      ]).andThen(([privateKey, config]) => {
        const defaultInsightPlatformBaseUrl =
          config.defaultInsightPlatformBaseUrl;
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);

        return this.insightPlatformRepo.getSignedUrl(
          privateKey,
          defaultInsightPlatformBaseUrl,
          addr + "/" + backup.header.hash,
        )
      })
        .andThen((signedUrl) => {
          // if (signedUrl === typeof URLString) {
            return this.ajaxUtils
              .put<DataWalletBackupID>(new URL(signedUrl), JSON.stringify(backup), {
                headers: {
                  "Content-Type": `multipart/form-data;`,
                },
            });
          // }
    });
  }

  public pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<IDataWalletBackup[], PersistenceError | AjaxError> {
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
        if (files == undefined) {
          return okAsync([]);
        }
        if (files.length == 0) {
          return okAsync([]);
        }

        // Now iterate only through the found hashes
        return ResultUtils.combine(
          files
            .filter((file) => {
              const name = file.name.split(/[/ ]+/).pop();
              return restored.has(DataWalletBackupID(name!));
            })
            .map((file) => {
              return this.ajaxUtils
                .get<IDataWalletBackup>(new URL(file.mediaLink as string));
            }),
        );
      });
  }

  protected getWalletListing(): ResultAsync<
    IGoogleWalletBackupDirectory,
    PersistenceError | AjaxError
  > {
    return ResultUtils.combine([this.waitForUnlock(), this._configProvider.getConfig()]).andThen(([privateKey, config]) => {
        const defaultGoogleCloudBucket = config.defaultGoogleCloudBucket;
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        const dataWalletFolder =
          "https://storage.googleapis.com/storage/v1/b/" +
          defaultGoogleCloudBucket +
          "/o?prefix=" +
          addr;
        return this.ajaxUtils.get<IGoogleWalletBackupDirectory>(
          new URL(dataWalletFolder),
        );
      });
  }
}
