import {
  DomainName,
  InvitationDomain,
  IOpenSeaMetadata,
  IpfsCID,
  IPFSError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationRepository {
  getInvitationDomainByCID(
    cid: IpfsCID,
    domain: DomainName,
  ): ResultAsync<InvitationDomain | null, IPFSError>;
  getInvitationMetadataByCID(
    cid: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError>;
}
export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
