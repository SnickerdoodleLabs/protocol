import { Insight, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import { QueryFormatError } from "@snickerdoodlelabs/objects";
import { EligibleReward } from "@snickerdoodlelabs/objects";
import { PersistenceError } from "@snickerdoodlelabs/objects";

export interface IQueryParsingEngine {
  handleQuery(obj: ISDQLQueryObject, cid: IpfsCID): ResultAsync<[Insight[], EligibleReward[]], never | QueryFormatError>
  readLogicEntry(obj: ISDQLQueryObject, cid: IpfsCID, returnOnPermission: boolean): ResultAsync<number | number[] | boolean, never | PersistenceError>
  readQueryEntry(obj: ISDQLQueryObject, cid: IpfsCID, returnOnPermission: boolean): ResultAsync<number, PersistenceError>
  readReturnEntry(obj: ISDQLQueryObject, cid: IpfsCID, returnOnPermission: boolean): ResultAsync<number | boolean, PersistenceError> 
  readLogicCompEntry(obj: ISDQLQueryObject, cid: IpfsCID, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError>
  readCompEntry(obj: ISDQLQueryObject, cid: IpfsCID, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError>
}

export const IQueryParsingEngineType = Symbol.for("IQueryParsingEngine");
