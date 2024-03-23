import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  ERecordKey,
  VersionedObject,
  DatabaseVersion,
} from "@snickerdoodlelabs/objects";
import { VolatileTableIndex, IndexedDB } from "@snickerdoodlelabs/persistence";

export const openDatabase = (
  dbName: string,
  version?: number,
): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject("IndexedDB opening failed");
    };
  });
};
export const getObjectStore = (
  db: IDBDatabase,
  storeName: string,
  transactionMode: IDBTransactionMode,
): IDBObjectStore => {
  const transaction = db.transaction(storeName, transactionMode);
  const objectStore = transaction.objectStore(storeName);
  return objectStore;
};

export const getIndexDBInstance = (
  objectStore: Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
  version?: number,
) =>
  new IndexedDB(
    "SD_Wallet",
    Array.from(objectStore.values()),
    indexedDB,
    new LogUtils(),
    new TimeUtils(),
    version ?? DatabaseVersion,
  );
