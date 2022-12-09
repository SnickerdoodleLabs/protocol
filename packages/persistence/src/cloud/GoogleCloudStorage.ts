import { GetSignedUrlConfig } from "@google-cloud/storage";
import {
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
import { okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils, // @inject(IDataWalletPersistenceType) // protected persistenceRepo: IDataWalletPersistence,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
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

  /* Currently deletes everything on GCP */
  public clear(): ResultAsync<void, PersistenceError | AjaxError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      // const baseURL = URLString("http://localhost:3001/v0");
      return this.insightPlatformRepo.clearAllBackups(
        privateKey,
        config.defaultInsightPlatformBaseUrl,
        "",
      );
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, baseURL]) => {
      // const baseURL = URLString("http://localhost:3001/v0");
      const defaultInsightPlatformBaseUrl =
        baseURL.defaultInsightPlatformBaseUrl;
      console.log("Base URL: ", defaultInsightPlatformBaseUrl);

      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      return ResultUtils.combine([
        this.insightPlatformRepo.getRecentVersion(
          privateKey,
          defaultInsightPlatformBaseUrl,
          addr + "/",
        ),
      ]).andThen(([version]) => {
        console.log("Data Wallet address: ", addr);
        console.log("putBackup version: ", version);
        return this.insightPlatformRepo
          .getAuthBackups(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/version" + version,
          )
          .andThen((signedUrl) => {
            console.log("Putbackups signedUrl [0][0]: ", signedUrl[0][0]!);
            console.log("Putbackups signedUrl [1][0]: ", signedUrl[1][0]!);
            const ajaxUtils = new AxiosAjaxUtils();
            try {
              ajaxUtils
                .put(new URL(signedUrl[1][0]!), JSON.stringify(backup), {
                  headers: {
                    "Content-Type": `multipart/form-data;`,
                  },
                })
                .map((response) => {
                  console.log("Response: ", response);
                })
                .mapErr((err) => {
                  console.log("err: ", err);
                });
            } catch (e) {
              console.error("error", e);
            }
            return okAsync(undefined);
          });
      });
    });
  }

  public pollBackups(): ResultAsync<
    IDataWalletBackup[],
    PersistenceError | AjaxError
  > {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this._configProvider.getConfig(),
    ]).andThen(([privateKey, config]) => {
      console.log(
        "config.defaultInsightPlatformBaseUrl: ",
        config.defaultInsightPlatformBaseUrl,
      );
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      // const baseURL = URLString("http://localhost:9001");
      const dataBackups: IDataWalletBackup[] = [];

      return this.insightPlatformRepo
        .getWalletBackups(
          privateKey,
          config.defaultInsightPlatformBaseUrl,
          addr + "/",
        )
        .andThen((files) => {
          if (files == undefined) {
            return okAsync([]);
          }
          if (files.length == 0) {
            return okAsync([]);
          }
          const ajaxUtils = new AxiosAjaxUtils();

          let version = 0;
          return ResultUtils.combine(
            files.map((file) => {
              version = version + 1;
              return this.insightPlatformRepo.getSignedUrl(
                privateKey,
                config.defaultInsightPlatformBaseUrl,
                addr + "/version" + version,
              );
            }),
          ).andThen((signedUrls) => {
            return ResultUtils.combine(
              signedUrls.map((signedUrl) => {
                if (signedUrl == undefined) {
                  console.log("signedUrl: ", signedUrl);
                }

                if (signedUrl !== undefined) {
                  return ResultAsync.fromPromise(
                    ajaxUtils
                      .get(new URL(signedUrl as string))
                      .then((innerValue) => {
                        return innerValue["value"] as IDataWalletBackup;
                      }),
                    (e) => new AjaxError("unable let {addr}", e),
                  ).andThen((backup) => {
                    return okAsync(backup as IDataWalletBackup);
                  });
                }
                return okAsync({} as IDataWalletBackup);
              }),
            ).andThen((dataWalletBackups) => {
              console.log("dataWalletBackups: ", dataWalletBackups);
              return okAsync(dataWalletBackups);
            });
          });
        });
    });
  }
}
