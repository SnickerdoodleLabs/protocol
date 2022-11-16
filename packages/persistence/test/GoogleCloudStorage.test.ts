import "reflect-metadata";

import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { Storage } from "@google-cloud/storage";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  CountryCode,
  DataPermissions,
  ERewardType,
  EvaluationError,
  ExpectedReward,
  Gender,
  HexString32,
  IDataWalletPersistence,
  IpfsCID,
  QueryExpiredError,
  QueryFormatError,
  QueryIdentifier,
  SDQLQuery,
  SDQLString,
  URLString,
  IChainTransaction,
  SDQL_Return,
  ChainId,
} from "@snickerdoodlelabs/objects";
import {
  avalanche1ExpiredSchemaStr,
  avalanche2SchemaStr,
  avalanche4SchemaStr,
  IQueryObjectFactory,
  ISDQLQueryWrapperFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
  AST,
} from "@snickerdoodlelabs/query-parser";
import { Express } from "express";
import {
  OAuth2Client,
  GoogleAuth,
  DownscopedClient,
} from "google-auth-library";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";
import { BaseOf } from "ts-brand";

import { ICloudStorageType } from "@persistence/cloud";
import { IPersistenceConfigProvider } from "@persistence/IPersistenceConfigProvider";

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });

    console.log("storage: ", storage);

    const [files] = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles();
    console.log("Files: ", files);

    const data = "this is a test";

    await fsPromises.writeFile("testing123.txt", data, {
      flag: "w",
    });

    storage.bucket("ceramic-replacement-bucket").upload("testing.txt");

    // console.log("buckets: ", buckets);

    // const googleAuth = new GoogleAuth({
    //     scopes: 'https://www.googleapis.com/auth/cloud-platform',
    //   });
    //   const projectId = await googleAuth.getProjectId();
    //   // Obtain an authenticated client via ADC.
    //   const client = await googleAuth.getClient();
    //   // Use the client to generate a DownscopedClient.
    //   const cabClient = new DownscopedClient(client, cab);

    //   // OAuth 2.0 Client
    //   const authClient = new OAuth2Client();
    //   // Define a refreshHandler that will be used to refresh the downscoped token
    //   // when it expires.
    //   authClient.refreshHandler = async () => {
    //     const refreshedAccessToken = await cabClient.getAccessToken();
    //     return {
    //       access_token: refreshedAccessToken.token,
    //       expiry_date: refreshedAccessToken.expirationTime,
    //     };
    //   };

    //   const storageOptions = {
    //     projectId,
    //     authClient: new GoogleAuth({authClient}),
    //   };

    //   const storage = new Storage(storageOptions);
    //   const downloadFile = await storage
    //     .bucket(bucketName)
    //     .file(objectName)
    //     .download();
    //   console.log('Successfully retrieved file. Contents:');
    //   console.log(downloadFile.toString('utf8'));
    // }

    // console.log("After STORAGE");

    // storage.getBuckets();

    // const bucketName = "ceramic-replacement-bucket";

    // // The path to your file to upload
    // const filePath = ".";

    // // The new ID for your GCS file
    // const destFileName = "ABC123_address.txt";

    // const options = {
    //   destination: destFileName,
    //   // Optional:
    //   // Set a generation-match precondition to avoid potential race conditions
    //   // and data corruptions. The request to upload is aborted if the object's
    //   // generation number does not match your precondition. For a destination
    //   // object that does not yet exist, set the ifGenerationMatch precondition to 0
    //   // If the destination object already exists in your bucket, set instead a
    //   // generation-match precondition using its generation number.
    //   preconditionOpts: { ifGenerationMatch: 0 },
    // };

    // storage.bucket(bucketName).upload(filePath, options);
    // console.log(`${filePath} uploaded to ${bucketName}`);

    console.log("bucket is connected!");
  });
});
