import { parse } from "@babel/core";
import { GetSignedUrlConfig } from "@google-cloud/storage";
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
import { okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as xml2js from "xml2js";

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
      const defaultInsightPlatformBaseUrl =
        baseURL.defaultInsightPlatformBaseUrl;
      console.log("Base URL: ", defaultInsightPlatformBaseUrl);
      const addr =
        this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
      const dataWalletFolder = URLString(
        "https://storage.googleapis.com/ceramic-replacement-bucket?prefix=" +
          addr,
      );

      // getRecentVersion
      return ResultAsync.fromPromise(
        this.ajaxUtils.get(new URL(dataWalletFolder as string)),
        (e) => new AjaxError("unable let {addr}", e),
      ).andThen((files) => {
        console.log("files: ", files);
        const version = "1";
        // if (files !== undefined) {
        //   console.log("In undefined: ");

        //   if (files.length > 0) {
        //     const inArray = files[files.length - 1];
        //     // const inArray = allFiles[0];
        //     console.log("inArray: ", inArray);

        //     // inArray["metadata"]["name"];
        //     const name = inArray["metadata"]["name"];
        //     const versionString = name.split(/[/ ]+/).pop();
        //     console.log("versionString: ", versionString);
        //     const versionNumber = versionString.split("version");
        //     console.log("versionNumber: ", versionNumber[1]);
        //     console.log(parseInt(versionNumber[1]) + 1);

        //     version = (parseInt(versionNumber[1]) + 1).toString();
        //     console.log("Inner Version 1: ", version);
        //   }
        // }
        console.log("putBackup version: ", version);
        return this.insightPlatformRepo
          .getSignedUrls(
            privateKey,
            defaultInsightPlatformBaseUrl,
            addr + "/version" + version,
          )
          .andThen((signedUrl) => {
            const writeUrl = signedUrl[1][0]!;
            console.log("writeUrl: ", writeUrl);
            try {
              this.ajaxUtils
                .put(new URL(writeUrl), JSON.stringify(backup), {
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
    ])
      .andThen(([privateKey, config]) => {
        console.log(
          "config.defaultInsightPlatformBaseUrl: ",
          config.defaultInsightPlatformBaseUrl,
        );
        const addr =
          this._cryptoUtils.getEthereumAccountAddressFromPrivateKey(privateKey);
        // const dataWalletFolder = URLString(
        //   "https://storage.googleapis.com/ceramic-replacement-bucket?prefix=" +
        //     addr,
        // );
        const dataWalletFolder =
          "https://storage.googleapis.com/ceramic-replacement-bucket?prefix=0x02a3679d514eb373e1963bFF99B1A1de44aCE065";

        const dataBackups: IDataWalletBackup[] = [];
        return ResultAsync.fromPromise(
          this.ajaxUtils
            .get<XMLDocument>(new URL(dataWalletFolder))
            .then((xmlDoc) => {
              console.log("Inner - ", xmlDoc);
              return xmlDoc["value"] as XMLDocument;
            }),
          (e) => new AjaxError("unable let {addr}", e),
        ).andThen((files) => {
          return okAsync(files as XMLDocument);
        });
      })
      .andThen((xmlDoc) => {
        console.log("xmlDoc: ", xmlDoc);
        xmlDoc.getElementsByTagName("ListBucketResult");
        console.log(
          "Contents: ",
          xmlDoc.getElementsByTagName("ListBucketResult"),
        );
        // const contents = xmlDoc.getElementById("Contents");

        return okAsync([]);
      });
  }
}
