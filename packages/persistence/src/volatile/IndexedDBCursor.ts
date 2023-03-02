import {
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export class IndexedDBCursor<T extends VersionedObject>
  implements IVolatileCursor<T>
{
  private _cursor: IDBCursorWithValue | null = null;

  public constructor(
    protected request: IDBRequest<IDBCursorWithValue | null>,
  ) {}

  public _next(): ResultAsync<
    VolatileStorageMetadata<T> | null,
    PersistenceError
  > {
    const promise = new Promise<VolatileStorageMetadata<T> | null>(
      (resolve, reject) => {
        this.request.onsuccess = (event) => {
          this._cursor = this.request.result;

          if (!this._cursor) {
            resolve(null);
          } else {
            resolve(this._cursor.value as VolatileStorageMetadata<T>);
          }
        };

        this.request.onerror = (event) => {
          reject(new PersistenceError("error reading cursor: " + event.target));
        };
      },
    );

    this._cursor?.continue();
    return ResultAsync.fromPromise(promise, (e) => e as PersistenceError);
  }

  public _all(): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    return this._next().andThen((val) => {
      if (val == null) {
        return okAsync([]);
      }

      return this._all().andThen((vals) => {
        return okAsync([val, ...vals]);
      });
    });
  }

  public nextValue(): ResultAsync<T | null, PersistenceError> {
    return this._next().map((x) => (x == null ? null : x.data));
  }

  public allValues(): ResultAsync<T[], PersistenceError> {
    return this._all().map((values) => {
      return values.map((x) => x.data);
    });
  }
}
