import "reflect-metadata";
import {
  ILogUtils,
  ITimeUtils,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  ClickData,
  EChain,
  ERecordKey,
  EVMAccountAddress,
  EVMContractAddress,
  IIndexedDB,
  InvitationForStorage,
  LinkedAccount,
  PersistenceError,
  QuantizedTableId,
  ReceivingAccountMigrator,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import {
  IIndexedDBContextProvider,
  DBContextProvider,
  VolatileStorageSchemaProvider,
  IndexedDB,
  VolatileTableIndex,
  getObjectStoreDefinitions,
} from "@snickerdoodlelabs/persistence";
import { VectorDB } from "@snickerdoodlelabs/vector-db";
import { ethers } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

import {
  dummyIndex,
  dummyContractData,
  dummyTable,
} from "@vector-db-test/mocks";
import { getIndexDBInstance } from "@vector-db-test/utils";

let objectStores = getObjectStoreDefinitions();
objectStores.set(dummyIndex, dummyTable);

const indexedDataBase1 = new IndexedDB(
  "SD_Wallet",
  [
    new VolatileTableIndex(
      ERecordKey.ACCOUNT,
      ["sourceAccountAddress", false],
      new ReceivingAccountMigrator(),
      1,
      60000,
      0,
      [["sourceChain", false]],
    ),
  ],
  indexedDB,
  new LogUtils(),
  new TimeUtils(),
  1,
);

const indexedDataBase2 = new IndexedDB(
  "Outside_Wallet",
  [],
  indexedDB,
  new LogUtils(),
  new TimeUtils(),
  1,
);

const addressMapper = (
  row: VolatileStorageMetadata<VersionedObject>,
): number[] => {
  return [row.version, row.deleted, row.lastUpdate];
};

export class VectorDBMocks {
  public indexedDBContextProvider: IIndexedDBContextProvider;
  protected logUtils: ILogUtils;
  protected timeUtils: ITimeUtils;
  public instanceDB: IIndexedDB;

  constructor() {
    this.indexedDBContextProvider = td.object<IIndexedDBContextProvider>();
    this.logUtils = td.object<ILogUtils>();
    this.timeUtils = td.object<ITimeUtils>();
    this.instanceDB = td.object<IIndexedDB>();

    objectStores = getObjectStoreDefinitions();
    objectStores.set(dummyIndex, dummyTable);
    this.instanceDB = getIndexDBInstance(objectStores);

    this.instanceDB.initialize();
    for (const dummyData of dummyContractData) {
      this.instanceDB.putObject(ERecordKey.OPTED_IN_INVITATIONS, dummyData);
    }

    td.when(
      this.indexedDBContextProvider.setContext({ db: this.instanceDB }),
    ).thenReturn(okAsync(undefined));
    td.when(this.indexedDBContextProvider.getContext()).thenReturn(
      okAsync({ db: this.instanceDB }),
    );
  }

  public factory() {
    return new VectorDB(
      this.indexedDBContextProvider,
      this.logUtils,
      this.timeUtils,
    );
  }
}

describe("VectorDB Initialization tests", () => {
  test("Init()", async () => {
    // arrange
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();

    // act
    const result = await vectorDB.initialize();
    const answer = result._unsafeUnwrap();

    // assert
    expect(answer).toBe(mocks.instanceDB);
  });
  test("Initialize by passing in an IIndexedDB", async () => {
    // arrange
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();

    // act
    const result = await vectorDB.initialize(mocks.instanceDB);
    const answer = result._unsafeUnwrap();

    // assert
    expect(answer).toBe(mocks.instanceDB);
  });
});
describe("VectorDB Fetch Table", () => {
  test("Fetch Table() works", async () => {
    // arrange
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();

    // act
    const init = await vectorDB.initialize(mocks.instanceDB);
    const result = await vectorDB.table("SD_OptedInInvitations");

    // assert
    expect(result._unsafeUnwrap()[0]["data"]["consentContractAddress"]).toBe(
      "0x408e7997bF56a091c0aF82Bf0523B16D2b99e1a8",
    );
  });
});

describe("VectorDB Quantize Table", () => {
  test("Quantize Table() works", async () => {
    // arrange
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();
    const table = await vectorDB.table("SD_OptedInInvitations");

    // act
    const result = await vectorDB.quantizeTable(
      [ERecordKey.OPTED_IN_INVITATIONS],
      [addressMapper],
      QuantizedTableId("QuantizedData"),
    );

    // assert
    expect(result._unsafeUnwrap().table()[0][0]).toBeLessThanOrEqual(1);

    const kmeansData = await vectorDB.kmeans(
      QuantizedTableId("QuantizedData"),
      2,
    );
    expect(kmeansData._unsafeUnwrap().centroids.length).toBe(2);
  });
});
