import {
  TypedDataDomain,
  TypedDataField,
} from "@ethersproject/abstract-signer";
import {
  AccountAddress,
  Age,
  BackupCreatedEvent,
  BackupRestoreEvent,
  BigNumberString,
  ChainId,
  CountryCode,
  DataPermissionsUpdatedEvent,
  DataWalletAddress,
  DiscordGuildProfile,
  DiscordID,
  DiscordProfile,
  DomainName,
  EChain,
  EInvitationStatus,
  EVMContractAddress,
  EVMTransaction,
  EWalletDataType,
  EarnedReward,
  EmailAddressString,
  FamilyName,
  Gender,
  GivenName,
  IConfigOverrides,
  IConsentCapacity,
  IOldUserAgreement,
  IProxyMetricsMethods,
  IProxyDiscordMethods,
  IProxyTwitterMethods,
  IpfsCID,
  LanguageCode,
  LinkedAccount,
  MarketplaceListing,
  MarketplaceTag,
  MetatransactionSignatureRequest,
  OAuth1RequstToken,
  OAuthAuthorizationCode,
  OAuthVerifier,
  PagedResponse,
  PagingRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  PortfolioUpdate,
  PossibleReward,
  ProxyError,
  PublicEvents,
  RuntimeMetrics,
  SDQLQueryRequest,
  Signature,
  SiteVisit,
  SocialProfileLinkedEvent,
  SocialProfileUnlinkedEvent,
  TokenAddress,
  TokenAndSecret,
  TokenBalance,
  TokenInfo,
  TokenMarketData,
  TwitterID,
  TwitterProfile,
  URLString,
  UnixTimestamp,
  WalletNFT,
  EDataWalletPermission,
  PEMEncodedRSAPublicKey,
  JsonWebToken,
  IProxyIntegrationMethods,
  QueryStatus,
  ECloudStorageType,
  IProxyStorageMethods,
  ECoreProxyType,
  PageInvitation,
  BlockNumber,
  RefreshToken,
  OAuth2Tokens,
  TransactionFlowInsight,
  IProxyAccountMethods,
  ChainTransaction,
  TransactionFilter,
  TransactionPaymentCounter,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, ParentProxy } from "@snickerdoodlelabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { Subject } from "rxjs";

import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/index.js";

