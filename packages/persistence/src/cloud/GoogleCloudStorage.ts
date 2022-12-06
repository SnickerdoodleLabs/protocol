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
    // const storage = new Storage({
    //   keyFilename: "../persistence/src/credentials.json",
    //   projectId: "snickerdoodle-insight-stackdev",
    // });
    // storage.bucket("ceramic-replacement-bucket").deleteFiles();
    return okAsync(undefined);
  }

  // protected getUUID(
  //   addr: EVMAccountAddress,
  // ): ResultAsync<UUID, PersistenceError> {
  //   const storage = new Storage({
  //     keyFilename: "../persistence/src/credentials.json",
  //     projectId: "snickerdoodle-insight-stackdev",
  //   });
  //   let version = "1";
  //   console.log("version: ", version);
  //   return ResultAsync.fromPromise(
  //     storage.bucket("ceramic-replacement-bucket").getFiles({
  //       autoPaginate: true,
  //       versions: true,
  //       prefix: addr + "/",
  //     }),
  //     (e) =>
  //       new PersistenceError(
  //         "unable to retrieve GCP file version from data wallet {addr}",
  //         e,
  //       ),
  //   ).andThen((allFiles) => {
  //     console.log("allFiles: ", allFiles);
  //     console.log("allFiles[0]: ", allFiles[0]);
  //     console.log("allFiles[0]: ", allFiles[0].length);

  //     if (allFiles[0].length !== 0) {
  //       const inArray = allFiles[0];
  //       console.log("inArray: ", inArray);

  //       const name = inArray[inArray.length - 1]["metadata"]["name"];
  //       const versionString = name.split(/[/ ]+/).pop();
  //       console.log("versionString: ", versionString);
  //       const versionNumber = versionString.split("version");
  //       console.log("versionNumber: ", versionNumber[1]);
  //       console.log(parseInt(versionNumber[1]) + 1);
  //       version = (parseInt(versionNumber[1]) + 1).toString();
  //       console.log("Inner Version 1: ", version);
  //     }
  //     console.log("Inner Version 2: ", version);
  //     return okAsync(UUID(version));
  //   });
  // }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<void, PersistenceError | AjaxError> {
    return okAsync(undefined);

    // return this.waitForUnlock().andThen((privateKey) => {
    //   const addr =
    //     this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
    //   return ResultUtils.combine([this.getUUID(addr)]).andThen(([version]) => {
    //     const baseURL = URLString("http://localhost:3006");
    //     console.log("putBackup version: ", version);
    //     return this.insightPlatformRepo
    //       .getAuthBackups(privateKey, baseURL, addr + "/version" + version)
    //       .andThen((signedUrl) => {
    //         console.log("Putbackups signedUrl [0][0]: ", signedUrl[0][0]!);
    //         console.log("Putbackups signedUrl [1][0]: ", signedUrl[1][0]!);

    //         const ajaxUtils = new AxiosAjaxUtils();
    //         try {
    //           ajaxUtils
    //             .put(new URL(signedUrl[1][0]!), JSON.stringify(backup), {
    //               headers: {
    //                 "Content-Type": `multipart/form-data;`,
    //               },
    //             })
    //             .map((response) => {
    //               console.log("Response: ", response);
    //             })
    //             .mapErr((err) => {
    //               console.log("err: ", err);
    //             });
    //         } catch (e) {
    //           console.error("error", e);
    //         }
    //         return okAsync(undefined);
    //       });
    //   });
    // });
  }

  pollBackups(): ResultAsync<
    IDataWalletBackup[],
    PersistenceError | AjaxError
  > {
    return okAsync([]);

    // const storage = new Storage({
    //   keyFilename: "src/credentials.json",
    //   projectId: "snickerdoodle-insight-stackdev",
    // });
    // const readOptions: GetSignedUrlConfig = {
    //   version: "v4",
    //   action: "read",
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // };
    // const ajaxUtils = new AxiosAjaxUtils();
    // let val;

    // return this.waitForUnlock().andThen((privateKey) => {
    //   const addr =
    //     this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
    //   const baseURL = URLString("http://localhost:3006");
    //   const dataBackups: IDataWalletBackup[] = [];

    //   console.log("Unlocked: ", addr);
    //   return ResultAsync.fromPromise(
    //     storage
    //       .bucket("ceramic-replacement-bucket")
    //       .getFiles({ prefix: addr + "/" }),
    //     (e) =>
    //       new PersistenceError(
    //         "unable to retrieve GCP file version from data wallet {addr}",
    //         e,
    //       ),
    //   ).andThen((files) => {
    //     const ajaxUtils = new AxiosAjaxUtils();
    //     const fileArray = files[0];
    //     console.log("files: ", files);

    //     return ResultUtils.combine(
    //       fileArray.map((file) => {
    //         return ResultAsync.fromPromise(
    //           file.getSignedUrl(readOptions),
    //           (e) => new PersistenceError("Error pinning stream", e),
    //         ).andThen((vas) => {
    //           return okAsync(vas);
    //         });
    //       }),
    //     ).andThen((signedUrls) => {
    //       console.log("signedUrls: ", signedUrls);
    //       console.log("signedUrls[0]: ", signedUrls[0]);
    //       return ResultUtils.combine(
    //         signedUrls.map((signedUrl) => {
    //           return ResultAsync.fromPromise(
    //             ajaxUtils.get(new URL(signedUrl[0])).then((innerValue) => {
    //               return (innerValue["value"] as IDataWalletBackup);
    //             }),
    //             (e) => new AjaxError("unable let {addr}", e),
    //           ).andThen((qwe) => {
    //             return okAsync(qwe as IDataWalletBackup);
    //           });
    //         }),
    //       ).andThen((po) => {
    //         console.log("po: ", po);
    //         return okAsync(po);
    //       });
    //     });
    //   });
    // });
  }
}
