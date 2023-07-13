import {
  AccountAddress,
  Age,
  BigNumberString,
  ChainId,
  CountryCode,
  DataPermissionsUpdatedEvent,
  DataWalletAddress,
  DataWalletBackupID,
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
  IConsentCapacity,
  IOpenSeaMetadata,
  IScamFilterPreferences,
  ISdlDataWallet,
  ISdlDiscordMethods,
  ISdlTwitterMethods,
  ISnickerdoodleCoreEvents,
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
} from "@snickerdoodlelabs/objects";
import { ParentProxy } from "@snickerdoodlelabs/utils";
import { ResultAsync } from "neverthrow";

export class SnickerdoodleIFrameProxy
  extends ParentProxy
  implements ISdlDataWallet
{
  protected _handshakePromise: Promise<void> | null;

  constructor(
    protected element: HTMLElement | null,
    protected iframeUrl: string,
    protected iframeName: string,
  ) {
    super(element, iframeUrl, iframeName);

    this._handshakePromise = null;
    this.events = new PublicEvents();

    // Initialize the promise that we'll use to monitor the core
    // initialization status. The iframe will emit an event "initialized"
    // once the core is initialized, we'll use that to resolve this promise.
    this._handshakePromise = this.handshake.then((child) => {
      // Subscribe to the message streams from the iframe,
      // and convert them back to RXJS Subjects.
      child.on("onInitialized", (data: DataWalletAddress) => {
        this.events.onInitialized.next(data);
      });

      child.on("onQueryPosted", (data: SDQLQueryRequest) => {
        this.events.onQueryPosted.next(data);
      });

      child.on("onQueryParametersRequired", (data: IpfsCID) => {
        this.events.onQueryParametersRequired.next(data);
      });

      child.on("onAccountAdded", (data: LinkedAccount) => {
        this.events.onAccountAdded.next(data);
      });

      child.on("onPasswordAdded", (data: void) => {
        this.events.onPasswordAdded.next(undefined);
      });

      child.on("onAccountRemoved", (data: LinkedAccount) => {
        this.events.onAccountRemoved.next(data);
      });

      child.on("onPasswordRemoved", (data: void) => {
        this.events.onPasswordRemoved.next(data);
      });

      child.on("onCohortJoined", (data: EVMContractAddress) => {
        this.events.onCohortJoined.next(data);
      });

      child.on("onCohortLeft", (data: EVMContractAddress) => {
        this.events.onCohortLeft.next(data);
      });

      child.on(
        "onDataPermissionsUpdated",
        (data: DataPermissionsUpdatedEvent) => {
          this.events.onDataPermissionsUpdated.next(data);
        },
      );

      child.on("onTransaction", (data: EVMTransaction) => {
        this.events.onTransaction.next(data);
      });

      child.on(
        "onMetatransactionSignatureRequested",
        (data: MetatransactionSignatureRequest) => {
          this.events.onMetatransactionSignatureRequested.next(data);
        },
      );

      child.on(
        "onTokenBalanceUpdate",
        (data: PortfolioUpdate<TokenBalance[]>) => {
          this.events.onTokenBalanceUpdate.next(data);
        },
      );

      child.on("onNftBalanceUpdated", (data: PortfolioUpdate<WalletNFT[]>) => {
        this.events.onNftBalanceUpdate.next(data);
      });

      child.on("onBackupRestored", (data: DataWalletBackupID) => {
        this.events.onBackupRestored.next(data);
      });

      child.on("onEarnedRewardsAdded", (data: EarnedReward[]) => {
        this.events.onEarnedRewardsAdded.next(data);
      });

      child.on("onPermissionsGranted", (data: PermissionsGrantedEvent) => {
        this.events.onPermissionsGranted.next(data);
      });

      child.on("onPermissionsRequested", (data: PermissionsRequestedEvent) => {
        this.events.onPermissionsRequested.next(data);
      });

      child.on("onPermissionsRevoked", (data: DomainName) => {
        this.events.onPermissionsRevoked.next(data);
      });

      child.on("onSocialProfileLinked", (data: SocialProfileLinkedEvent) => {
        this.events.onSocialProfileLinked.next(data);
      });

      child.on(
        "onSocialProfileUnlinked",
        (data: SocialProfileUnlinkedEvent) => {
          this.events.onSocialProfileUnlinked.next(data);
        },
      );
    });
  }

  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("unlock", {
      accountAddress,
      signature,
      chain,
      languageCode,
    });
  }

  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("addAccount", {
      accountAddress,
      signature,
      chain,
      languageCode,
    });
  }

  public getUnlockMessage(
    languageCode: LanguageCode = LanguageCode("en"),
  ): ResultAsync<string, ProxyError> {
    return this._createCall("getUnlockMessage", {
      languageCode,
    });
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

  public getAccounts(): ResultAsync<LinkedAccount[], ProxyError> {
    return this._createCall("getAccounts", null);
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

  public closeTab(): ResultAsync<void, ProxyError> {
    return this._createCall("closeTab", null);
  }

  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    ProxyError
  > {
    return this._createCall("getDataWalletAddress", null);
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._createCall("getAcceptedInvitationsCID", null);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    ProxyError
  > {
    return this._createCall("getAvailableInvitationsCID", null);
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, ProxyError> {
    return this._createCall("getInvitationMetadataByCID", {
      ipfsCID,
    });
  }

  public getAgreementPermissions(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<EWalletDataType[], ProxyError> {
    return this._createCall("getAgreementPermissions", {
      consentContractAddres,
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

  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    ProxyError
  > {
    return this._createCall("getScamFilterSettings", null);
  }

  public setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("setScamFilterSettings", {
      isScamFilterActive,
      showMessageEveryTime,
    });
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, ProxyError> {
    return this._createCall("setDefaultPermissionsToAll", null);
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

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("leaveCohort", {
      consentContractAddress,
    });
  }

  public unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode?: LanguageCode,
  ): ResultAsync<void, ProxyError> {
    return this._createCall("unlinkAccount", {
      accountAddress,
      signature,
      chain,
      languageCode,
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
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, ProxyError> {
    return this._createCall("getPossibleRewards", {
      contractAddresses,
      timeoutMs,
    });
  }

  public discord: ISdlDiscordMethods = {
    initializeUserWithAuthorizationCode: (
      code: OAuthAuthorizationCode,
    ): ResultAsync<void, ProxyError> => {
      return this._createCall("discord.initializeUserWithAuthorizationCode", {
        code,
      });
    },

    installationUrl: (): ResultAsync<URLString, ProxyError> => {
      return this._createCall("discord.installationUrl", null);
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

  twitter: ISdlTwitterMethods = {
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
