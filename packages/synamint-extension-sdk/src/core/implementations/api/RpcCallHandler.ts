/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  Invitation,
  DomainName,
  TokenId,
  BigNumberString,
  ISnickerdoodleCoreType,
  ISnickerdoodleCore,
  DataPermissions,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import {
  AsyncJsonRpcEngineNextCallback,
  JsonRpcRequest,
  PendingJsonRpcResponse,
} from "json-rpc-engine";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
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
  IErrorUtils,
  IErrorUtilsType,
} from "@synamint-extension-sdk/core/interfaces/utilities";
import { ExtensionUtils } from "@synamint-extension-sdk/extensionShared";
import {
  DEFAULT_RPC_SUCCESS_RESULT,
  ECoreActions,
  GetUnlockMessageParams,
  AddAccountParams,
  SetGivenNameParams,
  SetFamilyNameParams,
  SetBirthdayParams,
  SetGenderParams,
  SetLocationParams,
  SetEmailParams,
  GetInvitationWithDomainParams,
  LeaveCohortParams,
  GetInvitationMetadataByCIDParams,
  GetAgreementPermissionsParams,
  UnlinkAccountParams,
  AcceptInvitationParams,
  GetConsentContractCIDParams,
  CheckInvitationStatusParams,
  GetTokenPriceParams,
  GetTokenMarketDataParams,
  GetTokenInfoParams,
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
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
  GetPossibleRewardsParams as GetEarnedRewardsByContractAddressParams,
  DEFAULT_SUBDOMAIN,
  TwitterGetRequestTokenParams,
  TwitterLinkProfileParams,
  TwitterUnlinkProfileParams,
  TwitterGetLinkedProfilesParams,
  GetConfigParams,
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
  GetQueryStatusesParams,
  GetTransactionsParams,
  GetTransactionValueByChainParams,
  AddAccountWithExternalSignatureParams,
  AddAccountWithExternalTypedDataSignatureParams,
  ERequestChannel,
  UpdateAgreementPermissionsParams,
  SnickerDoodleCoreError,
  GetConsentContractURLsParams,
  GetPersistenceNFTsParams,
  GetAccountNFTHistoryParams,
  GetAccountNftCacheParams,
  GetUIStateParams,
  SetUIStateParams,
  GetAllQuestionnairesParams,
  AnswerQuestionnaireParams,
  GetQuestionnairesForConsentContractParams,
  GetConsentContractsByQuestionnaireCIDParams,
  GetRecommendedConsentContractsParams,
  GetQuestionnairesParams,
} from "@synamint-extension-sdk/shared";

