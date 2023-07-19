import {
  IpfsCID,
  DataPermissions,
  SDQL_Return,
  PersistenceError,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { IQueryRepository } from "@query-parser/interfaces/IQueryRepository.js";
import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";

/***
 * Please, don't make this class injectable. It has a very specific usage for the insight platform and may not be usable in application wide use cases
 */
export class CachedQueryRepository implements IQueryRepository {
  constructor(public readonly cache: Map<SDQL_Name, SDQL_Return>) {}
  get(
    cid: IpfsCID,
    q: AST_SubQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    return okAsync(this.cache.get(q.name) ?? SDQL_Return(null));
  }
}
