import {
  Invitation,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  PageInvitation,
  EVMContractAddress,
  IOldUserAgreement,
  IpfsCID,
  EWalletDataType,
  MarketplaceListing,
  AccountAddress,
  IConsentCapacity,
  PossibleReward,
  MarketplaceTag,
  PagingRequest,
  PagedResponse,
  EarnedReward,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IInvitationService } from "@synamint-extension-sdk/core/interfaces/business";
import {
  IInvitationRepository,
  IInvitationRepositoryType,
} from "@synamint-extension-sdk/core/interfaces/data/IInvitationRepository";
import {
  IContextProvider,
  IContextProviderType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  ExtensionStorageError,
  SnickerDoodleCoreError,
} from "@synamint-extension-sdk/shared";

@injectable()
export class InvitationService implements IInvitationService {
  constructor(
    @inject(IInvitationRepositoryType)
    protected invitationRepository: IInvitationRepository,
    @inject(IContextProviderType) protected contexProvider: IContextProvider,
  ) {}

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, SnickerDoodleCoreError> {
    return this.invitationRepository.getMarketplaceListingsByTag(
      pagingReq,
      tag,
      filterActive,
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.invitationRepository.getListingsTotalByTag(tag);
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    return this.invitationRepository.getConsentContractCID(consentAddress);
  }

  public getDataPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<DataPermissions, SnickerDoodleCoreError> {
    return this.invitationRepository.getDataPermissions(consentContractAddress);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getAvailableInvitationsCID();
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getAcceptedInvitationsCID();
  }

  public getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    SnickerDoodleCoreError
  > {
    return this.invitationRepository.getEarnedRewardsByContractAddress(
      contractAddresses,
    );
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, SnickerDoodleCoreError> {
    return this.invitationRepository.getInvitationMetadataByCID(ipfsCID);
  }

  public getInvitationByDomain(
    domain: DomainName,
  ): ResultAsync<PageInvitation[], SnickerDoodleCoreError> {
    return this.invitationRepository.getInvitationsByDomain(domain);
  }

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this.invitationRepository.checkInvitationStatus(invitation);
  }

  public acceptInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError> {
    return this.invitationRepository.acceptInvitation(invitation);
  }
  public rejectInvitation(
    invitation: Invitation,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.rejectInvitation(invitation);
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.leaveCohort(consentContractAddress);
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.setDefaultReceivingAddress(
      receivingAddress,
    );
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationRepository.setReceivingAddress(
      contractAddress,
      receivingAddress,
    );
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError> {
    return this.invitationRepository.getReceivingAddress(contractAddress);
  }
}
