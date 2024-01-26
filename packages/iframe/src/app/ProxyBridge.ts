import {
  AccountAddress,
  Age,
  BigNumberString,
  BlockNumber,
  ChainId,
  ChainTransaction,
  CountryCode,
  DataPermissions,
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  DomainName,
  EChain,
  ECloudStorageType,
  ECoreProxyType,
  EDataWalletPermission,
  EInvitationStatus,
  EVMContractAddress,
  EWalletDataType,
  EarnedReward,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  IConsentCapacity,
  INftProxyMethods,
  IOldUserAgreement,
  IProxyAccountMethods,
  IProxyDiscordMethods,
  IProxyIntegrationMethods,
  IProxyMetricsMethods,
  IProxyPurchaseMethods,
  IProxyStorageMethods,
  IProxyTwitterMethods,
  ISdlDataWallet,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  IUserAgreement,
  IpfsCID,
  JsonWebToken,
  LanguageCode,
  LinkedAccount,
  MarketplaceListing,
  MarketplaceTag,
  NftRepositoryCache,
  OAuth2RefreshToken,
  OAuth2Tokens,
  OAuthAuthorizationCode,
  PEMEncodedRSAPublicKey,
  PagedResponse,
  PagingRequest,
  PersistenceError,
  ProxyError,
  PurchasedProduct,
  QueryStatus,
  RuntimeMetrics,
  ShoppingDataConnectionStatus,
  Signature,
  SiteVisit,
  TokenAddress,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  TransactionFilter,
  TransactionFlowInsight,
  URLString,
  UnixTimestamp,
  WalletNFT,
  WalletNFTData,
  WalletNFTHistory,
} from "@snickerdoodlelabs/objects";
import { TypedDataDomain, TypedDataField } from "ethers";
import { ResultAsync, okAsync } from "neverthrow";

export class ProxyBridge implements ISdlDataWallet {
  public account: IProxyAccountMethods;
  public discord: IProxyDiscordMethods;
  public integration: IProxyIntegrationMethods;
  public metrics: IProxyMetricsMethods;
  public purchase: IProxyPurchaseMethods;
  public storage: IProxyStorageMethods;
  public twitter: IProxyTwitterMethods = {} as IProxyTwitterMethods;
  public nft: INftProxyMethods;
  private sourceDomain = undefined;
  public requestDashboardView = undefined;

