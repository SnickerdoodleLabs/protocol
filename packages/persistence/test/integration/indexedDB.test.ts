import "reflect-metadata";
import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  DatabaseVersion,
  ERecordKey,
  VersionedObject,
} from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { getObjectStoreDefinitions } from "@persistence/database";
import { IndexedDB } from "@persistence/volatile";
import { getIndexDBInstance, openDatabase } from "@persistence-test/utils";

let objectStores = getObjectStoreDefinitions();

describe("IndexedDB tests", () => {
  let instanceDB: IndexedDB;
  beforeEach(() => {
    objectStores = getObjectStoreDefinitions();
    instanceDB = getIndexDBInstance(objectStores);
  });
  afterEach(async () => {
    await instanceDB.clear();
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
  });
});
