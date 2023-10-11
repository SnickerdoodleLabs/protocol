import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DomainName,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  InvitationDomain,
  IOldUserAgreement,
  IpfsCID,
  IPFSError,
  OptInInfo,
  PersistenceError,
  RejectedInvitation,
  TokenId,
  UnixTimestamp,
  URLString,
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
  protected cache = new Map<IpfsCID, InvitationDomain>();

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public getAcceptedInvitations(): ResultAsync<OptInInfo[], PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
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
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
      .andThen((storedInvitations) => {
        if (storedInvitations == null) {
          storedInvitations = [];
        }

        const allInvitations = storedInvitations.concat(
          acceptedInvitations.map((invitation) => {
            return InvitationForStorage.fromOptInInfo(invitation);
          }),
        );

        return this.persistence.updateField(
          EFieldKey.ACCEPTED_INVITATIONS,
          allInvitations,
        );
      });
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
      .andThen((storedInvitations) => {
        if (storedInvitations == null) {
          storedInvitations = [];
        }

        const invitations = storedInvitations.filter((optIn) => {
          return !addressesToRemove.includes(optIn.consentContractAddress);
        });

        return this.persistence.updateField(
          EFieldKey.ACCEPTED_INVITATIONS,
          invitations,
        );
      });
  }

  public getInvitationDomainByCID(
    cid: IpfsCID,
    domain: DomainName,
  ): ResultAsync<InvitationDomain | null, IPFSError> {
    const cached = this.cache.get(cid);

    if (cached != null) {
      return okAsync(cached);
    }

    return this.getInvitationMetadataByCID(cid).andThen((json) => {
      const invitationDomain = new InvitationDomain(
        domain,
        json?.title,
        json?.description,
        json?.image,
        json?.rewardName,
        json?.nftClaimedImage,
      );

      // Cache the query
      this.cache.set(cid, invitationDomain);

      return okAsync(invitationDomain);
    });
  }

  public getInvitationMetadataByCID(
    cid: IpfsCID,
  ): ResultAsync<IOldUserAgreement, IPFSError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const ipfsUrl = urlJoin(config.ipfsFetchBaseUrl, cid);
        return this.ajaxUtil
          .get<IOldUserAgreement>(new URL(ipfsUrl))
          .map((metadata) => {
            metadata.image = URLString(
              metadata.image?.replace("ipfs://", config.ipfsFetchBaseUrl) ?? "",
            );
            metadata.nftClaimedImage = URLString(
              metadata.nftClaimedImage?.replace(
                "ipfs://",
                config.ipfsFetchBaseUrl,
              ) ?? "",
            );
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

class InvitationForStorage {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public tokenId: string,
  ) {}

  static toInvitation(src: InvitationForStorage): OptInInfo {
    return new OptInInfo(
      src.consentContractAddress,
      TokenId(BigInt(src.tokenId)),
    );
  }

  static fromOptInInfo(src: OptInInfo): InvitationForStorage {
    return new InvitationForStorage(
      src.consentContractAddress,
      src.tokenId.toString(),
    );
  }
}
