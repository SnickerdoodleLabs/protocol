import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  Age,
  Invitation,
  CountryCode,
  DomainName,
  EInvitationStatus,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  EScamFilterStatus,
  EChain,
  LinkedAccount,
  EWalletDataType,
  AccountAddress,
  TokenId,
  BigNumberString,
  TokenBalance,
  WalletNFT,
  EarnedReward,
  ChainId,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  URLString,
  SiteVisit,
  MarketplaceListing,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";
import { okAsync, ResultAsync } from "neverthrow";
import { parse } from "tldts";
import { Runtime } from "webextension-polyfill";

import { AsyncRpcResponseSender } from "@synamint-extension-sdk/core/implementations/utilities";
import { IRpcCallHandler } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IInvitationService,
  IInvitationServiceType,
  IPIIService,
  IPIIServiceType,
  ITokenPriceService,
  ITokenPriceServiceType,
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IScamFilterService,
  IScamFilterServiceType,
} from "@synamint-extension-sdk/core/interfaces/business/IScamFilterService";
import {
  IContextProvider,
  IContextProviderType,
  IDataPermissionsUtils,
  IDataPermissionsUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import {
  IScamFilterSettingsUtils,
  IScamFilterSettingsUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities/IScamFilterSettingsUtils";
import { ExtensionUtils } from "@synamint-extension-sdk/extensionShared";
import {
  DEFAULT_SUBDOMAIN,
  DEFAULT_RPC_SUCCESS_RESULT,
  EExternalActions,
  EInternalActions,
  ExtensionStorageError,
  IUnlockParams,
  IGetUnlockMessageParams,
  IAddAccountParams,
  ISetGivenNameParams,
  ISetFamilyNameParams,
  ISetBirthdayParams,
  ISetGenderParams,
  ISetLocationParams,
  ISetEmailParams,
  IGetInvitationWithDomainParams,
  IAcceptInvitationByUUIDParams,
  IRejectInvitationParams,
  ILeaveCohortParams,
  IInvitationDomainWithUUID,
  IGetInvitationMetadataByCIDParams,
  ICheckURLParams,
  IGetAgreementPermissionsParams,
  ISetDefaultPermissionsWithDataTypesParams,
  ISetApplyDefaultPermissionsParams,
  IUnlinkAccountParams,
  IAcceptInvitationParams,
  IScamFilterSettingsParams,
  IGetConsentContractCIDParams,
  ICheckInvitationStatusParams,
  IGetTokenPriceParams,
  IGetTokenMarketDataParams,
  IGetTokenInfoParams,
  IGetMarketplaceListingsParams,
  ISetDefaultReceivingAddressParams,
  ISetReceivingAddressParams,
  IScamFilterPreferences,
  IGetReceivingAddressParams,
  mapToObj,
  SnickerDoodleCoreError,
} from "@synamint-extension-sdk/shared";

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ITokenPriceServiceType)
    protected tokenPriceService: ITokenPriceService,
    @inject(IAccountServiceType) protected accountService: IAccountService,
    @inject(IPIIServiceType) protected piiService: IPIIService,
    @inject(IInvitationServiceType)
    protected invitationService: IInvitationService,
    @inject(IScamFilterServiceType)
    protected scamFilterService: IScamFilterService,
    @inject(IDataPermissionsUtilsType)
    protected dataPermissionsUtils: IDataPermissionsUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IScamFilterSettingsUtilsType)
    protected scamFilterSettingsUtils: IScamFilterSettingsUtils,
    @inject(IUserSiteInteractionServiceType)
    protected userSiteInteractionService: IUserSiteInteractionService,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
  ) {
    const { method, params } = req;

    switch (method) {
      case EExternalActions.UNLOCK: {
        const { accountAddress, signature, chain, languageCode } =
          params as IUnlockParams;
        return new AsyncRpcResponseSender(
          this.unlock(accountAddress, signature, chain, languageCode),
          res,
        ).call();
      }
      case EExternalActions.ADD_ACCOUNT: {
        const { accountAddress, signature, chain, languageCode } =
          params as IAddAccountParams;
        return new AsyncRpcResponseSender(
          this.addAccount(accountAddress, signature, chain, languageCode),
          res,
        ).call();
      }
      case EExternalActions.GET_UNLOCK_MESSAGE: {
        const { languageCode } = params as IGetUnlockMessageParams;
        return new AsyncRpcResponseSender(
          this.getUnlockMessage(languageCode),
          res,
        ).call();
      }
      case EExternalActions.GET_EARNED_REWARDS: {
        return new AsyncRpcResponseSender(this.getEarnedRewards(), res).call();
      }
      case EExternalActions.GET_ACCOUNTS:
      case EInternalActions.GET_ACCOUNTS: {
        return new AsyncRpcResponseSender(this.getAccounts(), res).call();
      }
      case EExternalActions.GET_TOKEN_PRICE: {
        const { chainId, address, timestamp } = params as IGetTokenPriceParams;
        return new AsyncRpcResponseSender(
          this.getTokenPrice(chainId, address, timestamp),
          res,
        ).call();
      }
      case EExternalActions.GET_TOKEN_MARKET_DATA: {
        const { ids } = params as IGetTokenMarketDataParams;
        return new AsyncRpcResponseSender(
          this.getTokenMarketData(ids),
          res,
        ).call();
      }
      case EExternalActions.GET_TOKEN_INFO: {
        const { chainId, contractAddress } = params as IGetTokenInfoParams;
        return new AsyncRpcResponseSender(
          this.getTokenInfo(chainId, contractAddress),
          res,
        ).call();
      }
      case EExternalActions.GET_ACCOUNT_BALANCES:
      case EInternalActions.GET_ACCOUNT_BALANCES: {
        return new AsyncRpcResponseSender(
          this.getAccountBalances(),
          res,
        ).call();
      }
      case EExternalActions.GET_ACCOUNT_NFTS:
      case EInternalActions.GET_ACCOUNT_NFTS: {
        return new AsyncRpcResponseSender(this.getAccountNFTs(), res).call();
      }
      case EExternalActions.SET_GIVEN_NAME: {
        const { givenName } = params as ISetGivenNameParams;
        return new AsyncRpcResponseSender(
          this.setGivenName(givenName),
          res,
        ).call();
      }
      case EExternalActions.SET_EMAIL: {
        const { email } = params as ISetEmailParams;
        return new AsyncRpcResponseSender(this.setEmail(email), res).call();
      }
      case EExternalActions.SET_FAMILY_NAME: {
        const { familyName } = params as ISetFamilyNameParams;
        return new AsyncRpcResponseSender(
          this.setFamilyName(familyName),
          res,
        ).call();
      }
      case EExternalActions.SET_BIRTHDAY: {
        const { birthday } = params as ISetBirthdayParams;
        return new AsyncRpcResponseSender(
          this.setBirthday(birthday),
          res,
        ).call();
      }
      case EExternalActions.SET_GENDER: {
        const { gender } = params as ISetGenderParams;
        return new AsyncRpcResponseSender(this.setGender(gender), res).call();
      }
      case EExternalActions.SET_LOCATION: {
        const { location } = params as ISetLocationParams;
        return new AsyncRpcResponseSender(
          this.setLocation(location),
          res,
        ).call();
      }

      case EExternalActions.GET_AGE: {
        return new AsyncRpcResponseSender(this.getAge(), res).call();
      }
      case EInternalActions.GET_GIVEN_NAME:
      case EExternalActions.GET_GIVEN_NAME: {
        return new AsyncRpcResponseSender(this.getGivenName(), res).call();
      }
      case EInternalActions.GET_EMAIL:
      case EExternalActions.GET_EMAIL: {
        return new AsyncRpcResponseSender(this.getEmail(), res).call();
      }
      case EInternalActions.GET_FAMILY_NAME:
      case EExternalActions.GET_FAMILY_NAME: {
        return new AsyncRpcResponseSender(this.getFamilyName(), res).call();
      }
      case EExternalActions.GET_BIRTHDAY: {
        return new AsyncRpcResponseSender(this.getBirthday(), res).call();
      }
      case EExternalActions.GET_GENDER: {
        return new AsyncRpcResponseSender(this.getGender(), res).call();
      }
      case EExternalActions.GET_LOCATION: {
        return new AsyncRpcResponseSender(this.getLocation(), res).call();
      }
      case EExternalActions.GET_SITE_VISITS: {
        return new AsyncRpcResponseSender(this.getSiteVisits(), res).call();
      }
      case EExternalActions.GET_SITE_VISITS_MAP: {
        return new AsyncRpcResponseSender(this.getSiteVisitsMap(), res).call();
      }
      case EExternalActions.GET_ACCEPTED_INVITATIONS_CID: {
        return new AsyncRpcResponseSender(
          this.getAcceptedInvitationsCID(),
          res,
        ).call();
      }
      case EExternalActions.SET_DEFAULT_RECEIVING_ACCOUNT: {
        const { receivingAddress } =
          params as ISetDefaultReceivingAddressParams;
        return new AsyncRpcResponseSender(
          this.setDefaultReceivingAddress(receivingAddress),
          res,
        ).call();
      }
      case EExternalActions.SET_RECEIVING_ACCOUNT: {
        const { contractAddress, receivingAddress } =
          params as ISetReceivingAddressParams;
        return new AsyncRpcResponseSender(
          this.setReceivingAddress(contractAddress, receivingAddress),
          res,
        ).call();
      }
      case EExternalActions.GET_RECEIVING_ACCOUNT: {
        const { contractAddress } = params as IGetReceivingAddressParams;
        return new AsyncRpcResponseSender(
          this.getReceivingAddress(contractAddress),
          res,
        ).call();
      }
      case EExternalActions.GET_INVITATION_METADATA_BY_CID: {
        const { ipfsCID } = params as IGetInvitationMetadataByCIDParams;
        return new AsyncRpcResponseSender(
          this.getInvitationMetadataByCID(ipfsCID),
          res,
        ).call();
      }

      case EExternalActions.CHECK_INVITATION_STATUS: {
        const { signature, consentAddress, tokenId } =
          params as ICheckInvitationStatusParams;
        return new AsyncRpcResponseSender(
          this.checkInvitationStatus(consentAddress, signature, tokenId),
          res,
        ).call();
      }

      case EExternalActions.GET_MARKETPLACE_LISTINGS: {
        const { count, headAt } = params as IGetMarketplaceListingsParams;
        return new AsyncRpcResponseSender(
          this.getMarketplaceListings(count, headAt),
          res,
        ).call();
      }

      case EExternalActions.GET_LISTING_TOTAL: {
        return new AsyncRpcResponseSender(this.getListingsTotal(), res).call();
      }

      case EExternalActions.GET_CONTRACT_CID: {
        const { consentAddress } = params as IGetConsentContractCIDParams;
        return new AsyncRpcResponseSender(
          this.getConsentContractCID(consentAddress),
          res,
        ).call();
      }

      case EExternalActions.UNLINK_ACCOUNT: {
        const { accountAddress, chain, languageCode, signature } =
          params as IUnlinkAccountParams;
        return new AsyncRpcResponseSender(
          this.unlinkAccount(accountAddress, signature, chain, languageCode),
          res,
        ).call();
      }

      case EExternalActions.LEAVE_COHORT: {
        const { consentContractAddress } = params as ILeaveCohortParams;
        return new AsyncRpcResponseSender(
          this.leaveCohort(consentContractAddress),
          res,
        ).call();
      }
      case EExternalActions.GET_COHORT_INVITATION_WITH_DOMAIN: {
        const { domain, path } = params as IGetInvitationWithDomainParams;
        return new AsyncRpcResponseSender(
          this.getInvitationsByDomain(domain, path),
          res,
        ).call();
      }
      case EExternalActions.GET_AVAILABLE_INVITATIONS_CID: {
        return new AsyncRpcResponseSender(
          this.getAvailableInvitationsCID(),
          res,
        ).call();
      }
      case EExternalActions.GET_AGREEMENT_PERMISSIONS: {
        const { consentContractAddress } =
          params as IGetAgreementPermissionsParams;
        return new AsyncRpcResponseSender(
          this.getAgreementPermissions(consentContractAddress),
          res,
        ).call();
      }
      case EExternalActions.GET_DEFAULT_PERMISSIONS: {
        return new AsyncRpcResponseSender(
          this.getDefaultPermissions(),
          res,
        ).call();
      }
      case EExternalActions.SET_DEFAULT_PERMISSIONS: {
        const { dataTypes } =
          params as ISetDefaultPermissionsWithDataTypesParams;
        return new AsyncRpcResponseSender(
          this.setDefaultPermissionsWithDataTypes(dataTypes),
          res,
        ).call();
      }
      case EExternalActions.SET_DEFAULT_PERMISSIONS_TO_ALL: {
        return new AsyncRpcResponseSender(
          this.setDefaultPermissionsToAll(),
          res,
        ).call();
      }
      case EExternalActions.GET_APPLY_DEFAULT_PERMISSIONS_OPTION: {
        return new AsyncRpcResponseSender(
          this.getApplyDefaultPermissionOptions(),
          res,
        ).call();
      }
      case EExternalActions.SET_APPLY_DEFAULT_PERMISSIONS_OPTION: {
        const { option } = params as ISetApplyDefaultPermissionsParams;
        return new AsyncRpcResponseSender(
          this.setApplyDefaultPermissionOptions(option),
          res,
        ).call();
      }
      case EExternalActions.ACCEPT_INVITATION_BY_UUID: {
        const { dataTypes, id } = params as IAcceptInvitationByUUIDParams;
        return new AsyncRpcResponseSender(
          this.acceptInvitationByUUID(dataTypes, id),
          res,
        ).call();
      }
      case EExternalActions.GET_SCAM_FILTER_SETTINGS: {
        return new AsyncRpcResponseSender(
          this.getScamFilterSettings(),
          res,
        ).call();
      }
      case EExternalActions.SET_SCAM_FILTER_SETTINGS: {
        const { isScamFilterActive, showMessageEveryTime } =
          params as IScamFilterSettingsParams;
        return new AsyncRpcResponseSender(
          this.setScamFilterSettings(isScamFilterActive, showMessageEveryTime),
          res,
        ).call();
      }
      case EExternalActions.ACCEPT_INVITATION: {
        const {
          dataTypes,
          consentContractAddress,
          tokenId,
          businessSignature,
        } = params as IAcceptInvitationParams;
        return new AsyncRpcResponseSender(
          this.acceptInvitation(
            dataTypes,
            consentContractAddress,
            tokenId,
            businessSignature,
          ),
          res,
        ).call();
      }
      case EExternalActions.REJECT_INVITATION: {
        const { id } = params as IRejectInvitationParams;
        return new AsyncRpcResponseSender(
          this.rejectInvitation(id),
          res,
        ).call();
      }
      case EExternalActions.CHECK_URL: {
        const { domain } = params as ICheckURLParams;
        return new AsyncRpcResponseSender(this.checkURL(domain), res).call();
      }
      case EExternalActions.CLOSE_TAB: {
        sender?.tab?.id && ExtensionUtils.closeTab(sender.tab.id);
        return (res.result = DEFAULT_RPC_SUCCESS_RESULT);
      }
      case EExternalActions.GET_STATE:
        return (res.result = this.contextProvider.getExterenalState());

      case EInternalActions.GET_STATE:
        return (res.result = this.contextProvider.getInternalState());
      // TODO move it to correct place
      case EExternalActions.GET_DATA_WALLET_ADDRESS:
        return (res.result = this.contextProvider
          .getAccountContext()
          .getAccount());
      case EInternalActions.IS_DATA_WALLET_ADDRESS_INITIALIZED:
      case EExternalActions.IS_DATA_WALLET_ADDRESS_INITIALIZED: {
        return new AsyncRpcResponseSender(
          this.accountService.isDataWalletAddressInitialized(),
          res,
        ).call();
      }
      default:
        return next();
    }
  }

  private getInvitationsByDomain(
    domain: DomainName,
    url: string,
  ): ResultAsync<IInvitationDomainWithUUID | null, SnickerDoodleCoreError> {
    return this.invitationService
      .getInvitationByDomain(domain)
      .andThen((pageInvitations) => {
        console.log("pageInvitations", pageInvitations);
        const pageInvitation = pageInvitations.find((value) => {
          const incomingUrl = value.url.replace(/^https?:\/\//, "");
          const incomingUrlInfo = parse(incomingUrl);
          if (!incomingUrlInfo.subdomain && parse(url).subdomain) {
            return (
              `${DEFAULT_SUBDOMAIN}.${incomingUrl.replace(/\/$/, "")}` === url
            );
          }
          return incomingUrl.replace(/\/$/, "") === url;
        });
        if (pageInvitation) {
          return this.invitationService
            .checkInvitationStatus(pageInvitation.invitation)
            .andThen((invitationStatus) => {
              console.log("invitationStatus", invitationStatus);
              if (invitationStatus === EInvitationStatus.New) {
                const invitationUUID = this.contextProvider.addInvitation(
                  pageInvitation.invitation,
                );
                return okAsync(
                  Object.assign(pageInvitation.domainDetails, {
                    id: invitationUUID,
                    consentAddress:
                      pageInvitation.invitation.consentContractAddress,
                  }),
                );
              } else {
                return okAsync(null);
              }
            });
        } else {
          return okAsync(null);
        }
      });
  }

  private getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationService
      .getAcceptedInvitationsCID()
      .map((res) => mapToObj(res));
  }

  private getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, SnickerDoodleCoreError> {
    return this.invitationService.getInvitationMetadataByCID(ipfsCID);
  }

  private leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationService.leaveCohort(consentContractAddress);
  }

  private acceptInvitationByUUID(
    dataTypes: EWalletDataType[] | null,
    id: UUID,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError> {
    const invitation = this.contextProvider.getInvitation(id) as Invitation;
    return this.invitationService.acceptInvitation(invitation, dataTypes);
  }

  private getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    SnickerDoodleCoreError
  > {
    return this.invitationService
      .getAvailableInvitationsCID()
      .map((res) => mapToObj(res));
  }

  private acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId: BigNumberString | undefined,
    businessSignature: Signature | undefined,
  ): ResultAsync<void, SnickerDoodleCoreError | ExtensionStorageError> {
    return this._getTokenId(tokenId).andThen((tokenId) => {
      return this.invitationService.acceptInvitation(
        new Invitation(
          "" as DomainName,
          consentContractAddress,
          tokenId,
          businessSignature ?? null,
        ),
        dataTypes,
      );
    });
  }

  private checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, SnickerDoodleCoreError> {
    return this._getTokenId(tokenId).andThen((tokenId) => {
      return this.invitationService.checkInvitationStatus(
        new Invitation(
          "" as DomainName,
          consentAddress,
          tokenId,
          signature ?? null,
        ),
      );
    });
  }

  private getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, SnickerDoodleCoreError> {
    return this.invitationService.getMarketplaceListings(count, headAt);
  }

  private getListingsTotal(): ResultAsync<number, SnickerDoodleCoreError> {
    return this.invitationService.getListingsTotal();
  }

  private getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, SnickerDoodleCoreError> {
    return this.invitationService.getConsentContractCID(consentAddress);
  }

  private _getTokenId(tokenId: BigNumberString | undefined) {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return this.cryptoUtils.getTokenId();
  }

  private getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], SnickerDoodleCoreError> {
    return this.invitationService.getAgreementPermissions(
      consentContractAddress,
    );
  }

  private getDefaultPermissions(): ResultAsync<
    EWalletDataType[],
    ExtensionStorageError
  > {
    return this.dataPermissionsUtils.defaultFlags.andThen((flags) =>
      this.dataPermissionsUtils.getDataTypesFromFlagsString(flags),
    );
  }

  private setDefaultPermissionsWithDataTypes(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ExtensionStorageError> {
    return this.dataPermissionsUtils.setDefaultFlagsWithDataTypes(dataTypes);
  }

  private setDefaultPermissionsToAll(): ResultAsync<
    void,
    ExtensionStorageError
  > {
    return this.dataPermissionsUtils.setDefaultFlagsToAll();
  }

  private getApplyDefaultPermissionOptions(): ResultAsync<
    boolean,
    ExtensionStorageError
  > {
    return this.dataPermissionsUtils.applyDefaultPermissionsOption;
  }

  private setApplyDefaultPermissionOptions(
    option: boolean,
  ): ResultAsync<void, ExtensionStorageError> {
    return this.dataPermissionsUtils.setApplyDefaultPermissionsOption(option);
  }
  private setScamFilterSettings(
    isScamFilterActive,
    showMessageEveryTime,
  ): ResultAsync<void, ExtensionStorageError> {
    return this.scamFilterSettingsUtils.setScamFilterSettings(
      isScamFilterActive,
      showMessageEveryTime,
    );
  }
  private getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    ExtensionStorageError
  > {
    return this.scamFilterSettingsUtils.getScamFilterSettings();
  }

  private rejectInvitation(
    id: UUID,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    const invitation = this.contextProvider.getInvitation(id) as Invitation;
    return this.invitationService.rejectInvitation(invitation);
  }
  private checkURL(
    domain: DomainName,
  ): ResultAsync<EScamFilterStatus, SnickerDoodleCoreError> {
    return this.scamFilterService.checkURL(domain);
  }

  private unlock(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountService.unlock(account, signature, chain, languageCode);
  }
  private addAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountService.addAccount(
      account,
      signature,
      chain,
      languageCode,
    );
  }
  private unlinkAccount(
    account: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.accountService.unlinkAccount(
      account,
      signature,
      chain,
      languageCode,
    );
  }
  private getUnlockMessage(
    languageCode: LanguageCode,
  ): ResultAsync<string, SnickerDoodleCoreError> {
    return this.accountService.getUnlockMessage(languageCode);
  }

  private getEarnedRewards(): ResultAsync<
    EarnedReward[],
    SnickerDoodleCoreError
  > {
    return this.accountService.getEarnedRewards();
  }

  private getAccounts(): ResultAsync<LinkedAccount[], SnickerDoodleCoreError> {
    return this.accountService.getAccounts();
  }

  private getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, SnickerDoodleCoreError> {
    return this.tokenPriceService.getTokenPrice(chainId, address, timestamp);
  }
  private getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], SnickerDoodleCoreError> {
    return this.tokenPriceService.getTokenMarketData(ids);
  }
  private getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, SnickerDoodleCoreError> {
    return this.tokenPriceService.getTokenInfo(chainId, contractAddress);
  }

  private getAccountBalances(): ResultAsync<
    TokenBalance[],
    SnickerDoodleCoreError
  > {
    return this.accountService.getAccountBalances();
  }

  private getAccountNFTs(): ResultAsync<WalletNFT[], SnickerDoodleCoreError> {
    return this.accountService.getAccountNFTs();
  }

  private getAge(): ResultAsync<Age | null, SnickerDoodleCoreError> {
    return this.piiService.getAge();
  }

  private setGivenName(
    name: GivenName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGivenName(name);
  }

  private getGivenName(): ResultAsync<
    GivenName | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getGivenName();
  }

  private setFamilyName(
    name: FamilyName,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setFamilyName(name);
  }
  private getFamilyName(): ResultAsync<
    FamilyName | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getFamilyName();
  }
  private setBirthday(
    birthday: UnixTimestamp,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setBirthday(birthday);
  }
  private getBirthday(): ResultAsync<
    UnixTimestamp | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getBirthday();
  }
  private setGender(gender: Gender): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setGender(gender);
  }
  private getGender(): ResultAsync<Gender | null, SnickerDoodleCoreError> {
    return this.piiService.getGender();
  }
  private setEmail(
    email: EmailAddressString,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setEmail(email);
  }
  private getEmail(): ResultAsync<
    EmailAddressString | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getEmail();
  }
  private setLocation(
    location: CountryCode,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.piiService.setLocation(location);
  }
  private getLocation(): ResultAsync<
    CountryCode | null,
    SnickerDoodleCoreError
  > {
    return this.piiService.getLocation();
  }
  private getSiteVisits(): ResultAsync<SiteVisit[], SnickerDoodleCoreError> {
    return this.userSiteInteractionService.getSiteVisits();
  }
  private getSiteVisitsMap(): ResultAsync<
    Map<URLString, number>,
    SnickerDoodleCoreError
  > {
    return this.userSiteInteractionService.getSiteVisitsMap();
  }

  private setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationService.setDefaultReceivingAddress(receivingAddress);
  }

  private setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, SnickerDoodleCoreError> {
    return this.invitationService.setReceivingAddress(
      contractAddress,
      receivingAddress,
    );
  }

  private getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, SnickerDoodleCoreError> {
    return this.invitationService.getReceivingAddress(contractAddress);
  }
}
