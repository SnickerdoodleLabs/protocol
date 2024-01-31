import "reflect-metadata";
import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  ClickData,
  ClickDataMigrator,
  DatabaseVersion,
  ERecordKey,
  VersionedObject,
} from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { getObjectStoreDefinitions } from "@persistence/database";
import { IndexedDB } from "@persistence/volatile";
import {
  dummyClickData,
  dummyIndex,
  dummyTable,
} from "@persistence-test/mocks";
import { getIndexDBInstance, openDatabase } from "@persistence-test/utils";

let objectStores = getObjectStoreDefinitions();
objectStores.set(dummyIndex, dummyTable);
//TODO will circle back, some refactors had to be reverted ,
//Some tests are bad, but other priorities
describe("IndexedDB tests", () => {
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
  test("correctly initialize the database", async () => {
    await instanceDB.initialize();

    const db = await openDatabase("SD_Wallet");
    const expectedObjectStoresOnDb = [...objectStores.keys()];
    const actualObjectStoreNames = Array.from(db.objectStoreNames);
    db.close();
    expect(actualObjectStoreNames.sort()).toEqual(
      expectedObjectStoresOnDb.sort(),
    );
  });

  describe("Migration Tests", () => {
    test("correctly removes older ACCOUNT object store on migration", async () => {
      await instanceDB.initialize();
      await instanceDB.close();
      objectStores.delete(ERecordKey.ACCOUNT);
      const nextVersionInstance = getIndexDBInstance(
        objectStores,
        DatabaseVersion + 1,
      );

      await nextVersionInstance.initialize();
      await nextVersionInstance.close();
      const db = await openDatabase("SD_Wallet");

      const actualObjectStoreNames = Array.from(db.objectStoreNames);
      const result = actualObjectStoreNames.find(
        (element) => element === ERecordKey.ACCOUNT,
      );
      db.close();
      expect(result).toBeFalsy();
    });

    test("correctly migrates corrupted data of various versions to the final version", async () => {
      await instanceDB.initialize();
      //Fill the table with corrupted data, this can be happen if migration is interrupted
      //Or backup comes with older versions
      for (const dummyData of dummyClickData) {
        await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
      }

      await instanceDB.close();

      //Will trigger the migration, in our case only objects will be updated
      const nextVersionInstance = getIndexDBInstance(
        objectStores,
        DatabaseVersion + 1,
      );
      await nextVersionInstance.initialize();

      const clickData = await nextVersionInstance.getAll(ERecordKey.CLICKS);

      expect(clickData.isErr()).toBeFalsy();
      const result = clickData._unsafeUnwrap();

      await nextVersionInstance.close();

      expect(result.length > 0).toBeTruthy();
      const wrongVersionData = clickData
        ._unsafeUnwrap()
        .find((element) => element.version !== ClickData.CURRENT_VERSION);

      expect(wrongVersionData).toBeFalsy();
    });
  });

  describe("CRUD tests", () => {
    test("correctly uses get all ", async () => {
      await instanceDB.initialize();

      for (const dummyData of dummyClickData) {
        await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
      }

      const readData = await instanceDB.getAll(ERecordKey.CLICKS);
      expect(readData.isErr()).toBeFalsy();
      const result = readData._unsafeUnwrap();

      expect(result.length).toBe(dummyClickData.length);
    });

    test("correctly uses get cursor to get all data", async () => {
      await instanceDB.initialize();

      for (const dummyData of dummyClickData) {
        await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
      }

      const cursor = await instanceDB.getCursor(ERecordKey.CLICKS, "url");
      expect(cursor.isErr()).toBeFalsy();

      const allData = await cursor._unsafeUnwrap().allValues();

      expect(allData.isErr()).toBeFalsy();

      expect(allData.isOk()).toBe(true);
    });
  });
});
