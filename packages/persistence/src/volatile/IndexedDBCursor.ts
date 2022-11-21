import { PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export class IndexedDBCursor<T> implements IVolatileCursor<T> {
  private _cursor: IDBCursorWithValue | null = null;

  public constructor(
    protected request: IDBRequest<IDBCursorWithValue | null>,
  ) {}

  public nextValue(): ResultAsync<T | null, PersistenceError> {
    const promise = new Promise<T | null>((resolve, reject) => {
      this.request.onsuccess = (event) => {
        this._cursor = this.request.result;

        if (!this._cursor) {
          resolve(null);
        } else {
          resolve(this._cursor.value as T);
        }
      };

      this.request.onerror = (event) => {
        reject(new PersistenceError("error reading cursor: " + event.target));
      };
    });

    this._cursor?.continue();
    return ResultAsync.fromPromise(promise, (e) => e as PersistenceError);
  }

  public allValues(): ResultAsync<T[], PersistenceError> {
    return this.nextValue().andThen((val) => {
      if (val == null) {
        return okAsync([]);
      }

      return this.allValues().andThen((vals) => {
        return okAsync([val, ...vals]);
      });
    });
  }
}
