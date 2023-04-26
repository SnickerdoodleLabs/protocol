import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  JSONString,
  PersistenceError,
  VersionedObject,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { ok, okAsync, ResultAsync } from "neverthrow";

import { IAsyncStorageWrapper } from "@persistence/volatile/IAsyncStorageWrapper.js";
import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export class AsyncStorageCursor<T extends VersionedObject>
  implements IVolatileCursor<T>
{
//   private ordered: (string | number)[];
//   private currValue: number;
//   private currIter: IterableIterator<string> | undefined;

  public constructor(
    // protected asyncStorage: IAsyncStorageWrapper,
    // protected index: Map<string | number, Set<string>>,
    // protected query?: string | number,
    // protected direction?: IDBCursorDirection | undefined,
  ) {
    // this.ordered = Array.from(index.keys()).sort();
    // if (this.query != undefined) {
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   this.currValue = this.ordered.indexOf(query!);
    //   this.currIter = this.index.get(this.query)?.keys();
    // } else {
    //   if (this.direction == undefined || this.direction.startsWith("next")) {
    //     this.currValue = 0;
    //   } else {
    //     this.currValue = this.ordered.length - 1;
    //   }

    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   this.currIter = this.index.get(this.ordered[this.currValue])!.keys();
    // }
  }

  public nextValue(): ResultAsync<T | null, PersistenceError> {
    return okAsync(null);
    // if (this.currIter == null) {
    //   return okAsync(null);
    // }

    // if (this.query != undefined) {
    //   return this._getNext();
    // }

    // if (this.direction == "nextunique" || this.direction == "prevunique") {
    //   return this._nextValue();
    // }

    // const next = this.currIter.next();
    // if (next.done) {
    //   return this._nextValue();
    // }

    // const hash = next.value;
    // return this.asyncStorage.getItem(hash).map((val) => {
    //   if (val == null) {
    //     return null;
    //   }
    //   return ObjectUtils.deserialize<T>(JSONString(val));
    // });
  }

  private _getNext(): ResultAsync<T | null, PersistenceError> {
    if (this.currIter == undefined) {
      return okAsync(null);
    } else {
      const nextKey = this.currIter.next();
      if (nextKey.done) {
        return okAsync(null);
      }

      const hash = nextKey.value;
      return this.asyncStorage.getItem(hash).map((val) => {
        if (val == null) {
          return null;
        }
        return ObjectUtils.deserialize<T>(JSONString(val));
      });
    }
  }

  private _nextValue(): ResultAsync<T | null, PersistenceError> {
    if (this.currValue == 0 || this.currValue == this.ordered.length - 1) {
      return okAsync(null);
    }

    if (this.direction == undefined || this.direction.startsWith("next")) {
      this.currValue += 1;
      this.currIter = undefined;
      return this._getNext();
    } else {
      this.currValue -= 1;
      this.currIter = undefined;
      return this._getNext();
    }
  }

  public allValues(): ResultAsync<T[] | null, PersistenceError> {
    return okAsync([]);
    // not being used except for non-unique query lookups so this logic is a bit hacky
    // if (this.currIter == undefined) {
    //   return okAsync(null);
    // } else {
    //   const keys = [...this.currIter].map(([a, b]) => a);
    //   return this.asyncStorage.getItems(keys).map((vals) => {
    //     return Array.from(vals.values())
    //       .filter((x) => {
    //         return x != null;
    //       })
    //       .map((str) => {
    //         return ObjectUtils.deserialize<T>(JSONString(str as string));
    //       });
    //   });
    // }
  }

  public _next(): ResultAsync<
    VolatileStorageMetadata<T> | null,
    PersistenceError
  > {
    throw new Error("Method not implemented.");
  }

  public _all(): ResultAsync<VolatileStorageMetadata<T>[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
