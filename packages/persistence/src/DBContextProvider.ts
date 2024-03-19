import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IIndexedDB, PersistenceError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IIndexedDBContext } from "@persistence/IIndexedDBContext.js";
import { IIndexedDBContextProvider } from "@persistence/IIndexedDBContextProvider.js";
import { IndexedDB } from "@persistence/volatile/IndexedDB.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";

@injectable()
export class DBContextProvider implements IIndexedDBContextProvider {
  //   protected db: IIndexedDB;
  protected db: ResultAsync<IIndexedDBContext, never> | null = null;

  public constructor(
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(IVolatileStorageSchemaProviderType)
    protected schemaProvider: IVolatileStorageSchemaProvider,
  ) {
    this.db = this.schemaProvider.getVolatileStorageSchema().map((schema) => {
      return {
        db: new IndexedDB(
          "SD_Wallet",
          Array.from(schema.values()),
          indexedDB,
          this.logUtils,
          this.timeUtils,
          3,
        ),
      };
    });
  }

  public getContext(): ResultAsync<IIndexedDBContext, PersistenceError> {
    if (this.db != null) {
      return this.db;
    }

    return errAsync(
      new PersistenceError("Indexed DB context is not retrieved"),
    );
  }

  public setContext(
    dbContext: IIndexedDBContext,
  ): ResultAsync<void, PersistenceError> {
    // this.db = dbContext;
    // return okAsync(undefined);

    if (this.db != null) {
      this.db = okAsync(dbContext);
    }

    return errAsync(
      new PersistenceError("Indexed DB context is not retrieved"),
    );
  }
}
