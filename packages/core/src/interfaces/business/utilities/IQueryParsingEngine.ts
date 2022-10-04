import {
  DataPermissions,
  EligibleReward,
  EvaluationError,
  QueryExpiredError,
  QueryFormatError,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { InsightString } from "@core/interfaces/objects";

export interface IQueryParsingEngine {
  getRewardsPreview (
    query: SDQLQuery,
    dataPermissions: DataPermissions
  ): ResultAsync<
  [] | never,
  EvaluationError | QueryFormatError | QueryExpiredError
  >;
  handleQuery(
    query: SDQLQuery,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    [InsightString[], EligibleReward[]],
    EvaluationError | QueryFormatError
  >;
  
  // readLogicEntry(obj: ISDQLQueryObject, input: string): ResultAsync<number | number[] | boolean, never | PersistenceError>
  // readQueryEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number, PersistenceError>
  // readReturnEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number | boolean, PersistenceError>
  // readLogicCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError>
  // readCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError>
  //generateInsight(obj: ISDQLQueryObject, cid: IpfsCID, data: number | boolean | number[] ): ResultAsync<Insight, never | QueryFormatError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
