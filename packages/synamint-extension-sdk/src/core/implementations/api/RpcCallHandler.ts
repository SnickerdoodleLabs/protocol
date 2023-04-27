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
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
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

import { IRpcCallHandler } from "@synamint-extension-sdk/core/interfaces/api";
import {
  IAccountService,
  IAccountServiceType,
  IDiscordService,
  IDiscordServiceType,
  IInvitationService,
  IInvitationServiceType,
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
  RejectInvitationParams,
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
  GetQueryStatusByQueryCIDParams,
  IConfigProviderType,
  IConfigProvider,
  GetSupportedChainIDsParams,
} from "@synamint-extension-sdk/shared";

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rpcCalls: CoreActionHandler<any>[] = [
    new CoreActionHandler<UnlockParams>(
      // Annoying that we need to do this; TS doesn't support abstract static methods
      UnlockParams.getCoreAction(),
      (params) => {
        return this.accountService.unlock(
          params.accountAddress,
          params.signature,
          params.chain,
          params.languageCode,
        );
      },
    ),
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
        return this.accountService.getUnlockMessage(params.languageCode);
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
    new CoreActionHandler<GetAcceptedInvitationsCIDParams>(
      GetAcceptedInvitationsCIDParams.getCoreAction(),
      (_params) => {
        return this.invitationService
          .getAcceptedInvitationsCID()
          .map((res) => mapToObj(res)); // TODO: mapToObj is probably just for dealing with serialization; the improved serializer in ObjectUtils probably makes this unnecessary.
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
          params.signature,
          params.chain,
          params.languageCode,
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
              return this.invitationService
                .checkInvitationStatus(pageInvitation.invitation)
                .map((invitationStatus) => {
                  console.log("invitationStatus", invitationStatus);
                  if (invitationStatus === EInvitationStatus.New) {
                    const invitationUUID = this.contextProvider.addInvitation(
                      pageInvitation.invitation,
                    );
                    return Object.assign(pageInvitation.domainDetails, {
                      id: invitationUUID,
                      consentAddress:
                        pageInvitation.invitation.consentContractAddress,
                    });
                  } else {
                    return null;
                  }
                });
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
          .map((res) => mapToObj(res));
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
    new CoreActionHandler<RejectInvitationParams>(
      RejectInvitationParams.getCoreAction(),
      (params) => {
        const invitation = this.contextProvider.getInvitation(
          params.id,
        ) as Invitation;
        return this.invitationService.rejectInvitation(invitation);
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
    new CoreActionHandler<InitializeDiscordUserParams>(
      InitializeDiscordUserParams.getCoreAction(),
      (params) => {
        return this.discordService.initializeUserWithAuthorizationCode(
          params.code,
        );
      },
    ),
    new CoreActionHandler<GetDiscordInstallationUrlParams>(
      GetDiscordInstallationUrlParams.getCoreAction(),
      (_params) => {
        return this.discordService.installationUrl();
      },
    ),
    new CoreActionHandler<GetDiscordGuildProfilesParams>(
      GetDiscordGuildProfilesParams.getCoreAction(),
      (_params) => {
        return this.discordService.getGuildProfiles();
      },
    ),
    new CoreActionHandler<GetDiscordUserProfilesParams>(
      GetDiscordUserProfilesParams.getCoreAction(),
      (_params) => {
        return this.discordService.getUserProfiles();
      },
    ),
    new CoreActionHandler<UnlinkDiscordAccountParams>(
      UnlinkDiscordAccountParams.getCoreAction(),
      (params) => {
        return this.discordService.unlink(params.discordProfileId);
      },
    ),
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
          .map((res) => mapToObj(res));
      },
    ),
    new CoreActionHandler<TwitterGetRequestTokenParams>(
      TwitterGetRequestTokenParams.getCoreAction(),
      (_params) => {
        return this.twitterService.getOAuth1aRequestToken();
      },
    ),
    new CoreActionHandler<TwitterLinkProfileParams>(
      TwitterLinkProfileParams.getCoreAction(),
      (params) => {
        return this.twitterService.initTwitterProfile(
          params.requestToken,
          params.oAuthVerifier,
        );
      },
    ),
    new CoreActionHandler<TwitterUnlinkProfileParams>(
      TwitterUnlinkProfileParams.getCoreAction(),
      (params) => {
        return this.twitterService.unlinkProfile(params.id);
      },
    ),
    new CoreActionHandler<TwitterGetLinkedProfilesParams>(
      TwitterGetLinkedProfilesParams.getCoreAction(),
      (_params) => {
        return this.twitterService.getUserProfiles();
      },
    ),
    new CoreActionHandler<GetQueryStatusByQueryCIDParams>(
      GetQueryStatusByQueryCIDParams.getCoreAction(),
      (params) => {
        return this.core.getQueryStatusByQueryCID(params.cid);
      },
    ),
    new CoreActionHandler<GetSupportedChainIDsParams>(
      GetSupportedChainIDsParams.getCoreAction(),
      (_params) => {
        return okAsync(this.configProvider.getConfig().supportedChains);
      },
    ),
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
    @inject(ISnickerdoodleCoreType) protected core: ISnickerdoodleCore,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
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
        } else {
          res.result = ObjectUtils.toGenericObject(result);
        }
      });
  }
}
