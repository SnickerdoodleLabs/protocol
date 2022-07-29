import {
  EligibleReward,
  Insight,
  QueryFormatError,
  SDQLQuery,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { InsightString } from "@core/interfaces/objects";

export interface IQueryParsingEngine {
  handleQuery(
    query: SDQLQuery,
  ): ResultAsync<[InsightString[], EligibleReward[]], never | QueryFormatError>;
  // readLogicEntry(obj: ISDQLQueryObject, input: string): ResultAsync<number | number[] | boolean, never | PersistenceError>
  // readQueryEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number, PersistenceError>
  // readReturnEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number | boolean, PersistenceError>
  // readLogicCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError>
  // readCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError>
  //generateInsight(obj: ISDQLQueryObject, cid: IpfsCID, data: number | boolean | number[] ): ResultAsync<Insight, never | QueryFormatError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
