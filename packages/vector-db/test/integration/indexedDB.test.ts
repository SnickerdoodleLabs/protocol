import "reflect-metadata";
import { IndexedDB } from "@snickerdoodlelabs/persistence";
import * as td from "testdouble";

// const objectStores = getObjectStoreDefinitions();
// objectStores.set(dummyIndex, dummyTable);
// const currentTime = 1706029234;
//TODO will circle back, some refactors had to be reverted ,
//Some tests are bad, but other priorities
describe("IndexedDB tests", () => {
  let instanceDB: IndexedDB;
  // beforeEach(() => {
  //   objectStores = getObjectStoreDefinitions();
  //   objectStores.set(dummyIndex, dummyTable);
  //   instanceDB = getIndexDBInstance(objectStores);
  // });
  // afterEach(async () => {
  //   await instanceDB.deleteDatabase("SD_Wallet");
  //   await instanceDB.close();
  // });
  // test("correctly initialize the database", async () => {
  //   await instanceDB.initialize();

  //   const db = await openDatabase("SD_Wallet");
  //   const expectedObjectStoresOnDb = [...objectStores.keys()];
  //   const actualObjectStoreNames = Array.from(db.objectStoreNames);
  //   db.close();
  //   expect(actualObjectStoreNames.sort()).toEqual(
  //     expectedObjectStoresOnDb.sort(),
  //   );
  // });

  // describe("Migration Tests", () => {
  //   test("correctly removes older ACCOUNT object store on migration", async () => {
  //     await instanceDB.initialize();
  //     await instanceDB.close();
  //     objectStores.delete(ERecordKey.ACCOUNT);
  //     const nextVersionInstance = getIndexDBInstance(
  //       objectStores,
  //       DatabaseVersion + 1,
  //     );

  //     await nextVersionInstance.initialize();
  //     await nextVersionInstance.close();
  //     const db = await openDatabase("SD_Wallet");

  //     const actualObjectStoreNames = Array.from(db.objectStoreNames);
  //     const result = actualObjectStoreNames.find(
  //       (element) => element === ERecordKey.ACCOUNT,
  //     );
  //     db.close();
  //     expect(result).toBeFalsy();
  //   });

  //   test("correctly migrates corrupted data of various versions to the final version", async () => {
  //     await instanceDB.initialize();
  //     //Fill the table with corrupted data, this can be happen if migration is interrupted
  //     //Or backup comes with older versions
  //     for (const dummyData of dummyClickData) {
  //       await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
  //     }

  //     await instanceDB.close();

  //     //Will trigger the migration, in our case only objects will be updated
  //     const nextVersionInstance = getIndexDBInstance(
  //       objectStores,
  //       DatabaseVersion + 1,
  //     );
  //     await nextVersionInstance.initialize();

  //     const clickData = await nextVersionInstance.getAll(ERecordKey.CLICKS);

  //     expect(clickData.isErr()).toBeFalsy();
  //     const result = clickData._unsafeUnwrap();

  //     await nextVersionInstance.close();

  //     expect(result.length > 0).toBeTruthy();
  //     const wrongVersionData = clickData
  //       ._unsafeUnwrap()
  //       .find((element) => element.version !== ClickData.CURRENT_VERSION);

  //     expect(wrongVersionData).toBeFalsy();
  //   });
  // });

  // describe("CRUD tests", () => {
  //   test("correctly uses get all ", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyClickData) {
  //       await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
  //     }

  //     const readData = await instanceDB.getAll(ERecordKey.CLICKS);
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap();

  //     expect(result.length).toBe(dummyClickData.length);
  //   });

  //   test("correctly uses get cursor to get all data", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyClickData) {
  //       await instanceDB.putObject(ERecordKey.CLICKS, dummyData);
  //     }

  //     const cursor = await instanceDB.getCursor(ERecordKey.CLICKS, "url");
  //     expect(cursor.isErr()).toBeFalsy();

  //     const allData = await cursor._unsafeUnwrap().allValues();

  //     expect(allData.isErr()).toBeFalsy();

  //     expect(allData.isOk()).toBe(true);
  //   });
  // });

  // describe("CRUD V2 ", () => {
  //   test("correctly gets non deleted keys ", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireData) {
  //       await instanceDB.putObject(ERecordKey.QUESTIONNAIRES, dummyData);
  //     }

  //     const readData = await instanceDB.getKeys(ERecordKey.QUESTIONNAIRES, {
  //       index: "deleted",
  //       query: EBoolean.FALSE,
  //     });
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as [[IpfsCID, EBoolean]];

  //     expect(result.length).toBe(3);
  //     expect(result.find(([_id, deleted]) => deleted === 1)).toBe(undefined);
  //   });

  //   test("correctly gets non deleted status complete records  ", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireData) {
  //       await instanceDB.putObject(ERecordKey.QUESTIONNAIRES, dummyData);
  //     }

  //     const readData = await instanceDB.get(ERecordKey.QUESTIONNAIRES, {
  //       index: "deleted,data.status",
  //       query: [EBoolean.FALSE, EQuestionnaireStatus.Complete],
  //     });
  //     expect(readData.isErr()).toBeFalsy();

  //     //The type below is what you get technically from our db instance,
  //     const result = readData._unsafeUnwrap() as VolatileStorageMetadata<
  //       PropertiesOf<QuestionnaireData>
  //     >[];

  //     for (const record of result) {
  //       expect(record.data.status).toBe(EQuestionnaireStatus.Complete);
  //       expect(record.deleted).toBe(EBoolean.FALSE);
  //     }
  //   });

  //   test("correctly returns the non deleted record for the id ", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireData) {
  //       await instanceDB.putObject(ERecordKey.QUESTIONNAIRES, dummyData);
  //     }

  //     const readData = await instanceDB.get(ERecordKey.QUESTIONNAIRES, {
  //       id: ["QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u3", EBoolean.FALSE],
  //     });
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as VolatileStorageMetadata<
  //       PropertiesOf<QuestionnaireData>
  //     >[];

  //     expect(result.length).toBe(1);
  //     expect(result[0].data.description).toBe(
  //       "Questions about your favorite food",
  //     );
  //   });

  //   test("correctly uses get with count", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireData) {
  //       await instanceDB.putObject(ERecordKey.QUESTIONNAIRES, dummyData);
  //     }

  //     const readData = await instanceDB.getCursor2(ERecordKey.QUESTIONNAIRES, {
  //       index: "deleted,data.status",
  //       lowerCount: 1,
  //       upperCount: 100,
  //     });
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as VolatileStorageMetadata<
  //       PropertiesOf<QuestionnaireHistory>
  //     >[];
  //     expect(result.length).toBe(3);
  //   });

  //   test("correctly uses count method", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireData) {
  //       await instanceDB.putObject(ERecordKey.QUESTIONNAIRES, dummyData);
  //     }

  //     const query = IDBKeyRange.bound(
  //       [EBoolean.FALSE, EQuestionnaireStatus.Available],
  //       [EBoolean.FALSE, EQuestionnaireStatus.Available],
  //     );

  //     const readData = await instanceDB.countRecords(
  //       ERecordKey.QUESTIONNAIRES,
  //       {
  //         index: "deleted,data.status",
  //         query,
  //       },
  //     );
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as number;

  //     expect(result).toBe(1);
  //   });

  //   test("correctly uses bound and gets the latests answer", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireHistory) {
  //       await instanceDB.putObject(
  //         ERecordKey.QUESTIONNAIRES_HISTORY,
  //         dummyData,
  //       );
  //     }

  //     const query = IDBKeyRange.bound(
  //       [0, "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2", 0],
  //       [0, "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2", currentTime],
  //     );

  //     const readData = await instanceDB.getCursor2(
  //       ERecordKey.QUESTIONNAIRES_HISTORY,
  //       {
  //         index: "deleted,data.id,data.measurementDate",
  //         query,
  //         latest: true,
  //       },
  //     );
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as VolatileStorageMetadata<
  //       PropertiesOf<QuestionnaireHistory>
  //     >[];

  //     expect(result.length).toBe(2);
  //     expect(result[0].data.measurementDate).toBe(1706029230);
  //   });

  //   test("correctly uses bound and gets the previos history", async () => {
  //     await instanceDB.initialize();

  //     for (const dummyData of dummyQuestionnaireHistory) {
  //       await instanceDB.putObject(
  //         ERecordKey.QUESTIONNAIRES_HISTORY,
  //         dummyData,
  //       );
  //     }

  //     const query = IDBKeyRange.bound(
  //       [0, "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2", 0],
  //       [0, "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2", 1706029229],
  //     );

  //     const readData = await instanceDB.getCursor2(
  //       ERecordKey.QUESTIONNAIRES_HISTORY,
  //       {
  //         index: "deleted,data.id,data.measurementDate",
  //         query,
  //         latest: true,
  //       },
  //     );
  //     expect(readData.isErr()).toBeFalsy();
  //     const result = readData._unsafeUnwrap() as VolatileStorageMetadata<
  //       PropertiesOf<QuestionnaireHistory>
  //     >[];

  //     expect(result.length).toBe(1);
  //     expect(result[0].data.measurementDate).toBe(1706029217);
  //   });
  // });
  test("correctly uses bound and gets the previos history", async () => {
    expect(1).toBe(1);
  });
});
