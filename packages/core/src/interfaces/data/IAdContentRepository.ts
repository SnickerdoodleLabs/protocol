import { IpfsCID, IPFSError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAdContentRepository {
  getRawAdContentByCID(cid: IpfsCID): ResultAsync<any, IPFSError>;
}

export const IAdRepositoryType = Symbol.for("IAdRepository");