export class SnickerdoodleIFrameProxy
  extends ParentProxy
  implements ISnickerdoodleIFrameProxy
{
  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
    protected config: IConfigOverrides,
    protected storageUtils: IStorageUtils,
  ) {
    super(element, iframeUrl, iframeName);

    this.events = new PublicEvents();
    this.onIframeDisplayRequested = new Subject<void>();
  }

  public proxyType: ECoreProxyType = ECoreProxyType.IFRAME_INJECTED;

  public onIframeDisplayRequested: Subject<void>;

  public activate(): ResultAsync<void, ProxyError> {
    return super
      .activate()
      .andThen(() => {
        if (this.child == null) {
          throw new Error(
            "Child proxy not initialized in activate extension in SnickerdoodleIFrameProxy. This indicates a logical error.",
          );
        }

        // Subscribe to the message streams from the iframe,
        // and convert them back to RXJS Subjects.
        this.child.on("onInitialized", (data: DataWalletAddress) => {
          this.events.onInitialized.next(data);
        });

        this.child.on("onQueryPosted", (data: SDQLQueryRequest) => {
          this.events.onQueryPosted.next(data);
        });

        this.child.on("onQueryParametersRequired", (data: IpfsCID) => {
          this.events.onQueryParametersRequired.next(data);
        });

        this.child.on("onAccountAdded", (data: LinkedAccount) => {
          this.events.onAccountAdded.next(data);
        });

        this.child.on("onPasswordAdded", (data: void) => {
          this.events.onPasswordAdded.next(undefined);
        });

        this.child.on("onAccountRemoved", (data: LinkedAccount) => {
          this.events.onAccountRemoved.next(data);
        });

        this.child.on("onPasswordRemoved", (data: void) => {
          this.events.onPasswordRemoved.next(data);
        });

        this.child.on("onCohortJoined", (data: EVMContractAddress) => {
          this.events.onCohortJoined.next(data);
        });

        this.child.on("onCohortLeft", (data: EVMContractAddress) => {
          this.events.onCohortLeft.next(data);
        });

        this.child.on(
          "onDataPermissionsUpdated",
          (data: DataPermissionsUpdatedEvent) => {
            this.events.onDataPermissionsUpdated.next(data);
          },
        );

        this.child.on("onTransaction", (data: EVMTransaction) => {
          this.events.onTransaction.next(data);
        });

        this.child.on(
          "onMetatransactionSignatureRequested",
          (data: MetatransactionSignatureRequest) => {
            this.events.onMetatransactionSignatureRequested.next(data);
          },
        );

        this.child.on(
          "onTokenBalanceUpdate",
          (data: PortfolioUpdate<TokenBalance[]>) => {
            this.events.onTokenBalanceUpdate.next(data);
          },
        );

        this.child.on(
          "onNftBalanceUpdated",
          (data: PortfolioUpdate<WalletNFT[]>) => {
            this.events.onNftBalanceUpdate.next(data);
          },
        );

        this.child.on("onBackupCreated", (data: BackupCreatedEvent) => {
          this.events.onBackupCreated.next(data);
        });

        this.child.on("onBackupRestored", (data: BackupRestoreEvent) => {
          this.events.onBackupRestored.next(data);
        });

        this.child.on("onEarnedRewardsAdded", (data: EarnedReward[]) => {
          this.events.onEarnedRewardsAdded.next(data);
        });

        this.child.on(
          "onPermissionsGranted",
          (data: PermissionsGrantedEvent) => {
            this.events.onPermissionsGranted.next(data);
          },
        );

        this.child.on(
          "onPermissionsRequested",
          (data: PermissionsRequestedEvent) => {
            this.events.onPermissionsRequested.next(data);
          },
        );

        this.child.on("onPermissionsRevoked", (data: DomainName) => {
          this.events.onPermissionsRevoked.next(data);
        });

        this.child.on(
          "onSocialProfileLinked",
          (data: SocialProfileLinkedEvent) => {
            this.events.onSocialProfileLinked.next(data);
          },
        );

        this.child.on(
          "onSocialProfileUnlinked",
          (data: SocialProfileUnlinkedEvent) => {
            this.events.onSocialProfileUnlinked.next(data);
          },
        );

        this.child.on("onBirthdayUpdated", (data: UnixTimestamp) => {
          this.events.onBirthdayUpdated.next(data);
        });

        this.child.on("onGenderUpdated", (data: Gender) => {
          this.events.onGenderUpdated.next(data);
        });

        this.child.on("onLocationUpdated", (data: CountryCode) => {
          this.events.onLocationUpdated.next(data);
        });

        this.child.on("onIframeDisplayRequested", () => {
          this._displayCoreIFrame();
        });

        this.child.on("onIframeHideRequested", () => {
          this._closeCoreIFrame();
        });

        /* Now, we need to pass the config over to the iframe */
        return this._createCall<IConfigOverrides, ProxyError, void>(
          "setConfig",
          this.config,
        );
      })
      .map(() => {
        console.log("Snickerdoodle Protocol web integration activated");
      });
  }

  public initialize(): ResultAsync<void, ProxyError> {
    return this._createCall("initialize", null);
  }

  public checkURLForInvitation(url: URLString): ResultAsync<void, ProxyError> {
    return this._createCall("checkURLForInvitation", { url });
  }

  public getAge(): ResultAsync<Age | null, ProxyError> {
    return this._createCall("getAge", null);
  }

  public setGivenName(givenName: GivenName): ResultAsync<void, ProxyError> {
    return this._createCall("setGivenName", {
      givenName,
    });
  }

  public getGivenName(): ResultAsync<GivenName | null, ProxyError> {
    return this._createCall("getGivenName", null);
  }

  public setFamilyName(familyName: FamilyName): ResultAsync<void, ProxyError> {
    return this._createCall("setFamilyName", {
      familyName,
    });
  }

  public getFamilyName(): ResultAsync<FamilyName | null, ProxyError> {
    return this._createCall("getFamilyName", null);
  }

  public setBirthday(birthday: UnixTimestamp): ResultAsync<void, ProxyError> {
    return this._createCall("setBirthday", {
      birthday,
    });
  }

  public getBirthday(): ResultAsync<UnixTimestamp | null, ProxyError> {
    return this._createCall("getBirthday", null);
  }

  public setGender(gender: Gender): ResultAsync<void, ProxyError> {
    return this._createCall("setGender", {
      gender,
    });
  }

  public getGender(): ResultAsync<Gender | null, ProxyError> {
    return this._createCall("getGender", null);
  }

  public setEmail(email: EmailAddressString): ResultAsync<void, ProxyError> {
    return this._createCall("setEmail", {
      email,
    });
  }

  public getEmail(): ResultAsync<EmailAddressString | null, ProxyError> {
    return this._createCall("getEmail", null);
  }

  public setLocation(location: CountryCode): ResultAsync<void, ProxyError> {
    return this._createCall("setLocation", {
      location,
    });
  }

  public getLocation(): ResultAsync<CountryCode | null, ProxyError> {
    return this._createCall("getLocation", null);
  }

  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, ProxyError> {
    return this._createCall("getTokenPrice", {
      chainId,
      address,
      timestamp,
    });
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], ProxyError> {
    return this._createCall("getTokenMarketData", {
      ids,
    });
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, ProxyError> {
    return this._createCall("getTokenInfo", {
      chainId,
      contractAddress,
    });
  }

  public getAccountBalances(): ResultAsync<TokenBalance[], ProxyError> {
    return this._createCall("getAccountBalances", null);
  }

  public getAccountNFTs(): ResultAsync<WalletNFT[], ProxyError> {
    return this._createCall("getAccountNFTs", null);
  }

  public getTransactionValueByChain(): ResultAsync<
    TransactionFlowInsight[],
    ProxyError
  > {
    return this._createCall("getTransactionValueByChain", null);
  }
  public getTransactions(
    filter?: TransactionFilter,
  ): ResultAsync<ChainTransaction[], ProxyError> {
    return this._createCall("getTransactions", {
      filter,
    });
  }

  public closeTab(): ResultAsync<void, ProxyError> {
    return okAsync(undefined);
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._createCall("getAcceptedInvitationsCID", null);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._createCall("getAvailableInvitationsCID", null);
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement, ProxyError> {
    return this._createCall("getInvitationMetadataByCID", {
      ipfsCID,
    });
  }

  public getAgreementPermissions(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], ProxyError> {
    return this._createCall("getAgreementPermissions", {
      consentContractAddress,
    });
  }

  public getApplyDefaultPermissionsOption(): ResultAsync<boolean, ProxyError> {
    return this._createCall("getApplyDefaultPermissionsOption", null);
  }

  public setApplyDefaultPermissionsOption(
    option: boolean,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("setApplyDefaultPermissionsOption", {
      option,
    });
  }

  public getDefaultPermissions(): ResultAsync<EWalletDataType[], ProxyError> {
    return this._createCall("getDefaultPermissions", null);
  }

  public setDefaultPermissions(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ProxyError> {
    return this._createCall("setDefaultPermissions", {
      dataTypes,
    });
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, ProxyError> {
    return this._createCall("setDefaultPermissionsToAll", null);
  }

  public getInvitationByDomain(
    domain: DomainName,
    path: string,
  ): ResultAsync<PageInvitation | null, ProxyError> {
    return this._createCall("getInvitationByDomain", { domain, path });
  }

  public acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("acceptInvitation", {
      dataTypes,
      consentContractAddress,
      tokenId,
      businessSignature,
    });
  }

  public rejectInvitation(
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
    rejectUntil?: UnixTimestamp,
  ) {
    return this._createCall("rejectInvitation", {
      consentContractAddress,
      tokenId,
      businessSignature,
      rejectUntil,
    });
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("leaveCohort", {
      consentContractAddress,
    });
  }

  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, ProxyError> {
    return this._createCall("checkInvitationStatus", {
      consentAddress,
      signature,
      tokenId,
    });
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, ProxyError> {
    return this._createCall("getConsentContractCID", {
      consentAddress,
    });
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], ProxyError> {
    return this._createCall("getEarnedRewards", null);
  }

  public getSiteVisits(): ResultAsync<SiteVisit[], ProxyError> {
    return this._createCall("getSiteVisits", null);
  }

  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError> {
    return this._createCall("getSiteVisitsMap", null);
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<PagedResponse<MarketplaceListing>, ProxyError> {
    return this._createCall("getMarketplaceListingsByTag", {
      pagingReq,
      tag,
      filterActive,
    });
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, ProxyError> {
    return this._createCall("getListingsTotalByTag", {
      tag,
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("setDefaultReceivingAddress", {
      receivingAddress,
    });
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("setReceivingAddress", {
      contractAddress,
      receivingAddress,
    });
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, ProxyError> {
    return this._createCall("getReceivingAddress", {
      contractAddress,
    });
  }

  public getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, ProxyError> {
    return this._createCall("getConsentCapacity", {
      contractAddress,
    });
  }

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, ProxyError> {
    return this._createCall("getPossibleRewards", {
      contractAddresses,
      timeoutMs,
    });
  }

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, ProxyError> {
    return this._createCall("getQueryStatusByQueryCID", {
      queryCID,
    });
  }

  public getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], ProxyError> {
    return this._createCall("getQueryStatuses", {
      contractAddress,
      blockNumber,
    });
  }

  public switchToTab(tabId: number): ResultAsync<void, ProxyError> {
    throw new Error("Method not implemented.");
  }

  public account: IProxyAccountMethods = {
    addAccount: (
      accountAddress: AccountAddress,
      signature: Signature,
      languageCode: LanguageCode,
      chain: EChain,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("addAccount", {
        accountAddress,
        signature,
        chain,
        languageCode,
      });
    },
    addAccountWithExternalSignature: (
      accountAddress: AccountAddress,
      message: string,
      signature: Signature,
      chain: EChain,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("addAccountWithExternalSignature", {
        accountAddress,
        message,
        signature,
        chain,
      });
    },
    addAccountWithExternalTypedDataSignature: (
      accountAddress: AccountAddress,
      domain: TypedDataDomain,
      types: Record<string, Array<TypedDataField>>,
      value: Record<string, unknown>,
      signature: Signature,
      chain: EChain,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("addAccountWithExternalTypedDataSignature", {
        accountAddress,
        domain,
        types,
        value,
        signature,
        chain,
      });
    },
    getLinkAccountMessage: (
      languageCode: LanguageCode,
    ): ResultAsync<string, ProxyError> => {
      return this._createCall("getLinkAccountMessage", {
        languageCode,
      });
    },
    getAccounts: (): ResultAsync<LinkedAccount[], ProxyError> => {
      return this._createCall("getAccounts", null);
    },
    unlinkAccount: (
      accountAddress: AccountAddress,
      chain: EChain,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("unlinkAccount", {
        accountAddress,
        chain,
      });
    },
  };

  public discord: IProxyDiscordMethods = {
    initializeUserWithAuthorizationCode: (
      code: OAuthAuthorizationCode,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("discord.initializeUserWithAuthorizationCode", {
        code,
      });
    },

    installationUrl: (
      redirectTabId?: number,
    ): ResultAsync<URLString, ProxyError> => {
      return this._createCall("discord.installationUrl", {
        redirectTabId: redirectTabId,
      });
    },

    getUserProfiles: (): ResultAsync<DiscordProfile[], ProxyError> => {
      return this._createCall("discord.getUserProfiles", null);
    },
    getGuildProfiles: (): ResultAsync<DiscordGuildProfile[], ProxyError> => {
      return this._createCall("discord.getGuildProfiles", null);
    },
    unlink: (discordProfileId: DiscordID): ResultAsync<void, ProxyError> => {
      return this._createCall("discord.unlink", { discordProfileId });
    },
  };

  public integration: IProxyIntegrationMethods = {
    requestPermissions: (
      permissions: EDataWalletPermission[],
    ): ResultAsync<EDataWalletPermission[], ProxyError> => {
      return this._createCall("integration.requestPermissions", {
        permissions,
      });
    },
    getPermissions: (
      domain: DomainName,
    ): ResultAsync<EDataWalletPermission[], ProxyError> => {
      return this._createCall("integration.getPermissions", {
        domain,
      });
    },
    getTokenVerificationPublicKey: (
      domain: DomainName,
    ): ResultAsync<PEMEncodedRSAPublicKey, ProxyError> => {
      return this._createCall("integration.getTokenVerificationPublicKey", {
        domain,
      });
    },
    getBearerToken: (
      nonce: string,
      domain: DomainName,
    ): ResultAsync<JsonWebToken, ProxyError> => {
      return this._createCall("integration.getBearerToken", {
        nonce,
        domain,
      });
    },
  };

  public metrics: IProxyMetricsMethods = {
    getMetrics: (): ResultAsync<RuntimeMetrics, ProxyError> => {
      return this._createCall("metrics.getMetrics", null);
    },
  };

  public twitter: IProxyTwitterMethods = {
    getOAuth1aRequestToken: (): ResultAsync<TokenAndSecret, ProxyError> => {
      return this._createCall("twitter.getOAuth1aRequestToken", null);
    },
    initTwitterProfile: (
      requestToken: OAuth1RequstToken,
      oAuthVerifier: OAuthVerifier,
    ): ResultAsync<TwitterProfile, ProxyError> => {
      return this._createCall("twitter.initTwitterProfile", {
        requestToken,
        oAuthVerifier,
      });
    },
    unlinkProfile: (id: TwitterID): ResultAsync<void, ProxyError> => {
      return this._createCall("twitter.unlinkProfile", { id });
    },
    getUserProfiles: (): ResultAsync<TwitterProfile[], ProxyError> => {
      return this._createCall("twitter.getUserProfiles", null);
    },
  };

  public storage: IProxyStorageMethods = {
    setAuthenticatedStorage: (
      storageType: ECloudStorageType,
      path: string,
      refreshToken: RefreshToken,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("storage.setAuthenticatedStorage", {
        storageType,
        path,
        refreshToken,
      });
    },
    authenticateDropbox: (
      code: string,
    ): ResultAsync<OAuth2Tokens, ProxyError> => {
      return this._createCall("storage.authenticateDropbox", {
        code,
      });
    },
    getDropboxAuth: (): ResultAsync<URLString, ProxyError> => {
      return this._createCall("storage.getDropboxAuth", {});
    },
    getCurrentCloudStorage: (): ResultAsync<ECloudStorageType, ProxyError> => {
      return this._createCall("storage.getCurrentCloudStorage", {});
    },
    getAvailableCloudStorageOptions: (): ResultAsync<
      Set<ECloudStorageType>,
      ProxyError
    > => {
      return this._createCall("storage.getAvailableCloudStorageOptions", {});
    },
  };

  public events: PublicEvents;

  private _displayCoreIFrame(): void {
    // Show core iframe
    if (this.child != null) {
      this.child.frame.style.display = "block";
    }

    // Show core iframe container
    if (this.element != null) {
      this.element.style.display = "block";
    }
  }

  private _closeCoreIFrame(): void {
    // Hide core iframe
    if (this.child != null) {
      this.child.frame.style.display = "none";
    }

    // Hide core iframe container
    if (this.element != null) {
      this.element.style.display = "none";
    }
  }
}
