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
  IDataPermissionsUtils,
  IDataPermissionsUtilsType,
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
    @inject(IDataPermissionsUtilsType)
    protected dataPermissionsUtils: IDataPermissionsUtils,
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

  public getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError> {
    return this.invitationRepository
      .getAgreementFlags(consentContractAddress)
      .andThen((flags) =>
        this.dataPermissionsUtils.getDataTypesFromFlagsString(flags),
      );
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

  public getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, SnickerDoodleCoreError> {
    return this.invitationRepository.getConsentCapacity(consentContractAddress);
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
  ): ResultAsync<IOldUserAgreement, SnickerDoodleCoreError> {
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
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError> {
    return this.getDataPermissions(dataTypes).andThen((dataPermissions) => {
      return this.invitationRepository.acceptInvitation(
        invitation,
        dataPermissions,
      );
    });
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

  protected getDataPermissions(
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<DataPermissions | null, never | ExtensionStorageError> {
    return this.dataPermissionsUtils.applyDefaultPermissionsOption.andThen(
      (option) => {
        if (option) {
          return this.dataPermissionsUtils.DefaultDataPermissions;
        }
        if (dataTypes) {
          return this.dataPermissionsUtils.generateDataPermissionsClassWithDataTypes(
            dataTypes,
          );
        }
        return okAsync(null);
      },
    );
  }
}
