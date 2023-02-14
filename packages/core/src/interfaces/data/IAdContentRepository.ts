import { ResultAsync } from "neverthrow";
import { IpfsCID, IPFSError } from "@snickerdoodlelabs/objects";


export interface IAdContentRepository {
    getRawAdContentByCID(cid: IpfsCID): ResultAsync<any, IPFSError>;
}

export const IAdRepositoryType = Symbol.for("IAdRepository");
