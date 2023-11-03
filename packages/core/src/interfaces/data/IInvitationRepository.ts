import {
  EVMContractAddress,
  IOldUserAgreement,
  IpfsCID,
  IPFSError,
  IUserAgreement,
  OptInInfo,
  PersistenceError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IInvitationRepository {
  /**
   * Returns the list of consent contracts that the user has opted in to.
   */
  getAcceptedInvitations(): ResultAsync<OptInInfo[], PersistenceError>;

  /**
   * Adds a list of addresses from the list of addresses the user has opted in to.
   * IMPORTANT: This does not actually opt them in, it just persists the fact
   * @param addressesToAdd
   */
  addAcceptedInvitations(
    acceptedInvitations: OptInInfo[],
  ): ResultAsync<void, PersistenceError>;

  /**
   * Removes a list of addresses from the list of addresses the user has opted in to.
   * IMPORTANT: This does not actually opt them out, it just records the opt-out
   * @param addressesToRemove
   */
  removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError>;

  getInvitationMetadataByCID(
    cid: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, IPFSError>;

  /**
   * Returns a list of consent contract addresses that the user has rejected
   */
  getRejectedInvitations(): ResultAsync<EVMContractAddress[], PersistenceError>;

  /**
   * Adds a list of consent contract addresses to the list of cohorts the user has
   * positively marked as rejected
   */
  addRejectedInvitations(
    consentContractAddresses: EVMContractAddress[],
    rejectUntil: UnixTimestamp | null,
  ): ResultAsync<void, PersistenceError>;
}
export const IInvitationRepositoryType = Symbol.for("IInvitationRepository");