@injectable()
export class RpcCallHandler implements IRpcCallHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected rpcCalls: CoreActionHandler<any>[] = [
    new CoreActionHandler<AddAccountParams>(
      AddAccountParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.accountService.addAccount(
          params.accountAddress,
          params.signature,
          params.chain,
          params.languageCode,
          sourceDomain,
        );
      },
    ),
    new CoreActionHandler<AddAccountWithExternalSignatureParams>(
      AddAccountWithExternalSignatureParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.accountService.addAccountWithExternalSignature(
          params.accountAddress,
          params.message,
          params.signature,
          params.chain,
          sourceDomain,
        );
      },
    ),
    new CoreActionHandler<AddAccountWithExternalTypedDataSignatureParams>(
      AddAccountWithExternalTypedDataSignatureParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.accountService.addAccountWithExternalTypedDataSignature(
          params.accountAddress,
          params.domain,
          params.types,
          params.value,
          params.signature,
          params.chain,
          sourceDomain,
        );
      },
    ),
    new CoreActionHandler<GetUnlockMessageParams>(
      GetUnlockMessageParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.accountService.getLinkAccountMessage(
          params.languageCode,
          sourceDomain,
        );
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
      (_params, _sender, sourceDomain) => {
        return this.accountService.getAccounts(sourceDomain);
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
        return this.accountService.getNfts(
          _params.benchmark,
          _params.chains,
          _params.accounts,
        );
      },
    ),

    new CoreActionHandler<GetTransactionsParams>(
      GetTransactionsParams.getCoreAction(),
      (_params) => {
        return this.accountService.getTransactions(_params.filter);
      },
    ),

    new CoreActionHandler<GetTransactionValueByChainParams>(
      GetTransactionValueByChainParams.getCoreAction(),
      (_params) => {
        return this.accountService.getTransactionValueByChain();
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
        return this.invitationService.checkInvitationStatus(
          new Invitation(
            params.consentAddress,
            this.toTokenId(params.tokenId),
            null,
            params.signature ?? null,
          ),
        );
      },
    ),

    new CoreActionHandler<GetConsentContractURLsParams>(
      GetConsentContractURLsParams.getCoreAction(),
      (params) => {
        return this.core
          .getConsentContractURLs(params.contractAddress)
          .mapErr((error) => {
            this.errorUtils.emit(error);
            return new SnickerDoodleCoreError((error as Error).message, error);
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
      (params, _sender, sourceDomain) => {
        return this.accountService.unlinkAccount(
          params.accountAddress,
          params.chain,
          sourceDomain,
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
              return okAsync(ObjectUtils.serialize(pageInvitation));
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
    new CoreActionHandler<UpdateAgreementPermissionsParams>(
      UpdateAgreementPermissionsParams.getCoreAction(),
      (params) => {
        return this.invitationService.updateAgreementPermissions(
          params.consentContractAddress,
          params.dataTypes,
        );
      },
    ),
    new CoreActionHandler<AcceptInvitationParams>(
      AcceptInvitationParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.invitation
          .acceptInvitation(
            ObjectUtils.deserialize(params.invitation),
            params.dataTypes
              ? DataPermissions.createWithPermissions(params.dataTypes)
              : null,
            sourceDomain,
          )
          .mapErr((error) => {
            this.errorUtils.emit(error);
            return new SnickerDoodleCoreError((error as Error).message, error);
          });
      },
    ),
    new CoreActionHandler<RejectInvitationParams>(
      RejectInvitationParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.invitation
          .rejectInvitation(
            ObjectUtils.deserialize(params.invitation),
            params.rejectUntil,
            sourceDomain,
          )
          .mapErr((error) => {
            this.errorUtils.emit(error);
            return new SnickerDoodleCoreError((error as Error).message, error);
          });
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
    new CoreActionHandler<GetQueryStatusesParams>(
      GetQueryStatusesParams.getCoreAction(),
      (params) => {
        return this.accountService.getQueryStatuses(
          params.contractAddress,
          params.blockNumber,
        );
      },
    ),
    // #region Discord
    new CoreActionHandler<InitializeDiscordUserParams>(
      InitializeDiscordUserParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.discordService.initializeUserWithAuthorizationCode(
          params.code,
          sourceDomain,
        );
      },
    ),
    new CoreActionHandler<GetDiscordInstallationUrlParams>(
      GetDiscordInstallationUrlParams.getCoreAction(),
      (params, sender, sourceDomain) => {
        return this.discordService.installationUrl(sourceDomain);
      },
    ),
    new CoreActionHandler<GetDiscordGuildProfilesParams>(
      GetDiscordGuildProfilesParams.getCoreAction(),
      (_params, _sender, sourceDomain) => {
        return this.discordService.getGuildProfiles(sourceDomain);
      },
    ),
    new CoreActionHandler<GetDiscordUserProfilesParams>(
      GetDiscordUserProfilesParams.getCoreAction(),
      (_params, _sender, sourceDomain) => {
        return this.discordService.getUserProfiles(sourceDomain);
      },
    ),
    new CoreActionHandler<UnlinkDiscordAccountParams>(
      UnlinkDiscordAccountParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.discordService.unlink(
          params.discordProfileId,
          sourceDomain,
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
    new CoreActionHandler<GetEarnedRewardsByContractAddressParams>(
      GetEarnedRewardsByContractAddressParams.getCoreAction(),
      (params) => {
        return this.invitationService
          .getEarnedRewardsByContractAddress(params.contractAddresses)
          .map((res) => {
            return ObjectUtils.serialize(res);
          });
      },
    ),

    // #region Twitter
    new CoreActionHandler<TwitterGetRequestTokenParams>(
      TwitterGetRequestTokenParams.getCoreAction(),
      (_params, _sender, sourceDomain) => {
        return this.twitterService.getOAuth1aRequestToken(sourceDomain);
      },
    ),
    new CoreActionHandler<TwitterLinkProfileParams>(
      TwitterLinkProfileParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.twitterService.initTwitterProfile(
          params.requestToken,
          params.oAuthVerifier,
          sourceDomain,
        );
      },
    ),
    new CoreActionHandler<TwitterUnlinkProfileParams>(
      TwitterUnlinkProfileParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.twitterService.unlinkProfile(params.id, sourceDomain);
      },
    ),
    new CoreActionHandler<TwitterGetLinkedProfilesParams>(
      TwitterGetLinkedProfilesParams.getCoreAction(),
      (_params, _sender, sourceDomain) => {
        return this.twitterService.getUserProfiles(sourceDomain);
      },
    ),
    // #endregion

    new CoreActionHandler<GetConfigParams>(
      GetConfigParams.getCoreAction(),
      (_params) => {
        return okAsync(this.configProvider.getExtensionConfig());
      },
    ),

    // #region Metrics
    new CoreActionHandler<GetMetricsParams>(
      GetMetricsParams.getCoreAction(),
      (_params, _sender, sourceDomain) => {
        return this.metricsService.getMetrics(sourceDomain);
      },
    ),

    new CoreActionHandler<GetPersistenceNFTsParams>(
      GetPersistenceNFTsParams.getCoreAction(),
      (_params) => {
        return this.metricsService.getPersistenceNFTs();
      },
    ),

    new CoreActionHandler<GetAccountNftCacheParams>(
      GetAccountNftCacheParams.getCoreAction(),
      (_params) => {
        return this.metricsService.getNFTCache().map((map) => {
          return ObjectUtils.serialize(map);
        });
      },
    ),

    new CoreActionHandler<GetAccountNFTHistoryParams>(
      GetAccountNFTHistoryParams.getCoreAction(),
      (_params) => {
        return this.metricsService.getNFTsHistory();
      },
    ),

    // #endregion
    // #region Integration

    // this is the only function that goes against my new source domain logic
    // but if this function will only be called by the proxy, which it seems to be, then it should be fine
    new CoreActionHandler<RequestPermissionsParams>(
      RequestPermissionsParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return sourceDomain
          ? this.integrationService.requestPermissions(
              params.permissions,
              sourceDomain,
            )
          : errAsync(new Error("No source domain found"));
      },
    ),
    new CoreActionHandler<GetPermissionsParams>(
      GetPermissionsParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.integrationService.getPermissions(
          params.domain,
          sourceDomain,
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
      (_params, _sender, sourceDomain) => {
        return this.core.storage.getDropboxAuth(sourceDomain);
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
          params.refreshToken,
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

    // #region external local storage calls
    new CoreActionHandler<GetUIStateParams>(
      GetUIStateParams.getCoreAction(),
      () => {
        return this.core.getUIState().mapErr((error) => {
          this.errorUtils.emit(error);
          return new SnickerDoodleCoreError((error as Error).message, error);
        });
      },
    ),
    new CoreActionHandler<SetUIStateParams>(
      SetUIStateParams.getCoreAction(),
      (params) => {
        return this.core.setUIState(params.state).mapErr((error) => {
          this.errorUtils.emit(error);
          return new SnickerDoodleCoreError((error as Error).message, error);
        });
      },
    ),
    // #endregion

    // #region questionnaires
    new CoreActionHandler<GetAllQuestionnairesParams>(
      GetAllQuestionnairesParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.getAllQuestionnaires(
          params.pagingRequest,
          sourceDomain,
        );
      },
    ),

    new CoreActionHandler<GetQuestionnairesParams>(
      GetQuestionnairesParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.getQuestionnaires(
          params.pagingRequest,
          sourceDomain,
        );
      },
    ),

    new CoreActionHandler<AnswerQuestionnaireParams>(
      AnswerQuestionnaireParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.answerQuestionnaire(
          params.questionnaireId,
          params.answers,
          sourceDomain,
        );
      },
    ),

    new CoreActionHandler<GetQuestionnairesForConsentContractParams>(
      GetQuestionnairesForConsentContractParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.getQuestionnairesForConsentContract(
          params.pagingRequest,
          params.consentContractAddress,
          sourceDomain,
        );
      },
    ),

    new CoreActionHandler<GetConsentContractsByQuestionnaireCIDParams>(
      GetConsentContractsByQuestionnaireCIDParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.getConsentContractsByQuestionnaireCID(
          params.questionnaireCID,
          sourceDomain,
        );
      },
    ),

    new CoreActionHandler<GetRecommendedConsentContractsParams>(
      GetRecommendedConsentContractsParams.getCoreAction(),
      (params, _sender, sourceDomain) => {
        return this.core.questionnaire.getRecommendedConsentContracts(
          params.questionnaireCID,
          sourceDomain,
        );
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
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
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
    @inject(IErrorUtilsType) protected errorUtils: IErrorUtils,
  ) {}

  public async handleRpcCall(
    req: JsonRpcRequest<unknown>,
    res: PendingJsonRpcResponse<unknown>,
    next: AsyncJsonRpcEngineNextCallback,
    sender: Runtime.MessageSender | undefined,
    requestChannel: ERequestChannel,
  ) {
    const { method, params } = req;

    const sourceDomain = this.getSourceDomain(sender, requestChannel);

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

    return externalActionHandler.execute(params, res, sender, sourceDomain);
  }

  private getSourceDomain(
    sender: Runtime.MessageSender | undefined,
    requestChannel,
  ): DomainName | undefined {
    // check if the request is coming from the proxy
    // if not no need to check the domain
    // cuz the other requesters are internal and those are trusted
    if (requestChannel != ERequestChannel.PROXY) {
      return undefined;
    }
    // TODO: we have not yet encountered a case where the url is undefined, but it should be double checked just in case
    // the only case I can think of is when the request comes from the extension's popup or from other extensions trying to communicate with our extension, which we don't allow anyway.
    const url = new URL(sender?.tab?.url ?? "");
    return DomainName(url.hostname);
  }

  private getDomainFromSender(
    sender: Runtime.MessageSender | undefined,
  ): DomainName {
    // TODO: If the sender is undefined we need to do something smart here.
    const url = new URL(sender?.tab?.url ?? "");
    return DomainName(url.hostname);
  }

  private toTokenId(tokenId: BigNumberString | undefined): TokenId | null {
    return tokenId != null ? TokenId(BigInt(tokenId)) : null;
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
      sourceDomain?: DomainName | undefined,
    ) => ResultAsync<ReturnType<TParams["returnMethodMarker"]>, unknown>,
  ) {}

  public async execute(
    params: TParams,
    res: PendingJsonRpcResponse<unknown>,
    sender: Runtime.MessageSender | undefined,
    sourceDomain: DomainName | undefined,
  ): Promise<void> {
    await this.handler(params!, sender, sourceDomain)
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
