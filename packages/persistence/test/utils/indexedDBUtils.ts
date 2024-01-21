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
