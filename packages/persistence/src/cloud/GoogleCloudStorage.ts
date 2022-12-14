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
      return this.getWalletListing()
        .andThen((walletFiles) => {
          const mostRecentFile =
            walletFiles.items[walletFiles.items.length - 1];
          return okAsync(mostRecentFile);
        })
        .andThen((googleFile) => {
          return this.insightPlatformRepo.clearAllBackups(
            privateKey,
            config.defaultInsightPlatformBaseUrl,
            addr,
          );
        });
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

      // can use this instead for filtering data
      // backup.header.hash;

      return ResultUtils.combine([this.getWalletListing()])
        .andThen(([backupsDirectory]) => {
          const files = backupsDirectory.items;
          return this.insightPlatformRepo.getSignedUrl(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/" + backup.header.hash,
          );
        })
        .andThen((signedUrl) => {
          // if (signedUrl === typeof URLString) {
          this.ajaxUtils
            .put(new URL(signedUrl), JSON.stringify(backup), {
              headers: {
                "Content-Type": `multipart/form-data;`,
              },
            })
            .mapErr((e) => {
              new PersistenceError(`${e.name}: ${e.message}`);
            });

          // }
          return okAsync(DataWalletBackupID(""));
        });
    });
  }

  protected getVersionNumber(files: IGoogleFileBackup[]): string {
    if (files == undefined) {
      return "1000000";
    } else if (files.length == 0) {
      return "1000000";
    } else {
      // console.log("files: ", files);
      const name = files[files.length - 1]["name"];
      // if (!name.includes("version")) {
      //   name = "version" + name;
      // }
      // console.log("name: ", name);
      const fileName = name.split(/[/ ]+/).pop();
      if (fileName == undefined) {
        return "1000000";
      } else {
        // console.log("versionString: ", fileName);
        const versionNumber = fileName.split("version");
        // console.log("versionNumber: ", versionNumber);
        const number = parseInt(versionNumber[1]);
        const upgrade = number + 1;
        const version = upgrade.toString();
        // console.log("version: ", version);
        return version;
      }
    }
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
                .get<IDataWalletBackup>(new URL(file.mediaLink as string))
                .andThen((DWBackup) => {
                  return okAsync(DWBackup);
                });
            }),
        );
      })
      .andThen((dataWalletBackups) => {
        return okAsync(dataWalletBackups);
      });
  }

  protected getWalletListing(): ResultAsync<
    IGoogleWalletBackupDirectory,
    PersistenceError | AjaxError
  > {
    return this.waitForUnlock().andThen((privateKey) => {
      return this._configProvider.getConfig().andThen((config) => {
        const defaultInsightPlatformBaseUrl =
          config.defaultInsightPlatformBaseUrl;
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
    });
  }
}
