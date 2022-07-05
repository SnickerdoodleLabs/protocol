import { IpfsCID, SDQLQuery, IPFSError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryRepository {
  getByCID(cid: IpfsCID): ResultAsync<SDQLQuery | null, IPFSError>;
}

export const ISDQLQueryRepositoryType = Symbol.for("ISDQLQueryRepository");
