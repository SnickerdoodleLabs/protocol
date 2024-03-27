import {
  Invitation,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  ISnickerdoodleCore,
  PageInvitation,
  ISnickerdoodleCoreType,
  IOldUserAgreement,
  EVMContractAddress,
  IpfsCID,
  HexString32,
  Signature,
  TokenId,
  MarketplaceListing,
  AccountAddress,
  IConsentCapacity,
  PossibleReward,
  PagingRequest,
  MarketplaceTag,
  PagedResponse,
  EarnedReward,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IInvitationRepository } from "@synamint-extension-sdk/core/interfaces/data/IInvitationRepository";
import {
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  constructor(
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public updateAgreementPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .updateDataPermissions(consentContractAddress, dataPermissions)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError> {
    return this.core.marketplace
      .getMarketplaceListingsByTag(pagingReq, tag, filterActive)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.core.marketplace.getListingsTotalByTag(tag).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    return this.core.getConsentContractCID(consentAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getDataPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions, SnickerDoodleCoreError> {
    return this.core.invitation
      .getDataPermissions(consentContractAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.core.invitation.getAvailableInvitationsCID().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.core.invitation.getAcceptedInvitationsCID().mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  > {
    return this.core.marketplace
      .getEarnedRewardsByContractAddress(contractAddresses)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError> {
    return this.core.invitation
      .getInvitationMetadataByCID(ipfsCID)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    return this.core.invitation
      .getInvitationsByDomain(domain)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.core.invitation
      .checkInvitationStatus(invitation)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .setDefaultReceivingAddress(receivingAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core
      .setReceivingAddress(contractAddress, receivingAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError> {
    return this.core.getReceivingAddress(contractAddress).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }

  public acceptInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation.acceptInvitation(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation.rejectInvitation(invitation).mapErr((error) => {
      this.errorUtils.emit(error);
      return new SnickerDoodleCoreError((error as Error).message, error);
    });
  }
  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.core.invitation
      .leaveCohort(consentContractAddress)
      .mapErr((error) => {
        this.errorUtils.emit(error);
        return new SnickerDoodleCoreError((error as Error).message, error);
      });
  }
}
