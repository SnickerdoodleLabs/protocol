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
    return this.waitForUnlock().andThen((privateKey) => {
      const baseURL = URLString("http://localhost:3006");
      return this.insightPlatformRepo.clearAllBackups(privateKey, baseURL, "");
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError> {
    const baseURL = URLString("http://localhost:3006");
    return this.waitForUnlock().andThen((privateKey) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      return ResultUtils.combine([
        this.insightPlatformRepo.getRecentVersion(
          privateKey,
          baseURL,
          addr + "/",
        ),
      ]).andThen(([version]) => {
        console.log("Data Wallet address: ", addr);
        console.log("putBackup version: ", version);
        return this.insightPlatformRepo
          .getAuthBackups(privateKey, baseURL, addr + "/version" + version)
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
    const readOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    const ajaxUtils = new AxiosAjaxUtils();

    return this.waitForUnlock().andThen((privateKey) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      const baseURL = URLString("http://localhost:3006");
      const dataBackups: IDataWalletBackup[] = [];

      console.log("PollBackups: ");
      console.log("privateKey: ", privateKey);
      console.log("addr: ", addr);

      return this.insightPlatformRepo
        .getWalletBackups(privateKey, baseURL, addr + "/")
        .andThen((files) => {
          if (files == undefined) {
            console.log("pollBackups returns: []");
            return okAsync([]);
          }
          if (files.length == 0) {
            console.log("pollBackups length is 0");
            return okAsync([]);
          }
          const ajaxUtils = new AxiosAjaxUtils();
          console.log("fileArray ", files);
          console.log("fileArray[0] ", files[0]);

          let version = 0;
          return ResultUtils.combine(
            files.map((file) => {
              version = version + 1;
              return this.insightPlatformRepo.getSignedUrl(
                privateKey,
                baseURL,
                addr + "/version" + version,
              );
            }),
          ).andThen((signedUrls) => {
            return ResultUtils.combine(
              signedUrls.map((signedUrl) => {
                if (signedUrl == undefined) {
                  console.log("signedUrl: ", signedUrl);
                }

                console.log("INNER signedUrl: ", signedUrl);

                if (signedUrl !== undefined) {
                  return ResultAsync.fromPromise(
                    ajaxUtils
                      .get(new URL(signedUrl as string))
                      .then((innerValue) => {
                        return innerValue["value"] as IDataWalletBackup;
                      }),
                    (e) => new AjaxError("unable let {addr}", e),
                  ).andThen((qwe) => {
                    console.log("qwe: ", qwe);
                    return okAsync(qwe as IDataWalletBackup);
                  });
                }
                return okAsync({} as IDataWalletBackup);
              }),
            ).andThen((po) => {
              console.log("po: ", po);
              return okAsync(po);
            });
          });
        });
    });
  }

  // });
}
