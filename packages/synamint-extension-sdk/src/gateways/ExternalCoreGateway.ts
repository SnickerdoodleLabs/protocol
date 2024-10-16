import "reflect-metadata";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
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
  IOldUserAgreement,
  IpfsCID,
  LinkedAccount,
  DataWalletAddress,
  EInvitationStatus,
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
  ECloudStorageType,
  OAuth2Tokens,
  TransactionFlowInsight,
  ChainTransaction,
  IProxyAccountMethods,
  LanguageCode,
  EChain,
  Signature,
  IUserAgreement,
  PageInvitation,
  Invitation,
  INftProxyMethods,
  JSONString,
  IProxyQuestionnaireMethods,
  PagingRequest,
  NewQuestionnaireAnswer,
  DataPermissions,
  IDynamicRewardParameter,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";

import CoreHandler from "@synamint-extension-sdk/gateways/handler/CoreHandler";
import {
  AcceptInvitationParams,
  GetInvitationMetadataByCIDParams,
  GetInvitationWithDomainParams,
  GetUnlockMessageParams,
  LeaveCohortParams,
  SetBirthdayParams,
  SetEmailParams,
  SetFamilyNameParams,
  SetGenderParams,
  SetGivenNameParams,
  SetLocationParams,
  GetConsentContractCIDParams,
  CheckInvitationStatusParams,
  GetTokenPriceParams,
  GetTokenMarketDataParams,
  GetTokenInfoParams,
  SetDefaultReceivingAddressParams,
  SetReceivingAddressParams,
  GetReceivingAddressParams,
  IExternalState,
  AddAccountParams,
  UnlinkAccountParams,
  GetSiteVisitsMapParams,
  GetSiteVisitsParams,
  GetEarnedRewardsParams,
  GetDataWalletAddressParams,
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
  GetAcceptedInvitationsCIDParams,
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
  GetTransactionValueByChainParams,
  GetTransactionsParams,
  AddAccountWithExternalSignatureParams,
  AddAccountWithExternalTypedDataSignatureParams,
  GetPersistenceNFTsParams,
  GetAccountNFTHistoryParams,
  GetAccountNftCacheParams,
  SetUIStateParams,
  GetUIStateParams,
  GetAllQuestionnairesParams,
  AnswerQuestionnaireParams,
  GetQuestionnairesForConsentContractParams,
  GetConsentContractsByQuestionnaireCIDParams,
  GetRecommendedConsentContractsParams,
  GetQuestionnairesParams,
  GetVirtualQuestionnairesParams,
  GetQuestionnairesByCIDSParams,
  ApproveQueryParams,
  GetQueryStatusesByContractAddressParams,
  LinkAccountRequestParams,
} from "@synamint-extension-sdk/shared";
import { IExtensionConfig } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

