import { VolatileStorageKey } from "@snickerdoodlelabs/objects";

export interface VolatileStorageQuery {
  idbQuery: {
    index: VolatileStorageKey;
    query: IDBValidKey | IDBKeyRange;
    direction?: IDBCursorDirection;
  };
  realmQuery: string;
}
