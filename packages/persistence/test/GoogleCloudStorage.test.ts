import "reflect-metadata";

import * as crypto from "crypto";

import {
  Bucket,
  GetBucketSignedUrlConfig,
  GetSignedUrlConfig,
  Storage,
  ServiceAccount,
} from "@google-cloud/storage";
import { AxiosAjaxUtils, CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

// from google.oauth2 import service_account
// import { Service_Account } from "google.oauth2";
import { GoogleCloudStorage } from "@persistence/cloud";
import { IPersistenceConfigProvider } from "@persistence/IPersistenceConfigProvider";

class GoogleCloudMocks {
  public _configProvider: IPersistenceConfigProvider;
  public _cryptoUtils: CryptoUtils;
  public insightPlatformRepo: IInsightPlatformRepository;

  public constructor() {
    this._configProvider = td.object<IPersistenceConfigProvider>();
    this._cryptoUtils = td.object<CryptoUtils>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
  }
  public factory(): GoogleCloudStorage {
    return new GoogleCloudStorage(
      this._configProvider,
      this._cryptoUtils,
      this.insightPlatformRepo,
    );
  }
}

describe("Google Cloud Storage Tests", () => {
  const dataWalletKey = EVMPrivateKey("dataWalletKey");
  test("Connect to the bucket", async () => {
    const mocks = new GoogleCloudMocks();
    const queryService = mocks.factory();
    const result = await queryService.unlock(dataWalletKey);
    // Assert
    expect(result).toBeDefined();
  });

  test("Connect to the bucket", async () => {
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    const fileOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    // const bucketOptions: GetBucketSignedUrlConfig = {
    //   version: "v4",
    //   action: "read",
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // };
    const signedUrl = await storage
      .bucket("ceramic-replacement-bucket")
      .file("0x05E1587afCf321A17a76553BC04C865fbe63AF72/version1")
      .getSignedUrl(fileOptions);

    // ajaxUtils.get(new URL("")).then((answer) => {});
    const gcpCreds = {
      type: "service_account",
      project_id: "snickerdoodle-insight-stackdev",
      private_key_id: "d61573e14e1e2f04d0900f48f22e5116d5f09b97",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGsf9j4N8iTGJk\nLiZwrrlzF9cZhJh3RsfkZ4OBcBA8wXRgXnhuZSvlJXkIXwnXwzySeHhWd8gbe0dR\npGQ1GGUdKOtXh0PDQBq+vDpY8KNt1m2UFlslqJhVCH+KjsuAav+bCtZ141h4XeBn\nBtCqyqZIj9XjVwgh9bE9XpeaIW8GB0K/WLOiPAIRnz+jjQQ7qU8NgMtKS7Dw3nYO\nSKxtOa7NlIF5PqzqQK8Ra+jLPXfcYZQ4Y90G/v+morcNCP714aHKY7dv2PgaHx2P\n8HAyz/FNNOcxD/ofi1xtdsdGWvsw26uUU67Bfr5WM2WESJrQ/HIs6x1fmjrUIbrB\nT2DUhN0/AgMBAAECggEABzM1B3gDGJmUU9VY9EAInVM8VVg43tL0Sbe3Nri1Bevs\nB9VJ35TlSc5D/ASBn/gbA6MU7UE1lvVZKMFga4zLloprOMaV3dyT+4cTmtx2zPNL\nu5Ax066v0nOr4if5gi5JE+Oz0MghERTfHayhYXGqzo9TwgNfL+fYzoSqfAiBHu09\nE7D5eQyqv8elCMWoc1i/1XvoYu0ystLZKzKqVrPZaySLfRGYMK0PYSoIzmv500Kd\n38kKSNjXgU4iMUF5EGvm/re4NRkAWnGPu+Yz0D1rTH8yMCohMYaXx03Vs3xGLdzh\nu+hnbqZxdntzs8ccj5sdwM2E1Nddt93jIA7DBbogKQKBgQDn+7udmMFUmiA0ybg4\nqlmQLdj4v3g1k920t/P5zBqjS61ucSQ5CbrN0wy79hHbjdtXRGgTj0akFaId77t3\nHhIoIYSTbDOi1/MKWMgJOOCcFvran+vLKcjbaewo22qVl623JtOmFm2FAs8dlpl7\nuT2IXC0zkDCq8WdexEPvkHvxaQKBgQDbRAfAY8MaXZCGifyewm1smW+HyPGrZwp+\nY+nG8gVJT9pSedaVn9FZifb5eN2cWmgBJ3vcPIs+GqBRUMtG/xsoYr6YE9QtF5DK\n0Oa2hM5qJsbCGB90pulLyopie+bbZ9+vB3SSGoZegXvwxIsrqeGoOsjpgHvPLGC+\ns1d3dx1cZwKBgG4gy0hdpCoNoQxuVs5P0ITpvv8XpnGI6M9KJMCJbHvpCURM4e1R\n+SSM9JamkoOwLFiZWO8wLVDoFDYyAMTjuarjfpSd4UWFTxOyYgQ+xCJVpnDzSnUA\nOSIwfrRGtaqefxFblU5bh1KFqt1ZCTP7FIMPf0XjRbdhMrmCYt3vsWdBAoGABHuz\nnN9tUdCv79BKdgSLsDjC6wfUyShmModgdEzmhsU3NZCALrcB1M7ZWeh6v4OptLxV\n7/7c6fwpYwA/58e3im/abcmaAQIGV99FmF3GyqzYS4eqvPvcsUwG4FSgN8Q78pw4\nafRY4v3KxvV90vq6PnJVQVD7NxU1NTD9jNfGpekCgYANevUFF6QwKfibT8j1Mdhw\n9fH9ppIExqE76Nzg2DQJY9RAOxSJtIXYzpNxArq4Q2UyAflF+wyT3sLo9o4ArnYe\nlX4cZH55e+GQ/BG27dh/CbOuv662kKi2YfxYxO8K/RCPdZ0NW4dVf6Eb0DzCtCgV\nj57FI35Oo0KTEuAUz5TKhw==\n-----END PRIVATE KEY-----\n",
      client_email:
        "ceramic-replacement@snickerdoodle-insight-stackdev.iam.gserviceaccount.com",
      client_id: "111505497821125903620",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com",
    };

    const ajaxUtils = new AxiosAjaxUtils();
    console.log("signedUrl[0]: ", signedUrl[0]);

    // let url =
    //   "https://storage.googleapis.com/ceramic-replacement-bucket/0x05E1587afCf321A17a76553BC04C865fbe63AF72/version1?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com%2F20221202%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221202T185850Z&X-Goog-Expires=901&X-Goog-SignedHeaders=host&X-Goog-Signature=";
    // // now add the signature
    // url =
    //   url +
    //   "0eadaf9ec092204fd5551dbc3ea26e41a7c19cd9a69a9da763786396ea8b66f8e2e4e2ccc19aa2ffe90199a65a25530df475dec993de3585d3393c3e50d3fdccaba9974123d57edbe71a50911b6c4fbd97902eb6ad453f8299591a3d248787193c443cad33c877cf3e0c8985724128b6c2d5b1d527f3ababed474c635a4622c9fd636f65d022f04d6e5e3340262fb6f8585334725dccb8ca384fcc025d494210041cadc68aaf3e741c2dd6c76b369d581c86d016d3f8784a5411739f7bb9bfcae6afff080595c07ed2f5d5a81e0a3ce9cc0583f2b0ca05f3455bd0a5d490a7dfcad872d8c9d833b03ca9d939577f7b7281f14fdb1781c2e5becbf69181d94901";

    const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", {
      namedCurve: "sect239k1",
    });

    const vals =
      "GOOG4-RSA-SHA256\n20191201T190859Z\n20191201/us-central1/storage/goog4_request\n54f3076005db23fbecdb409d25c0ccb9fb8b5e24c59f12634654c0be13459af0";

/*
https://cloud.google.com/storage/docs/access-control/signing-urls-manually#algorithm
    1. Make Canonical Query String
    2. Construct String-to-sign
    3. Sign the string-to-sign using an RSA signature with SHA-256. 
*/

    // const XGoogAlgorithm = "GOOG4-RSA-SHA256";
    // const XGoogCredential =
    //   "ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com%2F20221202%2Fauto%2Fstorage%2Fgoog4_request&";
    // const XGoogDate = "20221202T185850Z";
    // const XGoogLocation = "us-central1";
    // const XGoogService = "storage";
    // const XGoogRequestType = "goog4_request";

    // const XHalfGoogDate = "20221202";

    // const XGoogExpires = "901";
    // const XGoogSignedHeaders = "host";
    // const XCredentialScope =
    //   XHalfGoogDate +
    //   "/" +
    //   XGoogLocation +
    //   "/" +
    //   XGoogService +
    //   "/" +
    //   XGoogRequestType;

    // const sign = crypto.createSign("SHA256");
    // sign.write(
    //   "X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com%2F20221128%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221128T233321Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=00e89ca5c573091c6476673b60479e88ee38488dd6ffe675d61987edad51be77b80aefd926225e2eb7f399c6e4bf55751c54ca58de8199c8c8fac4b45ae5f8a1b9094aa18412f89cbd23a3ea438048ab4a944d1d15f1c39023b29939b62401fc2a544f8fb5823c45d1f61552ed0a21316ae37445572a5e95d1743084deebf7dfdc86422b647e42bed00e4f6317613e4d16ec10764ad8b7b25bb226d5d0e6ef70841c4b871dd3e2d9528915e358e9bc0e519fc2681e29c12280c58382a1440283e4704bfa419dc68cf7e557eb60442f4f7c5b0df0486d31ce0d732884426d8208741834cd61a71ea8aa871a7eb66d4c72fcd0bb1ca3c364950e8710f159cd7d3f",
    // );
    // sign.end();
    // console.log("sign: ", sign);
    // const signature = sign.sign(privateKey, "hex");
    // const XHashedCanonicalRequest = signature;

    // console.log("signature: ", signature);

    // const stringToSign =
    //   XGoogAlgorithm +
    //   "\n" +
    //   XGoogDate +
    //   "\n" +
    //   XCredentialScope +
    //   "\n" +
    //   XHashedCanonicalRequest;

    // const verify = crypto.createVerify("SHA256");
    // verify.write("some data to sign");
    // verify.end();
    // console.log(verify.verify(publicKey, signature, "hex"));

    // const signedString = crypto.createSign("SHA256");
    // signedString.write(stringToSign);
    // signedString.end();
    // console.log("sign: ", sign);
    // const siggy = signedString.sign(privateKey, "hex");

    // console.log("Google API call! :");
    // console.log(stringToSign);
    // console.log("signedString: ", signedString);
    // console.log("Siggy: ", siggy);

    // let url =
    //   "https://storage.googleapis.com/ceramic-replacement-bucket/0x05E1587afCf321A17a76553BC04C865fbe63AF72/version1?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com%2F20221203%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221203T005933Z&X-Goog-Expires=900&X-Goog-SignedHeaders=host&X-Goog-Signature=";
    // url = url + siggy;

    // console.log("Manual URL: ", url);
    // console.log("Generated URL: ", signedUrl[0]);
    // return ResultAsync.fromPromise(
    //   ajaxUtils.get(new URL(url), undefined).then((innerValue) => {
    //     return innerValue["value"] as Bucket;
    //   }),
    //   (e) => new AjaxError("unable let {addr}", e),
    // ).andThen((po) => {
    //   console.log("bucket: ", po);
    //   return okAsync(po);
    // });
  });
});
