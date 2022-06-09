import { ResultAsync } from "neverthrow";
import { Observable } from "rxjs";

import { SDQLQuery } from "@objects/businessObjects";
import { UninitializedError } from "@objects/errors";
import {
  CountryCode,
  DataWalletAddress,
  IpfsCID,
  Signature,
} from "@objects/primatives";

export interface IQueryEngine {
  getLoginMessage(countryCode: CountryCode): ResultAsync<string, never>;

  /**
   * login() serves a very important task as it both initializes the Query Engine
   * and establishes the actual address of the data wallet. After getLoginMessage(),
   * this should be the second method you call on the QueryEngine.
   * @param signature
   * @param countryCode
   */
  login(
    signature: Signature,
    countryCode: CountryCode,
  ): ResultAsync<void, never>;

  addAccount(
    signature: Signature,
    countryCode: CountryCode,
  ): ResultAsync<void, UninitializedError>;

  addData(): ResultAsync<void, never>;

  // Called by the form factor to approve the processing of the query.
  // This is basically per-query consent. The consent token will be
  // re-checked, of course (trust nobody!).
  processQuery(queryId: IpfsCID): ResultAsync<void, Error>;

  events: IQueryEngineEvents;
}

export interface IQueryEngineEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQuery>;
}
