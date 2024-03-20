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
  InvitationForStorage,
  LinkedAccount,
  PersistenceError,
  ReceivingAccountMigrator,
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

export class VectorDBMocks {
  public indexedDBContextProvider: IIndexedDBContextProvider;
  protected logUtils: ILogUtils;
  protected timeUtils: ITimeUtils;

  constructor() {
    this.indexedDBContextProvider = td.object<IIndexedDBContextProvider>();
    this.logUtils = td.object<ILogUtils>();
    this.timeUtils = td.object<ITimeUtils>();

    td.when(this.indexedDBContextProvider.getContext()).thenReturn(
      okAsync({
        db: indexedDataBase1,
      }),
    );

    td.when(
      this.indexedDBContextProvider.setContext({ db: indexedDataBase2 }),
    ).thenReturn(okAsync(undefined));
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
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();
    const result = await vectorDB.initialize();
    const answer = result._unsafeUnwrap();

    expect(answer).toBe(indexedDataBase1);
  });
  test("Initialize by passing in an IIndexedDB", async () => {
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();
    const result = await vectorDB.initialize(indexedDataBase2);
    const answer = result._unsafeUnwrap();

    expect(answer).toBe(indexedDataBase2);
  });
});
describe("VectorDB Fetch Table", () => {
  let instanceDB: IndexedDB;
  beforeEach(() => {
    objectStores = getObjectStoreDefinitions();
    objectStores.set(dummyIndex, dummyTable);
    instanceDB = getIndexDBInstance(objectStores);
  });
  afterEach(async () => {
    await instanceDB.deleteDatabase("SD_Wallet");
    await instanceDB.close();
  });
  test("Fetch Table() works", async () => {
    await instanceDB.initialize();

    for (const dummyData of dummyContractData) {
      await instanceDB.putObject(ERecordKey.OPTED_IN_INVITATIONS, dummyData);
    }

    const mocks = new VectorDBMocks();
    td.when(
      mocks.indexedDBContextProvider.setContext({ db: instanceDB }),
    ).thenReturn(okAsync(undefined));
    td.when(mocks.indexedDBContextProvider.getContext()).thenReturn(
      okAsync({ db: instanceDB }),
    );
    const vectorDB = mocks.factory();

    const init = await vectorDB.initialize(instanceDB);
    const result = await vectorDB.table("SD_OptedInInvitations");

    const answer = await instanceDB.getAll<InvitationForStorage>(
      "SD_OptedInInvitations",
    );
    expect(result._unsafeUnwrap()[0]["data"]["consentContractAddress"]).toBe(
      "0x408e7997bF56a091c0aF82Bf0523B16D2b99e1a8",
    );
  });
});

describe("VectorDB Quantize Table", () => {
  let instanceDB: IndexedDB;

  beforeEach(async () => {
    objectStores = getObjectStoreDefinitions();
    objectStores.set(dummyIndex, dummyTable);
    instanceDB = getIndexDBInstance(objectStores);
  });
  afterEach(async () => {
    await instanceDB.deleteDatabase("SD_Wallet");
    await instanceDB.close();
  });

  test("Quantize Table() works", async () => {
    await instanceDB.initialize();
    for (const dummyData of dummyContractData) {
      await instanceDB.putObject(ERecordKey.OPTED_IN_INVITATIONS, dummyData);
    }
    const mocks = new VectorDBMocks();
    td.when(
      mocks.indexedDBContextProvider.setContext({ db: instanceDB }),
    ).thenReturn(okAsync(undefined));
    td.when(mocks.indexedDBContextProvider.getContext()).thenReturn(
      okAsync({ db: instanceDB }),
    );
    const vectorDB = mocks.factory();
    const init = await vectorDB.initialize(instanceDB);
    const table = await vectorDB.table("SD_OptedInInvitations");

    // just mock it
    const addressMapper = (
      table: {
        data: {
          consentContractAddress: string;
          tokenId: number;
        };
        lastUpdate: number;
        version: number;
        deleted: number;
      }[],
    ): number[][] => {
      const output = table.map((obj) => {
        return [obj.version, obj.deleted, obj.lastUpdate];
      });

      return output;
    };

    const result = await vectorDB.quantizeTable(
      ERecordKey.OPTED_IN_INVITATIONS,
      addressMapper,
    );

    console.log("table result: ", result._unsafeUnwrap());
    expect(result._unsafeUnwrap()[0][0]).toBe(0.9999975867997885);
  });
});

describe("VectorDB Kmeans()", () => {
  test("Kmeans() works", async () => {
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();

    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    const result = await vectorDB.kmeans(data, 4);

    expect(result._unsafeUnwrap().centroids.length).toBe(4);
  });
});

describe("VectorDB Infer()", () => {
  test("Infer() works", async () => {
    const mocks = new VectorDBMocks();
    const vectorDB = mocks.factory();

    const data = [
      [1, 1, 1],
      [1, 2, 1],
      [-1, -1, -1],
      [-1, -1, -1.5],
    ];
    const modelID = (await vectorDB.kmeans(data, 4))._unsafeUnwrap();

    const result = await vectorDB.infer(modelID, [[]]);
    console.log("result: ", result._unsafeUnwrap());
    expect(data).toBe(data);
  });
});
