import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import { QueryFormatError } from "@snickerdoodlelabs/objects";
import { EligibleReward } from "@snickerdoodlelabs/objects";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { SDQLQuery } from "@snickerdoodlelabs/objects";

export interface IQueryParsingEngine {
  handleQuery(query: SDQLQuery): ResultAsync<[Insight[], EligibleReward[]], never | QueryFormatError>
  readLogicEntry(obj: ISDQLQueryObject, input: string): ResultAsync<number | number[] | boolean, never | PersistenceError>
  readQueryEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number, PersistenceError>
  readReturnEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number | boolean, PersistenceError> 
  readLogicCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError>
  readCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError>
  //generateInsight(obj: ISDQLQueryObject, cid: IpfsCID, data: number | boolean | number[] ): ResultAsync<Insight, never | QueryFormatError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");