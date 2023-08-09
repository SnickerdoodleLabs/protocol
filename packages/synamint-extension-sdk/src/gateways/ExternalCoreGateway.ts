import {
  AccountAddress,
  Age,
  OAuth1RequstToken,
  CountryCode,
  EmailAddressString,
  EVMContractAddress,
  EWalletDataType,
  FamilyName,
  Gender,
  GivenName,
  IOpenSeaMetadata,
  IpfsCID,
  LinkedAccount,
  DataWalletAddress,
  EInvitationStatus,
  WalletNFT,
  TokenBalance,
  EarnedReward,
  TokenInfo,
  TokenMarketData,
  TwitterID,
  TwitterProfile,
  UnixTimestamp,
  URLString,
  MarketplaceListing,
  IConsentCapacity,
  PossibleReward,
  PagedResponse,
  IProxyDiscordMethods,
  DiscordProfile,
  DiscordGuildProfile,
  OAuthAuthorizationCode,
  IProxyTwitterMethods,
  DiscordID,
  OAuthVerifier,
  TokenAndSecret,
  SiteVisit,
  ProxyError,
  IProxyMetricsMethods,
  RuntimeMetrics,
  IProxyIntegrationMethods,
  EDataWalletPermission,
  DomainName,
  PEMEncodedRSAPublicKey,
  JsonWebToken,
  QueryStatus,
  AccessToken,
  ECloudStorageType,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import {
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
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
  IScamFilterPreferences,
  IExternalState,
  UnlockParams,
  AddAccountParams,
  UnlinkAccountParams,
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
  GetMarketplaceListingsByTagParams,
  GetListingsTotalByTagParams,
  GetConsentCapacityParams,
  GetPossibleRewardsParams,
  TwitterLinkProfileParams,
  TwitterUnlinkProfileParams,
  TwitterGetRequestTokenParams,
  TwitterGetLinkedProfilesParams,
  GetConfigParams,
  SwitchToTabParams,
  GetMetricsParams,
  GetUnlockedParams,
  RequestPermissionsParams,
  GetPermissionsParams,
  GetTokenVerificationPublicKeyParams,
  GetBearerTokenParams,
  GetQueryStatusByCidParams,
  GetDropBoxAuthUrlParams,
  AuthenticateDropboxParams,
  SetAuthenticatedStorageParams,
  GetAvailableCloudStorageOptionsParams,
  getCurrentCloudStorageParams,
} from "@synamint-extension-sdk/shared";
import { IExtensionConfig } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

export class ExternalCoreGateway {
  public discord: IProxyDiscordMethods;
  public integration: IProxyIntegrationMethods;
  public metrics: IProxyMetricsMethods;
  public twitter: IProxyTwitterMethods;
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);

    this.discord = {
      initializeUserWithAuthorizationCode: (
        code: OAuthAuthorizationCode,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(new InitializeDiscordUserParams(code));
      },
      installationUrl: (
        redirectTabId: number | undefined = undefined,
      ): ResultAsync<URLString, ProxyError> => {
        return this._handler.call(
          new GetDiscordInstallationUrlParams(redirectTabId),
        );
      },
      getUserProfiles: (): ResultAsync<DiscordProfile[], ProxyError> => {
        return this._handler.call(new GetDiscordUserProfilesParams());
      },
      getGuildProfiles: (): ResultAsync<DiscordGuildProfile[], ProxyError> => {
        return this._handler.call(new GetDiscordGuildProfilesParams());
      },
      unlink: (discordProfileId: DiscordID) => {
        return this._handler.call(
          new UnlinkDiscordAccountParams(discordProfileId),
        );
      },
    };

    this.integration = {
      requestPermissions: (
        permissions: EDataWalletPermission[],
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        return this._handler.call(new RequestPermissionsParams(permissions));
      },
      getPermissions: (
        domain: DomainName,
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        return this._handler.call(new GetPermissionsParams(domain));
      },
      getTokenVerificationPublicKey: (
        domain: DomainName,
      ): ResultAsync<PEMEncodedRSAPublicKey, ProxyError> => {
        return this._handler.call(
          new GetTokenVerificationPublicKeyParams(domain),
        );
      },
      getBearerToken: (
        nonce: string,
        domain: DomainName,
      ): ResultAsync<JsonWebToken, ProxyError> => {
        return this._handler.call(new GetBearerTokenParams(nonce, domain));
      },
    };

    this.metrics = {
      getMetrics: (): ResultAsync<RuntimeMetrics, ProxyError> => {
        return this._handler.call(new GetMetricsParams());
      },
      getUnlocked: (): ResultAsync<boolean, ProxyError> => {
        return this._handler.call(new GetUnlockedParams());
      },
    };

    this.twitter = {
      getOAuth1aRequestToken: (): ResultAsync<TokenAndSecret, ProxyError> => {
        return this._handler.call(new TwitterGetRequestTokenParams());
      },
      initTwitterProfile: (
        requestToken: OAuth1RequstToken,
        oAuthVerifier: OAuthVerifier,
      ): ResultAsync<TwitterProfile, ProxyError> => {
        return this._handler.call(
          new TwitterLinkProfileParams(requestToken, oAuthVerifier),
        );
      },
      unlinkProfile: (id: TwitterID): ResultAsync<void, ProxyError> => {
        return this._handler.call(new TwitterUnlinkProfileParams(id));
      },
      getUserProfiles: (): ResultAsync<TwitterProfile[], ProxyError> => {
        return this._handler.call(new TwitterGetLinkedProfilesParams());
      },
    };
  }

  public updateRpcEngine(rpcEngine: JsonRpcEngine) {
    this._handler.updateRpcEngine(rpcEngine);
  }

  public getState(): ResultAsync<IExternalState, ProxyError> {
    return this._handler.call(new GetStateParams());
  }

  public getInvitationsByDomain(
    params: GetInvitationWithDomainParams,
  ): ResultAsync<IInvitationDomainWithUUID | null, ProxyError> {
    return this._handler.call(params);
  }

  public acceptInvitationByUUID(
    params: AcceptInvitationByUUIDParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._handler.call(new GetAvailableInvitationsCIDParams());
  }

  public acceptInvitation(
    params: AcceptInvitationParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getAgreementPermissions(
    params: GetAgreementPermissionsParams,
  ): ResultAsync<EWalletDataType[], ProxyError> {
    return this._handler.call(params);
  }

  public getDefaultPermissions(): ResultAsync<EWalletDataType[], ProxyError> {
    return this._handler.call(new GetDefaultPermissionsParams());
  }

  public setDefaultPermissionsWithDataTypes(
    params: SetDefaultPermissionsWithDataTypesParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, ProxyError> {
    return this._handler.call(new SetDefaultPermissionsToAllParams());
  }

  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    ProxyError
  > {
    return this._handler.call(new GetScamFilterSettingsParams());
  }

  public setScamFilterSettings(
    params: ScamFilterSettingsParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public rejectInvitation(
    params: RejectInvitationParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._handler.call(new GetAcceptedInvitationsCIDParams());
  }

  public getInvitationMetadataByCID(
    params: GetInvitationMetadataByCIDParams,
  ): ResultAsync<IOpenSeaMetadata, ProxyError> {
    return this._handler.call(params);
  }

  public leaveCohort(params: LeaveCohortParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public addAccount(params: AddAccountParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public unlock(params: UnlockParams): ResultAsync<void, ProxyError> {
    return this._handler.call<UnlockParams>(params);
  }
  public unlinkAccount(
    params: UnlinkAccountParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public getUnlockMessage(
    params: GetUnlockMessageParams,
  ): ResultAsync<string, ProxyError> {
    return this._handler.call(params);
  }
  public getApplyDefaultPermissionsOption(): ResultAsync<boolean, ProxyError> {
    return this._handler.call(new GetApplyDefaultPermissionsOptionParams());
  }
  public setApplyDefaultPermissionsOption(
    params: SetApplyDefaultPermissionsParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public getAccounts(): ResultAsync<LinkedAccount[], ProxyError> {
    return this._handler.call(new GetAccountsParams());
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], ProxyError> {
    return this._handler.call(new GetAccountBalancesParams());
  }

  public getTokenPrice(
    params: GetTokenPriceParams,
  ): ResultAsync<number, ProxyError> {
    return this._handler.call(params);
  }

  public getTokenMarketData(
    params: GetTokenMarketDataParams,
  ): ResultAsync<TokenMarketData[], ProxyError> {
    return this._handler.call(params);
  }
  public getTokenInfo(
    params: GetTokenInfoParams,
  ): ResultAsync<TokenInfo | null, ProxyError> {
    return this._handler.call(params);
  }
  public getAccountNFTs(): ResultAsync<WalletNFT[], ProxyError> {
    return this._handler.call(new GetAccountNFTsParams());
  }

  public setFamilyName(
    params: SetFamilyNameParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public setGivenName(
    params: SetGivenNameParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public setBirtday(params: SetBirthdayParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public setEmail(params: SetEmailParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public setGender(params: SetGenderParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }
  public setLocation(params: SetLocationParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getAge(): ResultAsync<Age | null, ProxyError> {
    return this._handler.call(new GetAgeParams());
  }
  public getFamilyName(): ResultAsync<FamilyName | null, ProxyError> {
    return this._handler.call(new GetFamilyNameParams());
  }
  public getGivenName(): ResultAsync<GivenName | null, ProxyError> {
    return this._handler.call(new GetGivenNameParams());
  }
  public getBirtday(): ResultAsync<UnixTimestamp | null, ProxyError> {
    return this._handler.call(new GetBirthdayParams());
  }
  public getEmail(): ResultAsync<EmailAddressString | null, ProxyError> {
    return this._handler.call(new GetEmailParams());
  }
  public getGender(): ResultAsync<Gender | null, ProxyError> {
    return this._handler.call(new GetGenderParams());
  }
  public getLocation(): ResultAsync<CountryCode | null, ProxyError> {
    return this._handler.call(new GetLocationParams());
  }
  public isDataWalletAddressInitialized(): ResultAsync<boolean, ProxyError> {
    return this._handler.call(new IsDataWalletAddressInitializedParams());
  }
  public closeTab(): ResultAsync<void, ProxyError> {
    return this._handler.call(new CloseTabParams());
  }
  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    ProxyError
  > {
    return this._handler.call(new GetDataWalletAddressParams());
  }
  public checkURL(params: CheckURLParams): ResultAsync<string, ProxyError> {
    return this._handler.call(params);
  }

  public checkInvitationStatus(
    params: CheckInvitationStatusParams,
  ): ResultAsync<EInvitationStatus, ProxyError> {
    return this._handler.call(params);
  }

  public getContractCID(
    params: GetConsentContractCIDParams,
  ): ResultAsync<IpfsCID, ProxyError> {
    return this._handler.call(params);
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], ProxyError> {
    return this._handler.call(new GetEarnedRewardsParams());
  }

  public getQueryStatusByQueryCID(
    params: GetQueryStatusByCidParams,
  ): ResultAsync<QueryStatus | null, ProxyError> {
    return this._handler.call(params);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], ProxyError> {
    return this._handler.call(new GetSiteVisitsParams());
  }

  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError> {
    return this._handler.call(new GetSiteVisitsMapParams());
  }

  public getMarketplaceListingsByTag(
    params: GetMarketplaceListingsByTagParams,
  ): ResultAsync<PagedResponse<MarketplaceListing>, ProxyError> {
    return this._handler.call(params);
  }

  public getListingsTotalByTag(
    params: GetListingsTotalByTagParams,
  ): ResultAsync<number, ProxyError> {
    return this._handler.call(params);
  }

  public setDefaultReceivingAddress(
    params: SetDefaultReceivingAddressParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public setReceivingAddress(
    params: SetReceivingAddressParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getReceivingAddress(
    params: GetReceivingAddressParams,
  ): ResultAsync<AccountAddress, ProxyError> {
    return this._handler.call(params);
  }

  public getConsentCapacity(
    params: GetConsentCapacityParams,
  ): ResultAsync<IConsentCapacity, ProxyError> {
    return this._handler.call(params);
  }

  public getPossibleRewards(
    params: GetPossibleRewardsParams,
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, ProxyError> {
    return this._handler.call(params);
  }
  public getConfig(): ResultAsync<IExtensionConfig, ProxyError> {
    return this._handler.call(new GetConfigParams());
  }
  public switchToTab(params: SwitchToTabParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getDropboxAuth(): ResultAsync<URLString, ProxyError> {
    return this._handler.call(new GetDropBoxAuthUrlParams());
  }

  public authenticateDropbox(
    params: AuthenticateDropboxParams,
  ): ResultAsync<AccessToken, ProxyError> {
    return this._handler.call(params);
  }

  public setAuthenticatedStorage(
    params: SetAuthenticatedStorageParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getCurrentCloudStorage(): ResultAsync<ECloudStorageType, ProxyError> {
    return this._handler.call(new getCurrentCloudStorageParams());
  }

  public getAvailableCloudStorageOptions(): ResultAsync<
    Set<ECloudStorageType>,
    ProxyError
  > {
    return this._handler.call(new GetAvailableCloudStorageOptionsParams());
  }
}