  constructor(
    private core: ISnickerdoodleCore,
    public events: ISnickerdoodleCoreEvents,
  ) {
    this.account = {
      getLinkAccountMessage: (
        languageCode: LanguageCode,
      ): ResultAsync<string, ProxyError> => {
        return this.call(
          this.core.account.getLinkAccountMessage(
            languageCode,
            this.sourceDomain,
          ),
        );
      },
      addAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.account.addAccount(
            accountAddress,
            signature,
            languageCode,
            chain,
            this.sourceDomain,
          ),
        );
      },
      addAccountWithExternalSignature: function (
        accountAddress: AccountAddress,
        message: string,
        signature: Signature,
        chain: EChain,
      ): ResultAsync<void, ProxyError> {
        throw new Error("Function not implemented.");
      },
      addAccountWithExternalTypedDataSignature: function (
        accountAddress: AccountAddress,
        domain: TypedDataDomain,
        types: Record<string, TypedDataField[]>,
        value: Record<string, unknown>,
        signature: Signature,
        chain: EChain,
      ): ResultAsync<void, ProxyError> {
        throw new Error("Function not implemented.");
      },
      unlinkAccount: (
        accountAddress: AccountAddress,
        chain: EChain,
      ): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.account.unlinkAccount(
            accountAddress,
            chain,
            this.sourceDomain,
          ),
        );
      },
      getAccounts: (): ResultAsync<LinkedAccount[], ProxyError> => {
        return this.call(this.core.account.getAccounts(this.sourceDomain));
      },
    };
    this.discord = {
      initializeUserWithAuthorizationCode: (
        code: OAuthAuthorizationCode,
      ): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.discord.initializeUserWithAuthorizationCode(
            code,
            this.sourceDomain,
          ),
        );
      },
      installationUrl: (): ResultAsync<URLString, ProxyError> => {
        return this.call(this.core.discord.installationUrl(this.sourceDomain));
      },
      getUserProfiles: (): ResultAsync<DiscordProfile[], ProxyError> => {
        return this.call(this.core.discord.getUserProfiles(this.sourceDomain));
      },
      getGuildProfiles: (): ResultAsync<DiscordGuildProfile[], ProxyError> => {
        return this.call(this.core.discord.getGuildProfiles(this.sourceDomain));
      },
      unlink: (discordProfileId: DiscordID): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.discord.unlink(discordProfileId, this.sourceDomain),
        );
      },
    };

    this.purchase = {
      getPurchasedProducts: (): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this.call(this.core.purchase.getPurchasedProducts());
      },
      getByMarketplace: (
        marketPlace: DomainName,
      ): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this.call(this.core.purchase.getByMarketplace(marketPlace));
      },
      getByMarketplaceAndDate: (
        marketPlace: DomainName,
        datePurchased: UnixTimestamp,
      ): ResultAsync<PurchasedProduct[], ProxyError> => {
        return this.call(
          this.core.purchase.getByMarketplaceAndDate(
            marketPlace,
            datePurchased,
          ),
        );
      },
      getShoppingDataConnectionStatus: (): ResultAsync<
        ShoppingDataConnectionStatus[],
        ProxyError
      > => {
        return this.call(this.core.purchase.getShoppingDataConnectionStatus());
      },
      setShoppingDataConnectionStatus: (
        ShoppingDataConnectionStatus: ShoppingDataConnectionStatus,
      ): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.purchase.setShoppingDataConnectionStatus(
            ShoppingDataConnectionStatus,
          ),
        );
      },
    };

    this.storage = {
      setAuthenticatedStorage: (
        type: ECloudStorageType,
        path: string,
        refreshToken: OAuth2RefreshToken,
      ): ResultAsync<void, ProxyError> => {
        return this.call(
          this.core.storage.setAuthenticatedStorage(
            type,
            path,
            refreshToken,
            this.sourceDomain,
          ),
        );
      },
      authenticateDropbox: (
        code: string,
      ): ResultAsync<OAuth2Tokens, ProxyError> => {
        return this.call(
          this.core.storage.authenticateDropbox(code, this.sourceDomain),
        );
      },
      getCurrentCloudStorage: (): ResultAsync<
        ECloudStorageType,
        ProxyError
      > => {
        return this.call(
          this.core.storage.getCurrentCloudStorage(this.sourceDomain),
        );
      },
      getAvailableCloudStorageOptions: (): ResultAsync<
        Set<ECloudStorageType>,
        ProxyError
      > => {
        return this.call(
          this.core.storage.getAvailableCloudStorageOptions(this.sourceDomain),
        );
      },
      getDropboxAuth: (): ResultAsync<URLString, ProxyError> => {
        return this.call(this.core.storage.getDropboxAuth(this.sourceDomain));
      },
    };

    this.integration = {
      requestPermissions: (
        permissions: EDataWalletPermission[],
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        throw new Error("Function not implemented.");
      },
      getPermissions: (
        domain: DomainName,
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        throw new Error("Function not implemented.");
      },
      getTokenVerificationPublicKey: (
        domain: DomainName,
      ): ResultAsync<PEMEncodedRSAPublicKey, ProxyError> => {
        throw new Error("Function not implemented.");
      },
      getBearerToken: (
        nonce: string,
        domain: DomainName,
      ): ResultAsync<JsonWebToken, ProxyError> => {
        throw new Error("Function not implemented.");
      },
    };

    this.metrics = {
      getMetrics: (): ResultAsync<RuntimeMetrics, ProxyError> => {
        return this.call(this.core.metrics.getMetrics(this.sourceDomain));
      },
      getNFTCache: (): ResultAsync<NftRepositoryCache, ProxyError> => {
        return this.call(this.core.metrics.getNFTCache(this.sourceDomain));
      },
      getPersistenceNFTs: (): ResultAsync<WalletNFTData[], ProxyError> => {
        return this.call(
          this.core.metrics.getPersistenceNFTs(this.sourceDomain),
        );
      },
      getNFTsHistory: (): ResultAsync<WalletNFTHistory[], ProxyError> => {
        return this.call(this.core.metrics.getNFTsHistory(this.sourceDomain));
      },
    };

    this.nft = {
      getNfts: (
        benchmark: UnixTimestamp | undefined,
        chains: EChain[] | undefined,
        accounts: LinkedAccount[] | undefined,
      ): ResultAsync<WalletNFT[], ProxyError> => {
        return this.call(
          this.core.nft.getNfts(benchmark, chains, accounts, this.sourceDomain),
        );
      },
    };
  }

  getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this.call(
      this.core.invitation.getAcceptedInvitationsCID(this.sourceDomain),
    );
  }
  getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this.call(this.core.invitation.getAvailableInvitationsCID());
  }
  getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, ProxyError> {
    return this.call(this.core.invitation.getInvitationMetadataByCID(ipfsCID));
  }
  updateAgreementPermissions(
    consentContractAddress: EVMContractAddress,
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ProxyError> {
    return this.call(
      this.core.invitation.updateDataPermissions(
        consentContractAddress,
        DataPermissions.createWithPermissions(dataTypes),
      ),
    );
  }
  getAgreementPermissions(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], ProxyError> {
    return this.call(
      this.core.invitation
        .getAgreementFlags(consentContractAddres)
        .map((flags) => {
          return DataPermissions.getDataTypesFromFlags(flags);
        }),
    );
  }

  leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, ProxyError> {
    return this.call(this.core.invitation.leaveCohort(consentContractAddress));
  }
  checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature | undefined,
    tokenId?: BigNumberString | undefined,
  ): ResultAsync<EInvitationStatus, ProxyError> {
    throw new Error("Method not implemented.");
  }
  getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, ProxyError> {
    return this.call(this.core.getConsentContractCID(consentAddress));
  }
  getEarnedRewards(): ResultAsync<EarnedReward[], ProxyError> {
    return this.call(this.core.getEarnedRewards(this.sourceDomain));
  }
  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, ProxyError> {
    return this.call(this.core.getQueryStatusByQueryCID(queryCID));
  }
  getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber | undefined,
  ): ResultAsync<QueryStatus[], ProxyError> {
    return this.call(this.core.getQueryStatuses(contractAddress, blockNumber));
  }
  getSiteVisits(): ResultAsync<SiteVisit[], ProxyError> {
    return this.call(this.core.getSiteVisits(this.sourceDomain));
  }
  getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError> {
    throw new Error("Method not implemented.");
  }
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean | undefined,
  ): ResultAsync<PagedResponse<MarketplaceListing>, ProxyError> {
    return this.call(
      this.core.marketplace.getMarketplaceListingsByTag(
        pagingReq,
        tag,
        Boolean(filterActive),
      ),
    );
  }
  getListingsTotalByTag(tag: MarketplaceTag): ResultAsync<number, ProxyError> {
    return this.call(this.core.marketplace.getListingsTotalByTag(tag));
  }
  setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return this.call(this.core.setDefaultReceivingAddress(receivingAddress));
  }
  setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return this.call(
      this.core.setReceivingAddress(contractAddress, receivingAddress),
    );
  }
  getReceivingAddress(
    contractAddress?: EVMContractAddress | undefined,
  ): ResultAsync<AccountAddress, ProxyError> {
    return this.call(this.core.getReceivingAddress(contractAddress));
  }
  getConsentContractURLs(
    contractAddress: EVMContractAddress,
  ): ResultAsync<URLString[], ProxyError> {
    return this.call(this.core.getConsentContractURLs(contractAddress));
  }
  getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, ProxyError> {
    return this.call(this.core.getConsentCapacity(contractAddress));
  }
  getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number | undefined,
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    ProxyError
  > {
    return this.call(
      this.core.marketplace.getEarnedRewardsByContractAddress(
        contractAddresses,
        timeoutMs,
      ),
    );
  }
  proxyType: ECoreProxyType = ECoreProxyType.IFRAME_BRIDGE;

  protected call<T, E extends Error>(func: ResultAsync<T, E>) {
    return func.mapErr((err) => {
      return new ProxyError(err.message);
    });
  }
  getAge(): ResultAsync<Age | null, ProxyError> {
    return this.call(this.core.getAge(this.sourceDomain));
  }

  setGivenName(givenName: GivenName): ResultAsync<void, ProxyError> {
    return this.call(this.core.setGivenName(givenName, this.sourceDomain));
  }

  getGivenName(): ResultAsync<GivenName | null, ProxyError> {
    return this.call(this.core.getGivenName(this.sourceDomain));
  }

  setFamilyName(familyName: FamilyName): ResultAsync<void, ProxyError> {
    return this.call(this.core.setFamilyName(familyName, this.sourceDomain));
  }

  getFamilyName(): ResultAsync<FamilyName | null, ProxyError> {
    return this.call(this.core.getFamilyName(this.sourceDomain));
  }

  setBirthday(birthday: UnixTimestamp): ResultAsync<void, ProxyError> {
    return this.call(this.core.setBirthday(birthday, this.sourceDomain));
  }

  getBirthday(): ResultAsync<UnixTimestamp | null, ProxyError> {
    return this.call(this.core.getBirthday(this.sourceDomain));
  }

  setGender(gender: Gender): ResultAsync<void, ProxyError> {
    return this.call(this.core.setGender(gender, this.sourceDomain));
  }

  getGender(): ResultAsync<Gender | null, ProxyError> {
    return this.call(this.core.getGender(this.sourceDomain));
  }

  setEmail(email: EmailAddressString): ResultAsync<void, ProxyError> {
    return this.call(this.core.setEmail(email, this.sourceDomain));
  }

  getEmail(): ResultAsync<EmailAddressString | null, ProxyError> {
    return this.call(this.core.getEmail(this.sourceDomain));
  }

  setLocation(location: CountryCode): ResultAsync<void, ProxyError> {
    return this.call(this.core.setLocation(location, this.sourceDomain));
  }

  getLocation(): ResultAsync<CountryCode | null, ProxyError> {
    return this.call(this.core.getLocation(this.sourceDomain));
  }

  getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, ProxyError> {
    return this.call(
      this.core.getTokenPrice(chainId, address, timestamp, this.sourceDomain),
    );
  }

  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], ProxyError> {
    return this.call(this.core.getTokenMarketData(ids, this.sourceDomain));
  }
  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, ProxyError> {
    return this.call(
      this.core.getTokenInfo(chainId, contractAddress, this.sourceDomain),
    );
  }

  getAccountBalances(): ResultAsync<TokenBalance[], ProxyError> {
    return this.call(this.core.getAccountBalances(this.sourceDomain));
  }

  getTransactionValueByChain(): ResultAsync<
    TransactionFlowInsight[],
    ProxyError
  > {
    return this.call(this.core.getTransactionValueByChain(this.sourceDomain));
  }

  getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], ProxyError> {
    return this.call(this.core.getTransactions(filter, this.sourceDomain));
  }
}
