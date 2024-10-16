import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
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
  UninitializedError,
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
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  protected cache = new Map<IpfsCID, IOldUserAgreement | IUserAgreement>();

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAcceptedInvitations(): ResultAsync<
    OptInInfo[],
    PersistenceError | UninitializedError
  > {
    return this.persistence
      .getAll<InvitationForStorage>(ERecordKey.OPTED_IN_INVITATIONS)
      .andThen((storedInvitations) => {
        if (storedInvitations == null) {
          return okAsync([]);
        }

        return ResultUtils.combine(
          storedInvitations.map((storedInvitation) => {
            return this.toOptInInfo(storedInvitation);
          }),
        );
      });
  }

  public addAcceptedInvitations(
    acceptedInvitations: OptInInfo[],
  ): ResultAsync<void, PersistenceError> {
    const invitations = acceptedInvitations.map((invitation) => {
      return this.toInvitationForStorage(invitation);
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

  protected toOptInInfo(
    src: InvitationForStorage,
  ): ResultAsync<OptInInfo, UninitializedError> {
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError(
            "Data wallet key is not initialized in toOptInInfo()",
          ),
        );
      }
      return this.dataWalletUtils.deriveOptInInfo(
        src.consentContractAddress,
        context.dataWalletKey,
      );
    });
  }

  protected toInvitationForStorage(src: OptInInfo): InvitationForStorage {
    return new InvitationForStorage(src.consentContractAddress);
  }
}
