import "reflect-metadata";
import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
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
  ECloudStorageType,
  OAuth2Tokens,
  ScraperError,
  DomainTask,
  HTMLString,
  ELanguageCode,
  PageNumber,
  Year,
  TransactionFlowInsight,
  TransactionFilter,
  ChainTransaction,
  IProxyAccountMethods,
  LanguageCode,
  EChain,
  Signature,
  IProxyPurchaseMethods,
  PurchasedProduct,
  IScraperNavigationMethods,
  IScraperMethods,
  GetResultAsyncValueType,
  TransactionPaymentCounter,
  IUserAgreement,
  PageInvitation,
  Invitation,
  ShoppingDataConnectionStatus,
  INftProxyMethods,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { ResultAsync } from "neverthrow";
import { FunctionKeys } from "utility-types";

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
  GetAgreementPermissionsParams,
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
  ScraperScrapeParams,
  ScraperClassifyUrlParams,
  ScraperGetOrderHistoryPageParams,
  ScraperGetYearsParams,
  ScraperGetOrderHistoryPageByYearParams,
  ScraperGetPageCountParams,
  AddAccountWithExternalSignatureParams,
  AddAccountWithExternalTypedDataSignatureParams,
  PurchaseGetByMarketPlaceParams,
  PurchaseGetByMarketPlaceAndDateParams,
  GetTransactionsParams,
  GetTransactionValueByChainParams,
  UpdateAgreementPermissionsParams,
  GetConsentContractURLsParams,
  PurchaseGetShoppingDataConnectionStatusParams,
  PurchaseSetShoppingDataConnectionStatusParams,
  PurchaseGetPurchasedProductsParams,
  GetPersistenceNFTsParams,
  GetAccountNFTHistoryParams,
  GetAccountNftCacheParams,
} from "@synamint-extension-sdk/shared";
import { IExtensionConfig } from "@synamint-extension-sdk/shared/interfaces/IExtensionConfig";

// We are not passing all the functions in IScraperNavigationMethods to proxy thats why we need to redifine type for gateway
type IGatewayScraperNavigationMethods = {
  [key in FunctionKeys<IScraperNavigationMethods["amazon"]>]: (
    ...args: [...Parameters<IScraperNavigationMethods["amazon"][key]>]
  ) => ResultAsync<
    ReturnType<IScraperNavigationMethods["amazon"][key]>,
    ProxyError
  >;
};

type IGatewayScraperMethods = {
  [key in FunctionKeys<IScraperMethods>]: (
    ...args: [...Parameters<IScraperMethods[key]>]
  ) => ResultAsync<
    GetResultAsyncValueType<ReturnType<IScraperMethods[key]>>,
    ProxyError
  >;
};

export class ExternalCoreGateway {
  public account: IProxyAccountMethods;
  public discord: IProxyDiscordMethods;
  public integration: IProxyIntegrationMethods;
  public metrics: IProxyMetricsMethods;
  public twitter: IProxyTwitterMethods;
  public purchase: IProxyPurchaseMethods;
  public scraper: IGatewayScraperMethods;
  public scraperNavigation: IGatewayScraperNavigationMethods;
  public nft: INftProxyMethods;
  protected _handler: CoreHandler;
  constructor(protected rpcEngine: JsonRpcEngine) {
    this._handler = new CoreHandler(rpcEngine);

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
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
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

    this.scraper = {
      scrape: (
        url: URLString,
        html: HTMLString,
        suggestedDomainTask: DomainTask,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new ScraperScrapeParams(url, html, suggestedDomainTask),
        );
      },
      classifyURL: (
        url: URLString,
        language: ELanguageCode,
      ): ResultAsync<DomainTask, ProxyError> => {
        return this._handler.call(new ScraperClassifyUrlParams(url, language));
      },
    };

    this.scraperNavigation = {
      getOrderHistoryPage: (
        lang: ELanguageCode,
        page: PageNumber,
      ): ResultAsync<URLString, ProxyError> => {
        return this._handler.call(
          new ScraperGetOrderHistoryPageParams(lang, page),
        );
      },
      getYears: (html: HTMLString): ResultAsync<Year[], ProxyError> => {
        return this._handler.call(new ScraperGetYearsParams(html));
      },
      getOrderHistoryPageByYear: (
        lang: ELanguageCode,
        year: Year,
        page: PageNumber,
      ): ResultAsync<URLString, ProxyError> => {
        return this._handler.call(
          new ScraperGetOrderHistoryPageByYearParams(lang, year, page),
        );
      },
      getPageCount: (
        html: HTMLString,
        year: Year,
      ): ResultAsync<number, ProxyError> => {
        return this._handler.call(new ScraperGetPageCountParams(html, year));
      },
    };

    this.purchase = {
      getPurchasedProducts: (): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this._handler.call(new PurchaseGetPurchasedProductsParams());
      },
      getByMarketplace: (
        marketPlace: DomainName,
      ): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this._handler.call(
          new PurchaseGetByMarketPlaceParams(marketPlace),
        );
      },
      getByMarketplaceAndDate: (
        marketPlace: DomainName,
        datePurchased: UnixTimestamp,
      ): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this._handler.call(
          new PurchaseGetByMarketPlaceAndDateParams(marketPlace, datePurchased),
        );
      },
      getShoppingDataConnectionStatus: (): ResultAsync<
        ShoppingDataConnectionStatus[],
        ProxyError
      > => {
        return this._handler.call(
          new PurchaseGetShoppingDataConnectionStatusParams(),
        );
      },
      setShoppingDataConnectionStatus: (
        ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
      ): ResultAsync<void, ProxyError> => {
        return this._handler.call(
          new PurchaseSetShoppingDataConnectionStatusParams(
            ShoppingDataConnectionStatus,
          ),
        );
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
    dataTypes: EWalletDataType[] | null,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(
      new AcceptInvitationParams(ObjectUtils.serialize(invitation), dataTypes),
    );
  }

  public updateAgreementPermissions(
    params: UpdateAgreementPermissionsParams,
  ): ResultAsync<void, ProxyError> {
    return this._handler.call(params);
  }

  public getAgreementPermissions(
    params: GetAgreementPermissionsParams,
  ): ResultAsync<EWalletDataType[], ProxyError> {
    return this._handler.call(params);
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

  public getConsentCapacity(
    params: GetConsentCapacityParams,
  ): ResultAsync<IConsentCapacity, ProxyError> {
    return this._handler.call(params);
  }

  public getConsentContractURLs(
    contractAdress: EVMContractAddress,
  ): ResultAsync<URLString[], ProxyError> {
    return this._handler.call(new GetConsentContractURLsParams(contractAdress));
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
}
