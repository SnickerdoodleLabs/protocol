import {
  Age,
  CountryCode,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  UnixTimestamp,
  EVMContractAddress,
  IOpenSeaMetadata,
  IpfsCID,
  EWalletDataType,
  AccountAddress,
  LinkedAccount,
  DataWalletAddress,
  EInvitationStatus,
  WalletNFT,
  TokenBalance,
  EarnedReward,
  TokenInfo,
  TokenMarketData,
  SiteVisit,
  URLString,
  MarketplaceListing,
  ISdlDiscordMethods,
  DiscordProfile,
  DiscordGuildProfile,
  SnowflakeID,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import {
  SnickerDoodleCoreError,
  AcceptInvitationParams,
  GetInvitationMetadataByCIDParams,
  GetInvitationWithDomainParams,
  GetUnlockMessageParams,
  IInvitationDomainWithUUID,
  LeaveCohortParams,
  RejectInvitationParams,
  SetBirthdayParams,
  SetEmailParams,
  SetFamilyNameParams,
  SetGenderParams,
  SetGivenNameParams,
  SetLocationParams,
  CheckURLParams,
  AcceptInvitationByUUIDParams,
  GetAgreementPermissionsParams,
  SetDefaultPermissionsWithDataTypesParams,
  SetApplyDefaultPermissionsParams,
  ScamFilterSettingsParams,
  GetConsentContractCIDParams,
  CheckInvitationStatusParams,
  GetTokenPriceParams,
  GetTokenMarketDataParams,
  GetTokenInfoParams,
  GetMarketplaceListingsParams,
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
  IScamFilterPreferences,
  IExternalState,
  UnlockParams,
  AddAccountParams,
  UnlinkAccountParams,
  GetMarketplaceListingsTotalParams,
  GetSiteVisitsMapParams,
  GetSiteVisitsParams,
  GetEarnedRewardsParams,
  GetDataWalletAddressParams,
  CloseTabParams,
  IsDataWalletAddressInitializedParams,
  GetLocationParams,
  GetGenderParams,
  GetEmailParams,
  GetBirthdayParams,
  GetGivenNameParams,
  GetFamilyNameParams,
  GetAgeParams,
  GetAccountNFTsParams,
  GetAccountBalancesParams,
  GetAccountsParams,
  GetApplyDefaultPermissionsOptionParams,
  GetAcceptedInvitationsCIDParams,
  GetScamFilterSettingsParams,
  SetDefaultPermissionsToAllParams,
  GetDefaultPermissionsParams,
  GetAvailableInvitationsCIDParams,
  GetStateParams,
  InitializeDiscordUserParams,
  GetDiscordInstallationUrlParams,
  GetDiscordUserProfilesParams,
  GetDiscordGuildProfilesParams,
  UnlinkDiscordAccountParams,
} from "@synamint-extension-sdk/shared";

export class ExternalCoreGateway {
  public discord: ISdlDiscordMethods;
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);

    this.discord = {
      initializeUserWithAuthorizationCode: (
        code: OAuthAuthorizationCode,
      ): ResultAsync<void, JsonRpcError> => {
        return this._handler.call(new InitializeDiscordUserParams(code));
      },
      installationUrl: (): ResultAsync<URLString, JsonRpcError> => {
        return this._handler.call(new GetDiscordInstallationUrlParams());
      },
      getUserProfiles: (): ResultAsync<DiscordProfile[], JsonRpcError> => {
        return this._handler.call(new GetDiscordUserProfilesParams());
      },
      getGuildProfiles: (): ResultAsync<
        DiscordGuildProfile[],
        JsonRpcError
      > => {
        return this._handler.call(new GetDiscordGuildProfilesParams());
      },
      unlink: (discordProfileId: SnowflakeID) => {
        return this._handler.call(
          new UnlinkDiscordAccountParams(discordProfileId),
        );
      },
    };
  }

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this._handler.updateRpcEngine(rpcEngine);
  }

  public getState(): ResultAsync<IExternalState, JsonRpcError> {
    return this._handler.call(new GetStateParams());
  }

  public getInvitationsByDomain(
    params: GetInvitationWithDomainParams,
  ): ResultAsync<IInvitationDomainWithUUID | null, JsonRpcError> {
    return this._handler.call(params);
  }

  public acceptInvitationByUUID(
    params: AcceptInvitationByUUIDParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this._handler.call(new GetAvailableInvitationsCIDParams());
  }

  public acceptInvitation(
    params: AcceptInvitationParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public getAgreementPermissions(
    params: GetAgreementPermissionsParams,
  ): ResultAsync<EWalletDataType[], JsonRpcError> {
    return this._handler.call(params);
  }

  public getDefaultPermissions(): ResultAsync<EWalletDataType[], JsonRpcError> {
    return this._handler.call(new GetDefaultPermissionsParams());
  }

  public setDefaultPermissionsWithDataTypes(
    params: SetDefaultPermissionsWithDataTypesParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, JsonRpcError> {
    return this._handler.call(new SetDefaultPermissionsToAllParams());
  }

  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    JsonRpcError
  > {
    return this._handler.call(new GetScamFilterSettingsParams());
  }

  public setScamFilterSettings(
    params: ScamFilterSettingsParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public rejectInvitation(
    params: RejectInvitationParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this._handler.call(new GetAcceptedInvitationsCIDParams());
  }

  public getInvitationMetadataByCID(
    params: GetInvitationMetadataByCIDParams,
  ): ResultAsync<IOpenSeaMetadata, JsonRpcError> {
    return this._handler.call(params);
  }

  public leaveCohort(
    params: LeaveCohortParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public addAccount(params: AddAccountParams): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public unlock(params: UnlockParams): ResultAsync<void, JsonRpcError> {
    return this._handler.call<UnlockParams>(params);
  }
  public unlinkAccount(
    params: UnlinkAccountParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public getUnlockMessage(
    params: GetUnlockMessageParams,
  ): ResultAsync<string, JsonRpcError> {
    return this._handler.call(params);
  }
  public getApplyDefaultPermissionsOption(): ResultAsync<
    boolean,
    JsonRpcError
  > {
    return this._handler.call(new GetApplyDefaultPermissionsOptionParams());
  }
  public setApplyDefaultPermissionsOption(
    params: SetApplyDefaultPermissionsParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError> {
    return this._handler.call(new GetAccountsParams());
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], JsonRpcError> {
    return this._handler.call(new GetAccountBalancesParams());
  }

  public getTokenPrice(
    params: GetTokenPriceParams,
  ): ResultAsync<number, JsonRpcError> {
    return this._handler.call(params);
  }

  public getTokenMarketData(
    params: GetTokenMarketDataParams,
  ): ResultAsync<TokenMarketData[], JsonRpcError> {
    return this._handler.call(params);
  }
  public getTokenInfo(
    params: GetTokenInfoParams,
  ): ResultAsync<TokenInfo | null, JsonRpcError> {
    return this._handler.call(params);
  }
  public getAccountNFTs(): ResultAsync<WalletNFT[], JsonRpcError> {
    return this._handler.call(new GetAccountNFTsParams());
  }

  public setFamilyName(
    params: SetFamilyNameParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public setGivenName(
    params: SetGivenNameParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public setBirtday(
    params: SetBirthdayParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public setEmail(params: SetEmailParams): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public setGender(params: SetGenderParams): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }
  public setLocation(
    params: SetLocationParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public getAge(): ResultAsync<Age | null, JsonRpcError> {
    return this._handler.call(new GetAgeParams());
  }
  public getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError> {
    return this._handler.call(new GetFamilyNameParams());
  }
  public getGivenName(): ResultAsync<GivenName | null, JsonRpcError> {
    return this._handler.call(new GetGivenNameParams());
  }
  public getBirtday(): ResultAsync<UnixTimestamp | null, JsonRpcError> {
    return this._handler.call(new GetBirthdayParams());
  }
  public getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError> {
    return this._handler.call(new GetEmailParams());
  }
  public getGender(): ResultAsync<Gender | null, JsonRpcError> {
    return this._handler.call(new GetGenderParams());
  }
  public getLocation(): ResultAsync<CountryCode | null, JsonRpcError> {
    return this._handler.call(new GetLocationParams());
  }
  public isDataWalletAddressInitialized(): ResultAsync<boolean, JsonRpcError> {
    return this._handler.call(new IsDataWalletAddressInitializedParams());
  }
  public closeTab(): ResultAsync<void, JsonRpcError> {
    return this._handler.call(new CloseTabParams());
  }
  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    JsonRpcError
  > {
    return this._handler.call(new GetDataWalletAddressParams());
  }
  public checkURL(params: CheckURLParams): ResultAsync<string, JsonRpcError> {
    return this._handler.call(params);
  }

  public checkInvitationStatus(
    params: CheckInvitationStatusParams,
  ): ResultAsync<EInvitationStatus, JsonRpcError> {
    return this._handler.call(params);
  }

  public getContractCID(
    params: GetConsentContractCIDParams,
  ): ResultAsync<IpfsCID, JsonRpcError> {
    return this._handler.call(params);
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], JsonRpcError> {
    return this._handler.call(new GetEarnedRewardsParams());
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], JsonRpcError> {
    return this._handler.call(new GetSiteVisitsParams());
  }

  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, JsonRpcError> {
    return this._handler.call(new GetSiteVisitsMapParams());
  }

  public getMarketplaceListings(
    params: GetMarketplaceListingsParams,
  ): ResultAsync<MarketplaceListing, JsonRpcError> {
    return this._handler.call(params);
  }

  public getListingsTotal(): ResultAsync<number, JsonRpcError> {
    return this._handler.call(new GetMarketplaceListingsTotalParams());
  }

  public setDefaultReceivingAddress(
    params: SetDefaultReceivingAddressParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public setReceivingAddress(
    params: SetReceivingAddressParams,
  ): ResultAsync<void, JsonRpcError> {
    return this._handler.call(params);
  }

  public getReceivingAddress(
    params: GetReceivingAddressParams,
  ): ResultAsync<AccountAddress, JsonRpcError> {
    return this._handler.call(params);
  }
}
