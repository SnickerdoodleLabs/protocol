import { IpfsCID, SDQLQuery, AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryRepository {
  getByCID(
    cid: IpfsCID,
    timeout?: number,
  ): ResultAsync<SDQLQuery | null, AjaxError>;
}

export const ISDQLQueryRepositoryType = Symbol.for("ISDQLQueryRepository");
