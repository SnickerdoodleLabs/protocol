import {
  IpfsCID,
  SDQLQuery,
  AjaxError,
  QueryStatus,
  PersistenceError,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryRepository {
  /**
   * This returns all the QueryStatus objects we know about that have been received since
   * queryHorizon (a block number representing the farthest back we need to check)
   * @param queryHorizon The oldest block we need to check back to. This is a property of the consent contract.
   */
  getQueryStatusByConsentContract(
    consentContractAddress: EVMContractAddress,
    queryHorizon: number,
  ): ResultAsync<QueryStatus[], PersistenceError>;

  upsertQueryStatus(
    queryStatus: QueryStatus,
  ): ResultAsync<void, PersistenceError>;

  getSDQLQueryByCID(
    cid: IpfsCID,
    timeout?: number,
  ): ResultAsync<SDQLQuery | null, AjaxError>;
}

export const ISDQLQueryRepositoryType = Symbol.for("ISDQLQueryRepository");
