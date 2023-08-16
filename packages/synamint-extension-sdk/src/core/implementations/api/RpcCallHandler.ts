/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  Invitation,
  DomainName,
  EarnedReward,
  EChain,
  EInvitationStatus,
  TokenId,
  BigNumberString,
  URLString,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  ECloudStorageType,
  AuthenticatedStorageSettings,
} from "@snickerdoodlelabs/objects";
import {
  ICloudStorageManager,
  ICloudStorageManagerType,
} from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";
import { okAsync, ResultAsync } from "neverthrow";
import { parse } from "tldts";
import { Runtime } from "webextension-polyfill";

import { IRpcCallHandler } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IDiscordService,
  IDiscordServiceType,
  IIntegrationService,
  IIntegrationServiceType,
  IInvitationService,
  IInvitationServiceType,
  IMetricsService,
  IMetricsServiceType,
  IPIIService,
  IPIIServiceType,
  IScamFilterService,
  IScamFilterServiceType,
  ITokenPriceService,
  ITokenPriceServiceType,
  ITwitterService,
  ITwitterServiceType,
  IUserSiteInteractionService,
  IUserSiteInteractionServiceType,
} from "@synamint-extension-sdk/core/interfaces/business";
import {
  IConfigProvider,
  IConfigProviderType,
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
  DEFAULT_RPC_SUCCESS_RESULT,
  ECoreActions,
  UnlockParams,
  GetUnlockMessageParams,
  AddAccountParams,
  SetGivenNameParams,
  SetFamilyNameParams,
  SetBirthdayParams,
  SetGenderParams,
  SetLocationParams,
  SetEmailParams,
  GetInvitationWithDomainParams,
  AcceptInvitationByUUIDParams,
  RejectInvitationByUUIDParams,
  LeaveCohortParams,
  GetInvitationMetadataByCIDParams,
  CheckURLParams,
  GetAgreementPermissionsParams,
  SetDefaultPermissionsWithDataTypesParams,
  SetApplyDefaultPermissionsParams,
  UnlinkAccountParams,
  AcceptInvitationParams,
  ScamFilterSettingsParams,
  GetConsentContractCIDParams,
  CheckInvitationStatusParams,
  GetTokenPriceParams,
  GetTokenMarketDataParams,
  GetTokenInfoParams,
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
  mapToObj,
  GetEarnedRewardsParams,
  GetAccountsParams,
  GetAccountBalancesParams,
  GetAccountNFTsParams,
  GetAgeParams,
  GetGivenNameParams,
  GetEmailParams,
  GetFamilyNameParams,
  GetBirthdayParams,
  GetGenderParams,
  GetLocationParams,
  GetSiteVisitsParams,
  GetSiteVisitsMapParams,
  GetAcceptedInvitationsCIDParams,
  GetAvailableInvitationsCIDParams,
  GetDefaultPermissionsParams,
  SetDefaultPermissionsToAllParams,
  GetApplyDefaultPermissionsOptionParams,
  GetScamFilterSettingsParams,
  CloseTabParams,
  GetStateParams,
  GetInternalStateParams,
  GetDataWalletAddressParams,
  IsDataWalletAddressInitializedParams,
  CoreActionParams,
  InitializeDiscordUserParams,
  GetDiscordInstallationUrlParams,
  GetDiscordGuildProfilesParams,
  GetDiscordUserProfilesParams,
  UnlinkDiscordAccountParams,
  GetMarketplaceListingsByTagParams,
  GetListingsTotalByTagParams,
  GetConsentCapacityParams,
  GetPossibleRewardsParams,
  DEFAULT_SUBDOMAIN,
  TwitterGetRequestTokenParams,
  TwitterLinkProfileParams,
  TwitterUnlinkProfileParams,
  TwitterGetLinkedProfilesParams,
  GetConfigParams,
  SwitchToTabParams,
  GetMetricsParams,
  RequestPermissionsParams,
  GetPermissionsParams,
  GetTokenVerificationPublicKeyParams,
  GetBearerTokenParams,
  GetQueryStatusByCidParams,
  GetDropBoxAuthUrlParams,
  AuthenticateDropboxParams,
  SetAuthenticatedStorageParams,
  GetAvailableCloudStorageOptionsParams,
  GetCurrentCloudStorageParams,
  RejectInvitationParams,
} from "@synamint-extension-sdk/shared";

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rpcCalls: CoreActionHandler<any>[] = [
    new CoreActionHandler<AddAccountParams>(
      AddAccountParams.getCoreAction(),
      (params) => {
        return this.accountService.addAccount(
          params.accountAddress,
          params.signature,
          params.chain,
          params.languageCode,
        );
      },
    ),
    new CoreActionHandler<GetUnlockMessageParams>(
      GetUnlockMessageParams.getCoreAction(),
      (params) => {
        return this.accountService.getLinkAccountMessage(params.languageCode);
      },
    ),
    new CoreActionHandler<GetEarnedRewardsParams>(
      GetEarnedRewardsParams.getCoreAction(),
      (_params) => {
        return this.accountService.getEarnedRewards();
      },
    ),
    new CoreActionHandler<GetAccountsParams>(
      GetAccountsParams.getCoreAction(),
      (_params) => {
        return this.accountService.getAccounts();
      },
    ),
    new CoreActionHandler<GetTokenPriceParams>(
      GetTokenPriceParams.getCoreAction(),
      (params) => {
        return this.tokenPriceService.getTokenPrice(
          params.chainId,
          params.address,
          params.timestamp,
        );
      },
    ),
    new CoreActionHandler<GetTokenMarketDataParams>(
      GetTokenMarketDataParams.getCoreAction(),
      (params) => {
        return this.tokenPriceService.getTokenMarketData(params.ids);
      },
    ),
    new CoreActionHandler<GetTokenInfoParams>(
      GetTokenInfoParams.getCoreAction(),
      (params) => {
        return this.tokenPriceService.getTokenInfo(
          params.chainId,
          params.contractAddress,
        );
      },
    ),
    new CoreActionHandler<GetAccountBalancesParams>(
      GetAccountBalancesParams.getCoreAction(),
      (_params) => {
        return this.accountService.getAccountBalances();
      },
    ),
    new CoreActionHandler<GetAccountNFTsParams>(
      GetAccountNFTsParams.getCoreAction(),
      (_params) => {
        return this.accountService.getAccountNFTs();
      },
    ),
    new CoreActionHandler<SetGivenNameParams>(
      SetGivenNameParams.getCoreAction(),
      (params) => {
        return this.piiService.setGivenName(params.givenName);
      },
    ),
    new CoreActionHandler<SetEmailParams>(
      SetEmailParams.getCoreAction(),
      (params) => {
        return this.piiService.setEmail(params.email);
      },
    ),
    new CoreActionHandler<SetFamilyNameParams>(
      SetFamilyNameParams.getCoreAction(),
      (params) => {
        return this.piiService.setFamilyName(params.familyName);
      },
    ),
    new CoreActionHandler<SetBirthdayParams>(
      SetBirthdayParams.getCoreAction(),
      (params) => {
        return this.piiService.setBirthday(params.birthday);
      },
    ),
    new CoreActionHandler<SetGenderParams>(
      SetGenderParams.getCoreAction(),
      (params) => {
        return this.piiService.setGender(params.gender);
      },
    ),
    new CoreActionHandler<SetLocationParams>(
      SetLocationParams.getCoreAction(),
      (params) => {
        return this.piiService.setLocation(params.location);
      },
    ),
    new CoreActionHandler<GetAgeParams>(
      GetAgeParams.getCoreAction(),
      (_params) => {
        return this.piiService.getAge();
      },
    ),
    new CoreActionHandler<GetGivenNameParams>(
      GetGivenNameParams.getCoreAction(),
      (_params) => {
        return this.piiService.getGivenName();
      },
    ),
    new CoreActionHandler<GetEmailParams>(
      GetEmailParams.getCoreAction(),
      (_params) => {
        return this.piiService.getEmail();
      },
    ),
    new CoreActionHandler<GetFamilyNameParams>(
      GetFamilyNameParams.getCoreAction(),
      (_params) => {
        return this.piiService.getFamilyName();
      },
    ),
    new CoreActionHandler<GetBirthdayParams>(
      GetBirthdayParams.getCoreAction(),
      (_params) => {
        return this.piiService.getBirthday();
      },
    ),
    new CoreActionHandler<GetGenderParams>(
      GetGenderParams.getCoreAction(),
      (_params) => {
        return this.piiService.getGender();
      },
    ),
    new CoreActionHandler<GetLocationParams>(
      GetLocationParams.getCoreAction(),
      (_params) => {
        return this.piiService.getLocation();
      },
    ),
    new CoreActionHandler<GetSiteVisitsParams>(
      GetSiteVisitsParams.getCoreAction(),
      (_params) => {
        return this.userSiteInteractionService.getSiteVisits();
      },
    ),
    new CoreActionHandler<GetSiteVisitsMapParams>(
      GetSiteVisitsMapParams.getCoreAction(),
      (_params) => {
        return this.userSiteInteractionService.getSiteVisitsMap().map((map) => {
          return ObjectUtils.serialize(map);
        });
      },
    ),
    new CoreActionHandler<GetAcceptedInvitationsCIDParams>(
      GetAcceptedInvitationsCIDParams.getCoreAction(),
      (_params) => {
        return this.invitationService.getAcceptedInvitationsCID().map((res) => {
          return ObjectUtils.serialize(res);
        });
      },
    ),
    new CoreActionHandler<SetDefaultReceivingAddressParams>(
      SetDefaultReceivingAddressParams.getCoreAction(),
      (params) => {
        return this.invitationService.setDefaultReceivingAddress(
          params.receivingAddress,
        );
      },
    ),
    new CoreActionHandler<SetReceivingAddressParams>(
      SetReceivingAddressParams.getCoreAction(),
      (params) => {
        return this.invitationService.setReceivingAddress(
          params.contractAddress,
          params.receivingAddress,
        );
      },
    ),
    new CoreActionHandler<GetReceivingAddressParams>(
      GetReceivingAddressParams.getCoreAction(),
      (params) => {
        return this.invitationService.getReceivingAddress(
          params.contractAddress,
        );
      },
    ),
    new CoreActionHandler<GetInvitationMetadataByCIDParams>(
      GetInvitationMetadataByCIDParams.getCoreAction(),
      (params) => {
        return this.invitationService.getInvitationMetadataByCID(
          params.ipfsCID,
        );
      },
    ),
    new CoreActionHandler<CheckInvitationStatusParams>(
      CheckInvitationStatusParams.getCoreAction(),
      (params) => {
        return this._getTokenId(params.tokenId).andThen((tokenId) => {
          return this.invitationService.checkInvitationStatus(
            new Invitation(
              "" as DomainName,
              params.consentAddress,
              tokenId,
              params.signature ?? null,
            ),
          );
        });
      },
    ),
    new CoreActionHandler<GetConsentContractCIDParams>(
      GetConsentContractCIDParams.getCoreAction(),
      (params) => {
        return this.invitationService.getConsentContractCID(
          params.consentAddress,
        );
      },
    ),
    new CoreActionHandler<UnlinkAccountParams>(
      UnlinkAccountParams.getCoreAction(),
      (params) => {
        return this.accountService.unlinkAccount(
          params.accountAddress,
          params.chain,
        );
      },
    ),
    new CoreActionHandler<LeaveCohortParams>(
      LeaveCohortParams.getCoreAction(),
      (params) => {
        return this.invitationService.leaveCohort(
          params.consentContractAddress,
        );
      },
    ),
    new CoreActionHandler<GetInvitationWithDomainParams>(
      GetInvitationWithDomainParams.getCoreAction(),
      (params) => {
        return this.invitationService
          .getInvitationByDomain(params.domain)
          .andThen((pageInvitations) => {
            console.log("pageInvitations", pageInvitations);
            const pageInvitation = pageInvitations.find((value) => {
              const incomingUrl = value.url.replace(/^https?:\/\//, "");
              const incomingUrlInfo = parse(incomingUrl);
              if (!incomingUrlInfo.subdomain && parse(params.path).subdomain) {
                return (
                  `${DEFAULT_SUBDOMAIN}.${incomingUrl.replace(/\/$/, "")}` ===
                  params.path
                );
              }
              return incomingUrl.replace(/\/$/, "") === params.path;
            });
            if (pageInvitation) {
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
      },
    ),
    new CoreActionHandler<GetAvailableInvitationsCIDParams>(
      GetAvailableInvitationsCIDParams.getCoreAction(),
      (_params) => {
        return this.invitationService
          .getAvailableInvitationsCID()
          .map((res) => {
            return ObjectUtils.serialize(res);
          });
      },
    ),
    new CoreActionHandler<GetAgreementPermissionsParams>(
      GetAgreementPermissionsParams.getCoreAction(),
      (params) => {
        return this.invitationService.getAgreementPermissions(
          params.consentContractAddress,
        );
      },
    ),
    new CoreActionHandler<GetDefaultPermissionsParams>(
      GetDefaultPermissionsParams.getCoreAction(),
      (_params) => {
        return this.dataPermissionsUtils.defaultFlags.andThen((flags) =>
          this.dataPermissionsUtils.getDataTypesFromFlagsString(flags),
        );
      },
    ),
    new CoreActionHandler<SetDefaultPermissionsWithDataTypesParams>(
      SetDefaultPermissionsWithDataTypesParams.getCoreAction(),
      (params) => {
        return this.dataPermissionsUtils.setDefaultFlagsWithDataTypes(
          params.dataTypes,
        );
      },
    ),
    new CoreActionHandler<SetDefaultPermissionsToAllParams>(
      SetDefaultPermissionsToAllParams.getCoreAction(),
      (_params) => {
        return this.dataPermissionsUtils.setDefaultFlagsToAll();
      },
    ),
    new CoreActionHandler<GetApplyDefaultPermissionsOptionParams>(
      GetApplyDefaultPermissionsOptionParams.getCoreAction(),
      (_params) => {
        return this.dataPermissionsUtils.applyDefaultPermissionsOption;
      },
    ),
    new CoreActionHandler<SetApplyDefaultPermissionsParams>(
      SetApplyDefaultPermissionsParams.getCoreAction(),
      (params) => {
        return this.dataPermissionsUtils.setApplyDefaultPermissionsOption(
          params.option,
        );
      },
    ),
    new CoreActionHandler<AcceptInvitationByUUIDParams>(
      AcceptInvitationByUUIDParams.getCoreAction(),
      (params) => {
        const invitation = this.contextProvider.getInvitation(
          params.id,
        ) as Invitation;
        return this.invitationService.acceptInvitation(
          invitation,
          params.dataTypes,
        );
      },
    ),
    new CoreActionHandler<GetScamFilterSettingsParams>(
      GetScamFilterSettingsParams.getCoreAction(),
      (_params) => {
        return this.scamFilterSettingsUtils.getScamFilterSettings();
      },
    ),
    new CoreActionHandler<ScamFilterSettingsParams>(
      ScamFilterSettingsParams.getCoreAction(),
      (params) => {
        return this.scamFilterSettingsUtils.setScamFilterSettings(
          params.isScamFilterActive,
          params.showMessageEveryTime,
        );
      },
    ),
    new CoreActionHandler<AcceptInvitationParams>(
      AcceptInvitationParams.getCoreAction(),
      (params) => {
        return this._getTokenId(params.tokenId).andThen((tokenId) => {
          return this.invitationService.acceptInvitation(
            new Invitation(
              "" as DomainName,
              params.consentContractAddress,
              tokenId,
              params.businessSignature ?? null,
            ),
            params.dataTypes,
          );
        });
      },
    ),
    new CoreActionHandler<RejectInvitationByUUIDParams>(
      RejectInvitationByUUIDParams.getCoreAction(),
      (params) => {
        const invitation = this.contextProvider.getInvitation(
          params.id,
        ) as Invitation;
        return this.invitationService.rejectInvitation(invitation);
      },
    ),
    new CoreActionHandler<RejectInvitationParams>(
      RejectInvitationParams.getCoreAction(),
      (params) => {
        return this._getTokenId(params.tokenId).andThen((tokenId) => {
          return this.invitationService.rejectInvitation(
            new Invitation(
              "" as DomainName,
              params.consentContractAddress,
              tokenId,
              params.businessSignature ?? null,
            ),
            params.rejectUntil,
          );
        });
      },
    ),
    new CoreActionHandler<CheckURLParams>(
      CheckURLParams.getCoreAction(),
      (params) => {
        return this.scamFilterService.checkURL(params.domain);
      },
    ),
    new CoreActionHandler<CloseTabParams>(
      CloseTabParams.getCoreAction(),
      (_params, sender) => {
        sender?.tab?.id && ExtensionUtils.closeTab(sender.tab.id);
        return okAsync(undefined);
      },
    ),
    new CoreActionHandler<GetStateParams>(
      GetStateParams.getCoreAction(),
      (_params) => {
        return okAsync(this.contextProvider.getExterenalState());
      },
    ),
    new CoreActionHandler<GetInternalStateParams>(
      GetInternalStateParams.getCoreAction(),
      (_params) => {
        return okAsync(this.contextProvider.getInternalState());
      },
    ),
    new CoreActionHandler<GetDataWalletAddressParams>(
      GetDataWalletAddressParams.getCoreAction(),
      (_params) => {
        return okAsync(this.contextProvider.getAccountContext().getAccount());
      },
    ),
    new CoreActionHandler<IsDataWalletAddressInitializedParams>(
      IsDataWalletAddressInitializedParams.getCoreAction(),
      (_params) => {
        return this.accountService.isDataWalletAddressInitialized();
      },
    ),
    new CoreActionHandler<GetQueryStatusByCidParams>(
      GetQueryStatusByCidParams.getCoreAction(),
      (params) => {
        return this.accountService.getQueryStatusByQueryCID(params.queryCID);
      },
    ),
    new CoreActionHandler<SwitchToTabParams>(
      SwitchToTabParams.getCoreAction(),
      (params, sender) => {
        return (
          sender?.tab?.id
            ? ExtensionUtils.closeTab(sender.tab.id)
            : okAsync(undefined)
        ).andThen(() => {
          return ExtensionUtils.switchToTab(params.tabId).map(() => {});
        });
      },
    ),
    // #region Discord
    new CoreActionHandler<InitializeDiscordUserParams>(
      InitializeDiscordUserParams.getCoreAction(),
      (params, sender) => {
        return this.discordService.initializeUserWithAuthorizationCode(
          params.code,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<GetDiscordInstallationUrlParams>(
      GetDiscordInstallationUrlParams.getCoreAction(),
      (params, sender) => {
        // This is a bit of a hack, but literally the ONLY place we can
        // get a tab ID is from this message sender in the extension.
        // But the URL must be formulated in the core itself, so we pass
        // the tab ID directly to the core. So what we do is we'll pass
        // any redirectTabId in the params, and overrride it with the
        // sender.tab.id which will be accurate.
        if (params.redirectTabId != null && sender?.tab?.id != null) {
          return this.discordService.installationUrl(
            sender.tab.id,
            this.getDomainFromSender(sender),
          );
        }

        return this.discordService.installationUrl(
          undefined,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<GetDiscordGuildProfilesParams>(
      GetDiscordGuildProfilesParams.getCoreAction(),
      (_params, sender) => {
        return this.discordService.getGuildProfiles(
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<GetDiscordUserProfilesParams>(
      GetDiscordUserProfilesParams.getCoreAction(),
      (_params, sender) => {
        return this.discordService.getUserProfiles(
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<UnlinkDiscordAccountParams>(
      UnlinkDiscordAccountParams.getCoreAction(),
      (params, sender) => {
        return this.discordService.unlink(
          params.discordProfileId,
          this.getDomainFromSender(sender),
        );
      },
    ),
    // #endregion

    new CoreActionHandler<GetMarketplaceListingsByTagParams>(
      GetMarketplaceListingsByTagParams.getCoreAction(),
      (params) => {
        return this.invitationService.getMarketplaceListingsByTag(
          params.pagingReq,
          params.tag,
          params.filterActive,
        );
      },
    ),
    new CoreActionHandler<GetListingsTotalByTagParams>(
      GetListingsTotalByTagParams.getCoreAction(),
      (params) => {
        return this.invitationService.getListingsTotalByTag(params.tag);
      },
    ),
    new CoreActionHandler<GetConsentCapacityParams>(
      GetConsentCapacityParams.getCoreAction(),
      (params) => {
        return this.invitationService.getConsentCapacity(
          params.contractAddress,
        );
      },
    ),
    new CoreActionHandler<GetPossibleRewardsParams>(
      GetPossibleRewardsParams.getCoreAction(),
      (params) => {
        return this.invitationService
          .getPossibleRewards(params.contractAddresses, params.timeoutMs)
          .map((res) => {
            return ObjectUtils.serialize(res);
          });
      },
    ),

    // #region Twitter
    new CoreActionHandler<TwitterGetRequestTokenParams>(
      TwitterGetRequestTokenParams.getCoreAction(),
      (_params, sender) => {
        return this.twitterService.getOAuth1aRequestToken(
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<TwitterLinkProfileParams>(
      TwitterLinkProfileParams.getCoreAction(),
      (params, sender) => {
        return this.twitterService.initTwitterProfile(
          params.requestToken,
          params.oAuthVerifier,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<TwitterUnlinkProfileParams>(
      TwitterUnlinkProfileParams.getCoreAction(),
      (params, sender) => {
        return this.twitterService.unlinkProfile(
          params.id,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<TwitterGetLinkedProfilesParams>(
      TwitterGetLinkedProfilesParams.getCoreAction(),
      (_params, sender) => {
        return this.twitterService.getUserProfiles(
          this.getDomainFromSender(sender),
        );
      },
    ),
    // #endregion

    new CoreActionHandler<GetConfigParams>(
      GetConfigParams.getCoreAction(),
      (_params) => {
        return okAsync(this.configProvider.getConfig());
      },
    ),

    // #region Metrics
    new CoreActionHandler<GetMetricsParams>(
      GetMetricsParams.getCoreAction(),
      (_params, sender) => {
        return this.metricsService.getMetrics(this.getDomainFromSender(sender));
      },
    ),
    // #endregion
    // #region Integration
    new CoreActionHandler<RequestPermissionsParams>(
      RequestPermissionsParams.getCoreAction(),
      (params, sender) => {
        return this.integrationService.requestPermissions(
          params.permissions,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<GetPermissionsParams>(
      GetPermissionsParams.getCoreAction(),
      (params, sender) => {
        return this.integrationService.getPermissions(
          params.domain,
          this.getDomainFromSender(sender),
        );
      },
    ),
    new CoreActionHandler<GetTokenVerificationPublicKeyParams>(
      GetTokenVerificationPublicKeyParams.getCoreAction(),
      (params) => {
        return this.integrationService.getTokenVerificationPublicKey(
          params.domain,
        );
      },
    ),
    new CoreActionHandler<GetBearerTokenParams>(
      GetBearerTokenParams.getCoreAction(),
      (params) => {
        return this.integrationService.getBearerToken(
          params.nonce,
          params.domain,
        );
      },
    ),

    new CoreActionHandler<GetDropBoxAuthUrlParams>(
      GetDropBoxAuthUrlParams.getCoreAction(),
      (_params) => {
        return this.core.storage.getDropboxAuth(undefined);
      },
    ),

    new CoreActionHandler<AuthenticateDropboxParams>(
      AuthenticateDropboxParams.getCoreAction(),
      (params) => {
        return this.core.storage.authenticateDropbox(params.code, undefined);
      },
    ),

    new CoreActionHandler<SetAuthenticatedStorageParams>(
      SetAuthenticatedStorageParams.getCoreAction(),
      (params) => {
        return this.core.storage.setAuthenticatedStorage(
          params.storageType,
          params.path,
          params.accessToken,
          undefined,
        );
      },
    ),

    new CoreActionHandler<GetAvailableCloudStorageOptionsParams>(
      GetAvailableCloudStorageOptionsParams.getCoreAction(),
      (_params) => {
        return this.core.storage.getAvailableCloudStorageOptions(undefined);
      },
    ),

    new CoreActionHandler<GetCurrentCloudStorageParams>(
      GetCurrentCloudStorageParams.getCoreAction(),
      (_params) => {
        return this.core.storage.getCurrentCloudStorage(undefined);
      },
    ),
    // #endregion
  ];

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
    @inject(IDiscordServiceType)
    protected discordService: IDiscordService,
    @inject(ITwitterServiceType)
    protected twitterService: ITwitterService,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(IMetricsServiceType) protected metricsService: IMetricsService,
    @inject(IIntegrationServiceType)
    protected integrationService: IIntegrationService,
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
  ) {
    const { method, params } = req;

    // Find the action
    const externalActionHandler = this.rpcCalls.find((rpc) => {
      return rpc.action == method;
    });

    // No action found
    if (externalActionHandler == null) {
      console.warn(
        `No action handler found for ${method} in RpcCallHandler, skipping!`,
      );
      return next();
    }

    return externalActionHandler.execute(params, res, sender);
  }

  private _getTokenId(tokenId: BigNumberString | undefined) {
    if (tokenId) {
      return okAsync(TokenId(BigInt(tokenId)));
    }
    return this.cryptoUtils.getTokenId();
  }

  private getDomainFromSender(
    sender: Runtime.MessageSender | undefined,
  ): DomainName {
    // TODO: If the sender is undefined we need to do something smart here.
    const url = new URL(sender?.tab?.url ?? "");
    return DomainName(url.hostname);
  }
}

class CoreActionHandler<
  TParams extends CoreActionParams<ReturnType<TParams["returnMethodMarker"]>>,
> {
  public constructor(
    public action: ECoreActions,
    public handler: (
      params: TParams,
      sender?: Runtime.MessageSender | undefined,
    ) => ResultAsync<ReturnType<TParams["returnMethodMarker"]>, unknown>,
  ) {}

  public async execute(
    params: TParams,
    res: PendingJsonRpcResponse<unknown>,
    sender: Runtime.MessageSender | undefined,
  ): Promise<void> {
    await this.handler(params!, sender)
      .mapErr((err) => {
        res.error = err as Error;
      })
      .map((result) => {
        if (typeof result === typeof undefined) {
          res.result = DEFAULT_RPC_SUCCESS_RESULT;
        } else if (typeof result === "string") {
          res.result = result;
        } else {
          res.result = ObjectUtils.toGenericObject(result);
        }
      });
  }
}
