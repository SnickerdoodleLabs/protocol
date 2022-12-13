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
  ): ResultAsync<void, AjaxError | PersistenceError> {
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
  ): ResultAsync<void, PersistenceError | AjaxError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      const defaultInsightPlatformBaseUrl =
        config.defaultInsightPlatformBaseUrl;
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);

      return ResultUtils.combine([this.getWalletListing()])
        .andThen(([backupsDirectory]) => {
          const files = backupsDirectory.items;
          const version = this.getVersionNumber(files);
          return this.insightPlatformRepo.getSignedUrl(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/version" + version,
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
          return okAsync(undefined);
        });
    });
  }

  protected getVersionNumber(files: IGoogleFileBackup[]): string {
    if (files == undefined) {
      return "1";
    } else if (files.length == 0) {
      return "1";
    } else {
      const name = files[files.length - 1]["name"];
      const versionString = name.split(/[/ ]+/).pop();
      if (versionString == undefined) {
        return "1";
      } else {
        const versionNumber = versionString.split("version");
        const version = (parseInt(versionNumber[1]) + 1).toString();
        return version;
      }
    }
  }

  public pollBackups(): ResultAsync<
    IDataWalletBackup[],
    PersistenceError | AjaxError
  > {
    return this.getWalletListing()
      .andThen((backupsDirectory) => {
        const files = backupsDirectory.items;
        if (files == undefined) {
          return okAsync([]);
        }
        if (files.length == 0) {
          return okAsync([]);
        }
        return ResultUtils.combine(
          files.map((file) => {
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
