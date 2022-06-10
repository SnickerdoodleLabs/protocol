import { IpfsCID, SDQLQuery } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryRepository {
    getByCID(cids: IpfsCID[]): ResultAsync<Map<IpfsCID, SDQLQuery>, never>;
}

export const ISDQLQueryRepositoryType = Symbol.for("ISDQLQueryRepository");