import { IpfsCID, SDQLQuery } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { IPFSError } from "@browser-extension/../../objects/src/errors/IPFSError";

export interface ISDQLQueryRepository {
  getByCID(cids: IpfsCID): ResultAsync<Map<IpfsCID, SDQLQuery>, IPFSError | null>;

}

export const ISDQLQueryRepositoryType = Symbol.for("ISDQLQueryRepository");
