import { RealmQuery, VolatileStorageKey } from "@objects/primitives";

export class VolatileStorageQuery {
  public constructor(
    public idbQuery: {
      index?: VolatileStorageKey;
      query: IDBValidKey | IDBKeyRange;
      direction?: IDBCursorDirection;
      mode?: string;
    },
    public realmQuery: RealmQuery,
  ) {}
}
