import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  InvitationForStorage,
  IOldUserAgreement,
  IpfsCID,
  IPFSError,
  IUserAgreement,
  OptInInfo,
  PersistenceError,
  RejectedInvitation,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  IInvitationRepository,
} from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  protected cache = new Map<IpfsCID, IOldUserAgreement | IUserAgreement>();

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAcceptedInvitations(): ResultAsync<OptInInfo[], PersistenceError> {
    return this.persistence
      .getAll<InvitationForStorage>(ERecordKey.OPTED_IN_INVITATIONS)
      .map((storedInvitations) => {
        if (storedInvitations == null) {
          return [];
        }

        return storedInvitations.map((storedInvitation) => {
          return InvitationForStorage.toInvitation(storedInvitation);
        });
      });
  }

  public addAcceptedInvitations(
    acceptedInvitations: OptInInfo[],
  ): ResultAsync<void, PersistenceError> {
    const invitations = acceptedInvitations.map((invitation) => {
      return InvitationForStorage.fromOptInInfo(invitation);
    });
    return ResultUtils.combine(
      invitations.map((invitation) => {
        return this.persistence.updateRecord(
          ERecordKey.OPTED_IN_INVITATIONS,
          invitation,
        );
      }),
    ).map(() => {});
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      addressesToRemove.map((addressToRemove) => {
        return this.persistence.deleteRecord(
          ERecordKey.OPTED_IN_INVITATIONS,
          addressToRemove,
        );
      }),
    ).map(() => {});
  }

  public getInvitationMetadataByCID(
    cid: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, IPFSError> {
    const cached = this.cache.get(cid);
    if (cached != null) {
      return okAsync(cached);
    }
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const ipfsUrl = urlJoin(config.ipfsFetchBaseUrl, cid);
        return this.ajaxUtil
          .get<IOldUserAgreement | IUserAgreement>(new URL(ipfsUrl))
          .map((metadata) => {
            this.cache.set(cid, metadata);
            return metadata;
          });
      })

      .orElse((err) => {
        return errAsync(new IPFSError((err as Error).message, err));
      });
  }

  public addRejectedInvitations(
    consentContractAddresses: EVMContractAddress[],
    rejectUntil: UnixTimestamp | null,
  ): ResultAsync<void, PersistenceError> {
    // Convert to RejectedInvitations
    const rejectedInvitations = consentContractAddresses.map(
      (consentContractAddress) => {
        return new RejectedInvitation(consentContractAddress, rejectUntil);
      },
    );
    return ResultUtils.combine(
      rejectedInvitations.map((rejectedInvitation) => {
        return this.persistence.updateRecord(
          ERecordKey.REJECTED_INVITATIONS,
          rejectedInvitation,
        );
      }),
    ).map(() => {});
  }

  public getRejectedInvitations(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this.persistence
      .getAll<RejectedInvitation>(ERecordKey.REJECTED_INVITATIONS)
      .map((rejectedInvitations) => {
        // Return only invitations that are STILL rejected
        const now = this.timeUtils.getUnixNow();
        return rejectedInvitations
          .filter((rejectedInvitation) => {
            return (
              rejectedInvitation.rejectUntil == null ||
              rejectedInvitation.rejectUntil > now
            );
          })
          .map((filteredRejection) => {
            return filteredRejection.consentContractAddress;
          });
      });
  }
}