export class ExternalCoreGateway {
  public account: IProxyAccountMethods;
  public discord: IProxyDiscordMethods;
  public integration: IProxyIntegrationMethods;
  public metrics: IProxyMetricsMethods;
  public twitter: IProxyTwitterMethods;
  public nft: INftProxyMethods;
  public questionnaire: IProxyQuestionnaireMethods;
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);

    this.questionnaire = {
      getAllQuestionnaires: (pagingRequest: PagingRequest) => {
        return this._handler.call(
          new GetAllQuestionnairesParams(pagingRequest),
        );
      },
      getQuestionnaires: (pagingRequest: PagingRequest) => {
        return this._handler.call(new GetQuestionnairesParams(pagingRequest));
      },
      answerQuestionnaire: (
        questionnaireId: IpfsCID,
        answers: NewQuestionnaireAnswer[],
      ) => {
        return this._handler.call(
          new AnswerQuestionnaireParams(questionnaireId, answers),
        );
      },
      getQuestionnairesForConsentContract: (
        pagingRequest: PagingRequest,
        consentContractAddress: EVMContractAddress,
      ) => {
        return this._handler.call(
          new GetQuestionnairesForConsentContractParams(
            pagingRequest,
            consentContractAddress,
          ),
        );
      },
      getRecommendedConsentContracts: (questionnaireCID: IpfsCID) => {
        return this._handler.call(
          new GetRecommendedConsentContractsParams(questionnaireCID),
        );
      },
      getConsentContractsByQuestionnaireCID: (questionnaireCID: IpfsCID) => {
        return this._handler.call(
          new GetConsentContractsByQuestionnaireCIDParams(questionnaireCID),
        );
      },
      getVirtualQuestionnaires: (
        consentContractAddress: EVMContractAddress,
      ) => {
        return this._handler.call(
          new GetVirtualQuestionnairesParams(consentContractAddress),
        );
      },
      getByCIDs: (questionnaireCIDs: IpfsCID[]) => {
        return this._handler.call(
          new GetQuestionnairesByCIDSParams(questionnaireCIDs),
        );
      },
    };

    this.account = {
      addAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new AddAccountParams(accountAddress, signature, chain, languageCode),
        );
      },

      addAccountWithExternalSignature: (
        accountAddress: AccountAddress,
        message: string,
        signature: Signature,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new AddAccountWithExternalSignatureParams(
            accountAddress,
            message,
            signature,
            chain,
          ),
        );
      },
      addAccountWithExternalTypedDataSignature: (
        accountAddress: AccountAddress,
        domain: ethers.TypedDataDomain,
        types: Record<string, Array<ethers.TypedDataField>>,
        value: Record<string, unknown>,
        signature: Signature,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new AddAccountWithExternalTypedDataSignatureParams(
            accountAddress,
            domain,
            types,
            value,
            signature,
            chain,
          ),
        );
      },
      unlinkAccount: (
        accountAddress: AccountAddress,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new UnlinkAccountParams(accountAddress, chain),
        );
      },
      getLinkAccountMessage: (
        languageCode: LanguageCode,
      ): ResultAsync<string, ProxyError> => {
        return this._handler.call(new GetUnlockMessageParams(languageCode));
      },
      getAccounts: (): ResultAsync<LinkedAccount[], ProxyError> => {
        return this._handler.call(new GetAccountsParams());
      },
    };

    this.discord = {
      initializeUserWithAuthorizationCode: (
        code: OAuthAuthorizationCode,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(new InitializeDiscordUserParams(code));
      },
      installationUrl: (): ResultAsync<URLString, ProxyError> => {
        return this._handler.call(new GetDiscordInstallationUrlParams());
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

    this.nft = {
      getNfts: (
        benchmark?: UnixTimestamp,
        chains?: EChain[],
        accounts?: LinkedAccount[],
      ) => {
        return this._handler.call(
          new GetAccountNFTsParams(benchmark, chains, accounts),
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
      getPersistenceNFTs: () => {
        return this._handler.call(new GetPersistenceNFTsParams());
      },
      getNFTsHistory: () => {
        return this._handler.call(new GetAccountNFTHistoryParams());
      },
      getNFTCache: () => {
        return this._handler
          .call(new GetAccountNftCacheParams())
          .map((jsonString) => {
            return ObjectUtils.deserialize(jsonString);
          });
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
  ): ResultAsync<PageInvitation | null, ProxyError> {
    return this._handler.call(params).map((jsonString) => {
      if (jsonString) {
        return ObjectUtils.deserialize(jsonString);
      }
      return null;
    });
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._handler
      .call(new GetAvailableInvitationsCIDParams())
      .map((jsonString) => {
        return ObjectUtils.deserialize(jsonString);
      });
  }

  public acceptInvitation(
    invitation: Invitation,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(
      new AcceptInvitationParams(ObjectUtils.serialize(invitation)),
    );
  }

  public rejectInvitation(
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(
      new RejectInvitationParams(
        ObjectUtils.serialize(invitation),
        rejectUntil,
      ),
    );
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._handler
      .call(new GetAcceptedInvitationsCIDParams())
      .map((jsonString) => {
        return ObjectUtils.deserialize(jsonString);
      });
  }

  public getInvitationMetadataByCID(
    params: GetInvitationMetadataByCIDParams,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, ProxyError> {
    return this._handler.call(params);
  }

  public leaveCohort(params: LeaveCohortParams): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
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

  public getTransactionValueByChain(): ResultAsync<
    TransactionFlowInsight[],
    ProxyError
  > {
    return this._handler.call(new GetTransactionValueByChainParams());
  }
  public getTransactions(
    params: GetTransactionsParams,
  ): ResultAsync<ChainTransaction[], ProxyError> {
    return this._handler.call(params);
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
  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    ProxyError
  > {
    return this._handler.call(new GetDataWalletAddressParams());
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

  public getQueryStatuses(
    params: GetQueryStatusesParams,
  ): ResultAsync<QueryStatus[], ProxyError> {
    return this._handler.call(params);
  }

  public getQueryStatusesByContractAddress(
    params: GetQueryStatusesByContractAddressParams,
  ): ResultAsync<QueryStatus[], ProxyError> {
    return this._handler.call(params);
  }

  public approveQuery(
    params: ApproveQueryParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], ProxyError> {
    return this._handler.call(new GetSiteVisitsParams());
  }

  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError> {
    return this._handler
      .call(new GetSiteVisitsMapParams())
      .map((jsonString) => {
        return ObjectUtils.deserialize(jsonString);
      });
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

  public getEarnedRewardsByContractAddress(
    params: GetPossibleRewardsParams,
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    ProxyError
  > {
    return this._handler.call(params).map((jsonString) => {
      return ObjectUtils.deserialize(jsonString);
    });
  }
  public getConfig(): ResultAsync<IExtensionConfig, ProxyError> {
    return this._handler.call(new GetConfigParams());
  }

  public getDropboxAuth(): ResultAsync<URLString, ProxyError> {
    return this._handler.call(new GetDropBoxAuthUrlParams());
  }

  public authenticateDropbox(
    params: AuthenticateDropboxParams,
  ): ResultAsync<OAuth2Tokens, ProxyError> {
    return this._handler.call(params);
  }

  public setAuthenticatedStorage(
    params: SetAuthenticatedStorageParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getCurrentCloudStorage(): ResultAsync<ECloudStorageType, ProxyError> {
    return this._handler.call(new GetCurrentCloudStorageParams());
  }

  public getAvailableCloudStorageOptions(): ResultAsync<
    Set<ECloudStorageType>,
    ProxyError
  > {
    return this._handler.call(new GetAvailableCloudStorageOptionsParams());
  }
  public getProviderKey = (): ResultAsync<string | undefined, ProxyError> => {
    return this.getConfig().map((config) => {
      return config.providerKey;
    });
  };

  public requestLinkAccount = (): ResultAsync<void, ProxyError> => {
    return this._handler.call(new LinkAccountRequestParams());
  }

  public setUIState(state: JSONString): ResultAsync<void, ProxyError> {
    return this._handler.call(new SetUIStateParams(state));
  }
  public getUIState(): ResultAsync<JSONString | null, ProxyError> {
    return this._handler.call(new GetUIStateParams());
  }
}
