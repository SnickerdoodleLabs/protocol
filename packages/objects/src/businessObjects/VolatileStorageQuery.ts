import { VolatileStorageKey } from "@objects/primitives";

export interface VolatileStorageQuery {
  idbQuery: {
    index?: VolatileStorageKey;
    query: IDBValidKey | IDBKeyRange;
    direction?: IDBCursorDirection;
    mode?: string;
  };
  realmQuery: string;
}
