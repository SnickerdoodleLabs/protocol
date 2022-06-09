import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

import { IpfsCID } from "..";

import { SDQLQuery } from "@objects/SDQLQuery";

export interface IQueryEngine {
  initialize(): ResultAsync<void, never>;
  addData(): ResultAsync<void, never>;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(queryId: IpfsCID): ResultAsync<void, Error>;

  onQueryPosted: Observable<SDQLQuery>;
}
