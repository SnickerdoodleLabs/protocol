import {
  PersistenceError,
  VersionedObject,
  VolatileStorageKey,
  ERecordKey,
  VolatileStorageQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export interface IVolatileStorage {
  persist(): ResultAsync<boolean, PersistenceError>;
  clearObjectStore(recordKey: ERecordKey): ResultAsync<void, PersistenceError>;

  putObject<T extends VersionedObject>(
    name: ERecordKey,
    obj: T,
  ): ResultAsync<void, PersistenceError>;
  removeObject<T extends VersionedObject>(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError>;

  getObject<T extends VersionedObject>(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError>;
  getCursor<T extends VersionedObject>(
    name: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError>;
  getAll<T extends VersionedObject>(
    name: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError>;
  getAllKeys<T>(
    name: ERecordKey,
    query?: VolatileStorageQuery,
  ): ResultAsync<T[], PersistenceError>;
}

export const IVolatileStorageType = Symbol.for("IVolatileStorage");
