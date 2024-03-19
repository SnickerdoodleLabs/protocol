import "reflect-metadata";
import {
  ILogUtils,
  ITimeUtils,
  LogUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  ClickData,
  EChain,
  ERecordKey,
  EVMAccountAddress,
  InvitationForStorage,
  LinkedAccount,
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
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import {
  dummyClickData,
  dummyIndex,
  dummyContractData,
  dummyQuestionnaireData,
  dummyQuestionnaireHistory,
  dummyTable,
} from "@vector-db-test/mocks";
import { getIndexDBInstance, openDatabase } from "@vector-db-test/utils";

let objectStores = getObjectStoreDefinitions();
objectStores.set(dummyIndex, dummyTable);
const currentTime = 1706029234;

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
    console.log("answer: ", answer._unsafeUnwrap());
    console.log("table result: ", result._unsafeUnwrap());
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

    const contractMapper = (
      row: { consentContractAddress: string; tokenId: string }[],
    ): EVMAccountAddress[] => {
      /*
        1. wrap contract address in contracts sdk type
        2. use contracts-sdk handle to fetch from block chain current tags associated with contract
        this is using ethers to make an rpc call to infura to ready contract attributes
        3. word2vec on the tag strings associated with the contract
      */
      row.map((value) => {
        // wrap up as contracts-sdk
        const val = new ConsentContract(value.consentContractAddress);
      });

      row.forEach((element) => {
        if (isNaN(element)) {
          return element;
        }
        return element as number;
      });
      // const arr: Object[] = [];

      return row;
    };

    const result = await vectorDB.quantizeTable(
      ERecordKey.OPTED_IN_INVITATIONS,
      contractMapper,
    );

    console.log("table result: ", result._unsafeUnwrap());
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

    console.log("result: ", result._unsafeUnwrap());
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
