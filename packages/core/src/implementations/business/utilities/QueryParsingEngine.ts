import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  Insight,
  ISDQLQueryObject,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
  ) {}

  public handleQuery(obj: ISDQLQueryObject): ResultAsync<Insight[], never> {
    return okAsync([]);
  }
}
