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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });

    const [files] = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles();
    console.log("Files: ", files.length);

    const data = "this is a test";

    // const [files] = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .getFiles();

    await fsPromises.writeFile("testing123.txt", data, {
      flag: "w",
    });

    storage.bucket("ceramic-replacement-bucket").upload("testing.txt");

    console.log("bucket is connected!");
  });
});
