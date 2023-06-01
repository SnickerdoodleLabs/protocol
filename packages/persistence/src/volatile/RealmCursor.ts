import { VersionedObject, PersistenceError } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IVolatileCursor } from "@persistence/volatile/IVolatileCursor.js";

export class RealmCursor<T extends VersionedObject>
  implements IVolatileCursor<T>
{
  private position = 0;
  public constructor(private results: T[]) {}

  public nextValue(): ResultAsync<T | null, PersistenceError> {
    if (this.position < this.results.length) {
      const val = this.results[this.position];
      this.position += 1;
      return okAsync(val);
    }
    return okAsync(null);
  }

  public allValues(): ResultAsync<T[] | null, PersistenceError> {
    if (this.position < this.results.length) {
      return okAsync(this.results.slice(this.position));
    }
    return okAsync(null);
  }
}
