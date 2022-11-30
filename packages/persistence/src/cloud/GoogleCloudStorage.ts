import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
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
  EVMAccountAddress,
  UUID,
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

  public clear(): ResultAsync<void, PersistenceError | AjaxError> {
    const storage = new Storage({
      keyFilename: "../persistence/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    storage.bucket("ceramic-replacement-bucket").deleteFiles();
    return okAsync(undefined);
  }

  protected getUUID(
    addr: EVMAccountAddress,
  ): ResultAsync<UUID, PersistenceError> {
    const storage = new Storage({
      keyFilename: "../persistence/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    let version = "1";
    return ResultAsync.fromPromise(
      storage.bucket("ceramic-replacement-bucket").getFiles({
        autoPaginate: true,
        versions: true,
        prefix: addr + "/",
      }),
      (e) =>
        new PersistenceError(
          "unable to retrieve GCP file version from data wallet {addr}",
          e,
        ),
    ).andThen((allFiles) => {
      if (allFiles[0].length !== 0) {
        const inArray = allFiles[0];
        const name = inArray[inArray.length - 1]["metadata"]["name"];
        const versionString = name.split(/[/ ]+/).pop();
        console.log("versionString: ", versionString);
        const versionNumber = versionString.split("version");
        console.log("versionNumber: ", versionNumber[1]);
        console.log(parseInt(versionNumber[1]) + 1);
        version = (parseInt(versionNumber[1]) + 1).toString();
        console.log("Inner Version 1: ", version);
      }
      console.log("Inner Version 2: ", version);
      return okAsync(UUID(version));
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError> {
    return this.waitForUnlock().andThen((privateKey) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      return ResultUtils.combine([this.getUUID(addr)]).andThen(([version]) => {
        const baseURL = URLString("http://localhost:3006");
        console.log("putBackup version: ", version);
        return this.insightPlatformRepo
          .getAuthBackups(privateKey, baseURL, addr + "/version" + version)
          .andThen((signedUrl) => {
            const ajaxUtils = new AxiosAjaxUtils();
            try {
              ajaxUtils
                .put(new URL(signedUrl[0]!), JSON.stringify(backup), {
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

  pollBackups(): ResultAsync<
    IDataWalletBackup[],
    PersistenceError | AjaxError
  > {
    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    const storage = new Storage({
      keyFilename: "../persistence/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    return this.waitForUnlock().andThen((privateKey) => {
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      return ResultAsync.fromPromise(
        storage.bucket("ceramic-replacement-bucket").getFiles({
          autoPaginate: true,
          versions: true,
          prefix: addr + "/",
        }),
        (e) =>
          new PersistenceError(
            "unable to retrieve GCP file version from data wallet {addr}",
            e,
          ),
      ).andThen((allFiles) => {
        if (allFiles[0].length !== 0) {
          const inArray = allFiles[0];
          // allFiles[0].map(() => {
          //   IDataWalletBackup
          // })
        }
        return okAsync([]);
      });
    });
  }
}
