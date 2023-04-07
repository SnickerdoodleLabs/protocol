/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ObjectUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  Invitation,
  DomainName,
  EInvitationStatus,
  TokenId,
  BigNumberString,
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
  GetMarketplaceListingsParams,
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
  mapToObj,
} from "@synamint-extension-sdk/shared";

class ExternalActionHandler<TParams> {
  public constructor(
    public action: ECoreActions,
    public handler: (
      params: TParams,
      sender?: Runtime.MessageSender | undefined,
    ) => ResultAsync<unknown, unknown>,
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

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rpcCalls: ExternalActionHandler<any>[] = [
    new ExternalActionHandler<UnlockParams>(ECoreActions.UNLOCK, (params) => {
      return this.accountService.unlock(
        params.accountAddress,
        params.signature,
        params.chain,
        params.languageCode,
      );
    }),
    new ExternalActionHandler<AddAccountParams>(
      ECoreActions.ADD_ACCOUNT,
      (params) => {
        return this.accountService.addAccount(
          params.accountAddress,
          params.signature,
          params.chain,
          params.languageCode,
        );
      },
    ),
    new ExternalActionHandler<GetUnlockMessageParams>(
      ECoreActions.GET_UNLOCK_MESSAGE,
      (params) => {
        return this.accountService.getUnlockMessage(params.languageCode);
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_EARNED_REWARDS,
      (_params) => {
        return this.accountService.getEarnedRewards();
      },
    ),
    new ExternalActionHandler<unknown>(ECoreActions.GET_ACCOUNTS, (_params) => {
      return this.accountService.getAccounts();
    }),
    new ExternalActionHandler<GetTokenPriceParams>(
      ECoreActions.GET_TOKEN_PRICE,
      (params) => {
        return this.tokenPriceService.getTokenPrice(
          params.chainId,
          params.address,
          params.timestamp,
        );
      },
    ),
    new ExternalActionHandler<GetTokenMarketDataParams>(
      ECoreActions.GET_TOKEN_MARKET_DATA,
      (params) => {
        return this.tokenPriceService.getTokenMarketData(params.ids);
      },
    ),
    new ExternalActionHandler<GetTokenInfoParams>(
      ECoreActions.GET_TOKEN_INFO,
      (params) => {
        return this.tokenPriceService.getTokenInfo(
          params.chainId,
          params.contractAddress,
        );
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_ACCOUNT_BALANCES,
      (_params) => {
        return this.accountService.getAccountBalances();
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_ACCOUNT_NFTS,
      (_params) => {
        return this.accountService.getAccountNFTs();
      },
    ),
    new ExternalActionHandler<SetGivenNameParams>(
      ECoreActions.SET_GIVEN_NAME,
      (params) => {
        return this.piiService.setGivenName(params.givenName);
      },
    ),
    new ExternalActionHandler<SetEmailParams>(
      ECoreActions.SET_EMAIL,
      (params) => {
        return this.piiService.setEmail(params.email);
      },
    ),
    new ExternalActionHandler<SetFamilyNameParams>(
      ECoreActions.SET_FAMILY_NAME,
      (params) => {
        return this.piiService.setFamilyName(params.familyName);
      },
    ),
    new ExternalActionHandler<SetBirthdayParams>(
      ECoreActions.SET_BIRTHDAY,
      (params) => {
        return this.piiService.setBirthday(params.birthday);
      },
    ),
    new ExternalActionHandler<SetGenderParams>(
      ECoreActions.SET_GENDER,
      (params) => {
        return this.piiService.setGender(params.gender);
      },
    ),
    new ExternalActionHandler<SetLocationParams>(
      ECoreActions.SET_LOCATION,
      (params) => {
        return this.piiService.setLocation(params.location);
      },
    ),
    new ExternalActionHandler<unknown>(ECoreActions.GET_AGE, (_params) => {
      return this.piiService.getAge();
    }),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_GIVEN_NAME,
      (_params) => {
        return this.piiService.getGivenName();
      },
    ),
    new ExternalActionHandler<unknown>(ECoreActions.GET_EMAIL, (_params) => {
      return this.piiService.getEmail();
    }),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_FAMILY_NAME,
      (_params) => {
        return this.piiService.getFamilyName();
      },
    ),
    new ExternalActionHandler<unknown>(ECoreActions.GET_BIRTHDAY, (_params) => {
      return this.piiService.getBirthday();
    }),
    new ExternalActionHandler<unknown>(ECoreActions.GET_GENDER, (_params) => {
      return this.piiService.getGender();
    }),
    new ExternalActionHandler<unknown>(ECoreActions.GET_LOCATION, (_params) => {
      return this.piiService.getLocation();
    }),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_SITE_VISITS,
      (_params) => {
        return this.userSiteInteractionService.getSiteVisits();
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_SITE_VISITS_MAP,
      (_params) => {
        return this.userSiteInteractionService.getSiteVisitsMap();
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_ACCEPTED_INVITATIONS_CID,
      (_params) => {
        return this.invitationService
          .getAcceptedInvitationsCID()
          .map((res) => mapToObj(res)); // TODO: mapToObj is probably just for dealing with serialization; the improved serializer in ObjectUtils probably makes this unnecessary.
      },
    ),
    new ExternalActionHandler<SetDefaultReceivingAddressParams>(
      ECoreActions.SET_DEFAULT_RECEIVING_ACCOUNT,
      (params) => {
        return this.invitationService.setDefaultReceivingAddress(
          params.receivingAddress,
        );
      },
    ),
    new ExternalActionHandler<SetReceivingAddressParams>(
      ECoreActions.SET_RECEIVING_ACCOUNT,
      (params) => {
        return this.invitationService.setReceivingAddress(
          params.contractAddress,
          params.receivingAddress,
        );
      },
    ),
    new ExternalActionHandler<GetReceivingAddressParams>(
      ECoreActions.GET_RECEIVING_ACCOUNT,
      (params) => {
        return this.invitationService.getReceivingAddress(
          params.contractAddress,
        );
      },
    ),
    new ExternalActionHandler<GetInvitationMetadataByCIDParams>(
      ECoreActions.GET_INVITATION_METADATA_BY_CID,
      (params) => {
        return this.invitationService.getInvitationMetadataByCID(
          params.ipfsCID,
        );
      },
    ),
    new ExternalActionHandler<CheckInvitationStatusParams>(
      ECoreActions.CHECK_INVITATION_STATUS,
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
    new ExternalActionHandler<GetMarketplaceListingsParams>(
      ECoreActions.GET_MARKETPLACE_LISTINGS,
      (params) => {
        return this.invitationService.getMarketplaceListings(
          params.count,
          params.headAt,
        );
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_LISTING_TOTAL,
      (_params) => {
        return this.invitationService.getListingsTotal();
      },
    ),
    new ExternalActionHandler<GetConsentContractCIDParams>(
      ECoreActions.GET_CONTRACT_CID,
      (params) => {
        return this.invitationService.getConsentContractCID(
          params.consentAddress,
        );
      },
    ),
    new ExternalActionHandler<UnlinkAccountParams>(
      ECoreActions.UNLINK_ACCOUNT,
      (params) => {
        return this.accountService.unlinkAccount(
          params.accountAddress,
          params.signature,
          params.chain,
          params.languageCode,
        );
      },
    ),
    new ExternalActionHandler<LeaveCohortParams>(
      ECoreActions.LEAVE_COHORT,
      (params) => {
        return this.invitationService.leaveCohort(
          params.consentContractAddress,
        );
      },
    ),
    new ExternalActionHandler<GetInvitationWithDomainParams>(
      ECoreActions.GET_COHORT_INVITATION_WITH_DOMAIN,
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
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_AVAILABLE_INVITATIONS_CID,
      (_params) => {
        return this.invitationService
          .getAvailableInvitationsCID()
          .map((res) => mapToObj(res));
      },
    ),
    new ExternalActionHandler<GetAgreementPermissionsParams>(
      ECoreActions.GET_AGREEMENT_PERMISSIONS,
      (params) => {
        return this.invitationService.getAgreementPermissions(
          params.consentContractAddress,
        );
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_DEFAULT_PERMISSIONS,
      (_params) => {
        return this.dataPermissionsUtils.defaultFlags.andThen((flags) =>
          this.dataPermissionsUtils.getDataTypesFromFlagsString(flags),
        );
      },
    ),
    new ExternalActionHandler<SetDefaultPermissionsWithDataTypesParams>(
      ECoreActions.SET_DEFAULT_PERMISSIONS,
      (params) => {
        return this.dataPermissionsUtils.setDefaultFlagsWithDataTypes(
          params.dataTypes,
        );
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.SET_DEFAULT_PERMISSIONS_TO_ALL,
      (_params) => {
        return this.dataPermissionsUtils.setDefaultFlagsToAll();
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_APPLY_DEFAULT_PERMISSIONS_OPTION,
      (_params) => {
        return this.dataPermissionsUtils.applyDefaultPermissionsOption;
      },
    ),
    new ExternalActionHandler<SetApplyDefaultPermissionsParams>(
      ECoreActions.SET_APPLY_DEFAULT_PERMISSIONS_OPTION,
      (params) => {
        return this.dataPermissionsUtils.setApplyDefaultPermissionsOption(
          params.option,
        );
      },
    ),
    new ExternalActionHandler<AcceptInvitationByUUIDParams>(
      ECoreActions.ACCEPT_INVITATION_BY_UUID,
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
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_SCAM_FILTER_SETTINGS,
      (_params) => {
        return this.scamFilterSettingsUtils.getScamFilterSettings();
      },
    ),
    new ExternalActionHandler<ScamFilterSettingsParams>(
      ECoreActions.SET_SCAM_FILTER_SETTINGS,
      (params) => {
        return this.scamFilterSettingsUtils.setScamFilterSettings(
          params.isScamFilterActive,
          params.showMessageEveryTime,
        );
      },
    ),
    new ExternalActionHandler<AcceptInvitationParams>(
      ECoreActions.ACCEPT_INVITATION,
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
    new ExternalActionHandler<RejectInvitationParams>(
      ECoreActions.REJECT_INVITATION,
      (params) => {
        const invitation = this.contextProvider.getInvitation(
          params.id,
        ) as Invitation;
        return this.invitationService.rejectInvitation(invitation);
      },
    ),
    new ExternalActionHandler<CheckURLParams>(
      ECoreActions.CHECK_URL,
      (params) => {
        return this.scamFilterService.checkURL(params.domain);
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.CLOSE_TAB,
      (_params, sender) => {
        sender?.tab?.id && ExtensionUtils.closeTab(sender.tab.id);
        return okAsync(DEFAULT_RPC_SUCCESS_RESULT);
      },
    ),
    new ExternalActionHandler<unknown>(ECoreActions.GET_STATE, (_params) => {
      return okAsync(this.contextProvider.getExterenalState());
    }),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_INTERNAL_STATE,
      (_params) => {
        return okAsync(this.contextProvider.getInternalState());
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.GET_DATA_WALLET_ADDRESS,
      (_params) => {
        return okAsync(this.contextProvider.getAccountContext().getAccount());
      },
    ),
    new ExternalActionHandler<unknown>(
      ECoreActions.IS_DATA_WALLET_ADDRESS_INITIALIZED,
      (_params) => {
        return this.accountService.isDataWalletAddressInitialized();
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
