import "reflect-metadata";
import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import * as td from "testdouble";

import { getObjectStoreDefinitions } from "@persistence/database";
import { IndexedDB } from "@persistence/volatile";
import { openDatabase } from "@persistence-test/utils";

const objectStores = getObjectStoreDefinitions();

describe("IndexedDB tests", () => {
  let instanceDB: IndexedDB;
  beforeEach(() => {
    instanceDB = new IndexedDB(
      "SD_Wallet",
      Array.from(objectStores.values()),
      indexedDB,
      new LogUtils(),
      new TimeUtils(),
    );
  });
  afterEach(async () => {
    await instanceDB?.clear();
  });
  test("correctly initialize the database", async () => {
    await instanceDB.initialize();

    const db = await openDatabase("SD_Wallet");
    const expectedObjectStoresOnDb = [...objectStores.keys()];
    const actualObjectStoreNames = Array.from(db.objectStoreNames);

    expect(actualObjectStoreNames.sort()).toEqual(
      expectedObjectStoresOnDb.sort(),
    );
  });
});
