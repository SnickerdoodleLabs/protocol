import { EventEmitter } from "events";

import {
  AccountAddress,
  OAuth1RequstToken,
  BigNumberString,
  ChainId,
  CountryCode,
  EarnedReward,
  EChain,
  EInvitationStatus,
  EmailAddressString,
  EVMContractAddress,
  EWalletDataType,
  FamilyName,
  Gender,
  GivenName,
  IConsentCapacity,
  IpfsCID,
  ISdlDataWallet,
  IProxyDiscordMethods,
  IProxyTwitterMethods,
  LanguageCode,
  MarketplaceListing,
  MarketplaceTag,
  OAuthAuthorizationCode,
  PagedResponse,
  PagingRequest,
  Signature,
  SiteVisit,
  DiscordID,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  UnixTimestamp,
  URLString,
  TwitterID,
  OAuthVerifier,
  BaseNotification,
  ProxyError,
  PublicEvents,
  LinkedAccount,
  DataWalletAddress,
  ENotificationTypes,
  EProfileFieldType,
  IProxyMetricsMethods,
  IProxyIntegrationMethods,
  EDataWalletPermission,
  DomainName,
  PEMEncodedRSAPublicKey,
  JsonWebToken,
  QueryStatus,
  ECloudStorageType,
  SocialProfileLinkedEvent,
  IProxyStorageMethods,
  ECoreProxyType,
  BlockNumber,
  RefreshToken,
  TransactionFilter,
  IProxyAccountMethods,
  INftProxyMethods,
  JSONString,
  IProxyQuestionnaireMethods,
  NewQuestionnaireAnswer,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { ResultAsync } from "neverthrow";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";

import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
  PORT_NOTIFICATION,
  SetBirthdayParams,
  SetGivenNameParams,
  SetFamilyNameParams,
  SetEmailParams,
  SetLocationParams,
  SetGenderParams,
  GetAgreementPermissionsParams,
  LeaveCohortParams,
  GetInvitationMetadataByCIDParams,
  GetConsentContractCIDParams,
  CheckInvitationStatusParams,
  GetTokenPriceParams,
  GetTokenMarketDataParams,
  GetTokenInfoParams,
  SetDefaultReceivingAddressParams,
  GetReceivingAddressParams,
  SetReceivingAddressParams,
  GetMarketplaceListingsByTagParams,
  GetListingsTotalByTagParams,
  GetConsentCapacityParams,
  GetPossibleRewardsParams,
  GetQueryStatusByCidParams,
  AuthenticateDropboxParams,
  SetAuthenticatedStorageParams,
  GetQueryStatusesParams,
  GetTransactionsParams,
  UpdateAgreementPermissionsParams,
} from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";

let coreGateway: ExternalCoreGateway;
let eventEmitter: UpdatableEventEmitterWrapper;
let appID: string;

const initConnection = () => {
  const localStream = new LocalMessageStream({
    name: `${ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER}${appID}`,
    target: `${CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER}${appID}`,
  });
  const mux = new ObjectMultiplex();
  pump(localStream, mux, localStream);
  const _streamMiddleware = createStreamMiddleware();
  pump(
    _streamMiddleware.stream,
    mux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
    _streamMiddleware.stream,
  );
  const rpcEngine = new JsonRpcEngine();
  rpcEngine.push(_streamMiddleware.middleware);

  if (!coreGateway) {
    coreGateway = new ExternalCoreGateway(rpcEngine);
    eventEmitter = new UpdatableEventEmitterWrapper(
      _streamMiddleware.events,
      PORT_NOTIFICATION,
    );
  } else {
    coreGateway.updateRpcEngine(rpcEngine);
    eventEmitter.update(_streamMiddleware.events);
  }

  const clearMuxAndUpdate = () => {
    mux.destroy();
    document.removeEventListener(
      `extension-stream-channel-closed${appID}`,
      clearMuxAndUpdate,
    );
    initConnection();
  };
  document.addEventListener(
    `extension-stream-channel-closed${appID}`,
    clearMuxAndUpdate,
  );
};

export class _DataWalletProxy extends EventEmitter implements ISdlDataWallet {
  public account: IProxyAccountMethods;
  public discord: IProxyDiscordMethods;
  public integration: IProxyIntegrationMethods;
  public metrics: IProxyMetricsMethods;
  public twitter: IProxyTwitterMethods;
  public storage: IProxyStorageMethods;
  public nft: INftProxyMethods;
  public questionnaire: IProxyQuestionnaireMethods;
  public events: PublicEvents;
  public requestDashboardView = undefined;

  public proxyType: ECoreProxyType = ECoreProxyType.EXTENSION_INJECTED;

  constructor(public extensionId: string, public name: string) {
    super();
    appID = extensionId;
    initConnection(); // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    this.events = new PublicEvents();

    this.on(
      ENotificationTypes.ACCOUNT_ADDED,
      (notification: { data: LinkedAccount }) => {
        this.events.onAccountAdded.next(notification.data);
      },
    );
    this.on(
      ENotificationTypes.WALLET_INITIALIZED,
      (notification: { data: DataWalletAddress }) => {
        this.events.onInitialized.next(notification.data);
      },
    );
    this.on(
      ENotificationTypes.ACCOUNT_REMOVED,
      (notification: { data: LinkedAccount }) => {
        this.events.onAccountRemoved.next(notification.data);
      },
    );

    this.on(
      ENotificationTypes.EARNED_REWARDS_ADDED,
      (notification: { data: EarnedReward[] }) => {
        this.events.onEarnedRewardsAdded.next(notification.data);
      },
    );

    this.on(
      ENotificationTypes.COHORT_JOINED,
      (notification: { data: EVMContractAddress }) => {
        this.events.onCohortJoined.next(notification.data);
      },
    );

    this.on(
      ENotificationTypes.COHORT_LEFT,
      (notification: { data: EVMContractAddress }) => {
        this.events.onCohortLeft.next(notification.data);
      },
    );

    this.on(
      ENotificationTypes.SOCIAL_PROFILE_LINKED,
      (notification: { data: SocialProfileLinkedEvent }) => {
        this.events.onSocialProfileLinked.next(notification.data);
      },
    );

    this.on(
      ENotificationTypes.PROFILE_FIELD_CHANGED,
      (notification: {
        data: { fieldType: EProfileFieldType; value: any };
      }) => {
        switch (notification.data.fieldType) {
          case EProfileFieldType.DOB:
            this.events.onBirthdayUpdated.next(notification.data.value);
            return;
          case EProfileFieldType.GENDER:
            this.events.onGenderUpdated.next(notification.data.value);
            return;
          case EProfileFieldType.LOCATION:
            this.events.onLocationUpdated.next(notification.data.value);
            return;
        }
      },
    );

    this.questionnaire = {
      getAllQuestionnaires: (pagingRequest: PagingRequest) => {
        return coreGateway.questionnaire.getAllQuestionnaires(pagingRequest);
      },
      answerQuestionnaire: (
        questionnaireId: IpfsCID,
        answers: NewQuestionnaireAnswer[],
      ) => {
        return coreGateway.questionnaire.answerQuestionnaire(
          questionnaireId,
          answers,
        );
      },
      getQuestionnairesForConsentContract: (
        pagingRequest: PagingRequest,
        consentContractAddress: EVMContractAddress,
      ) => {
        return coreGateway.questionnaire.getQuestionnairesForConsentContract(
          pagingRequest,
          consentContractAddress,
        );
      },
      getConsentContractsByQuestionnaireCID: (questionnaireCID: IpfsCID) => {
        return coreGateway.questionnaire.getConsentContractsByQuestionnaireCID(
          questionnaireCID,
        );
      },
      getRecommendedConsentContracts: (questionnaireCID: IpfsCID) => {
        return coreGateway.questionnaire.getRecommendedConsentContracts(
          questionnaireCID,
        );
      },
    };

    this.account = {
      addAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
      ) => {
        return coreGateway.account.addAccount(
          accountAddress,
          signature,
          languageCode,
          chain,
        );
      },
      addAccountWithExternalSignature: (
        accountAddress: AccountAddress,
        message: string,
        signature: Signature,
        chain: EChain,
      ) => {
        return coreGateway.account.addAccountWithExternalSignature(
          accountAddress,
          message,
          signature,
          chain,
        );
      },
      addAccountWithExternalTypedDataSignature: (
        accountAddress: AccountAddress,
        domain: ethers.TypedDataDomain,
        types: Record<string, Array<ethers.TypedDataField>>,
        value: Record<string, unknown>,
        signature: Signature,
        chain: EChain,
      ) => {
        return coreGateway.account.addAccountWithExternalTypedDataSignature(
          accountAddress,
          domain,
          types,
          value,
          signature,
          chain,
        );
      },
      unlinkAccount: (accountAddress: AccountAddress, chain: EChain) => {
        return coreGateway.account.unlinkAccount(accountAddress, chain);
      },
      getLinkAccountMessage: (
        languageCode: LanguageCode = LanguageCode("en"),
      ) => {
        return coreGateway.account.getLinkAccountMessage(languageCode);
      },
      getAccounts: () => {
        return coreGateway.account.getAccounts();
      },
    };

    this.discord = {
      initializeUserWithAuthorizationCode: (code: OAuthAuthorizationCode) => {
        return coreGateway.discord.initializeUserWithAuthorizationCode(code);
      },
      installationUrl: () => {
        return coreGateway.discord.installationUrl();
      },
      getUserProfiles: () => {
        return coreGateway.discord.getUserProfiles();
      },
      getGuildProfiles: () => {
        return coreGateway.discord.getGuildProfiles();
      },
      unlink: (discordProfileId: DiscordID) => {
        return coreGateway.discord.unlink(discordProfileId);
      },
    };

    this.integration = {
      requestPermissions: (
        permissions: EDataWalletPermission[],
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        return coreGateway.integration.requestPermissions(permissions);
      },
      getPermissions: (
        domain: DomainName,
      ): ResultAsync<EDataWalletPermission[], ProxyError> => {
        return coreGateway.integration.getPermissions(domain);
      },
      getTokenVerificationPublicKey: (
        domain: DomainName,
      ): ResultAsync<PEMEncodedRSAPublicKey, ProxyError> => {
        return coreGateway.integration.getTokenVerificationPublicKey(domain);
      },
      getBearerToken: (
        nonce: string,
        domain: DomainName,
      ): ResultAsync<JsonWebToken, ProxyError> => {
        return coreGateway.integration.getBearerToken(nonce, domain);
      },
    } as IProxyIntegrationMethods;

    this.metrics = {
      getMetrics: () => {
        return coreGateway.metrics.getMetrics();
      },
      getNFTCache: () => {
        return coreGateway.metrics.getNFTCache();
      },
      getPersistenceNFTs: () => {
        return coreGateway.metrics.getPersistenceNFTs();
      },
      getNFTsHistory: () => {
        return coreGateway.metrics.getNFTsHistory();
      },
    };

    this.nft = {
      getNfts: (
        benchmark: UnixTimestamp | undefined,
        chains: EChain[] | undefined,
        accounts: LinkedAccount[] | undefined,
      ) => {
        return coreGateway.nft.getNfts(benchmark, chains, accounts);
      },
    };

    this.twitter = {
      getOAuth1aRequestToken: () => {
        return coreGateway.twitter.getOAuth1aRequestToken();
      },
      initTwitterProfile: (
        requestToken: OAuth1RequstToken,
        oAuthVerifier: OAuthVerifier,
      ) => {
        return coreGateway.twitter.initTwitterProfile(
          requestToken,
          oAuthVerifier,
        );
      },
      unlinkProfile: (id: TwitterID) => {
        return coreGateway.twitter.unlinkProfile(id);
      },
      getUserProfiles: () => {
        return coreGateway.twitter.getUserProfiles();
      },
    };

    this.storage = {
      // @TODO below functions are not added to ISDLDataWallet interface and iframe
      getDropboxAuth: () => {
        return coreGateway.getDropboxAuth();
      },
      authenticateDropbox: (code: string) => {
        return coreGateway.authenticateDropbox(
          new AuthenticateDropboxParams(code),
        );
      },
      setAuthenticatedStorage: (
        storageType: ECloudStorageType,
        path: string,
        refreshToken: RefreshToken,
      ) => {
        return coreGateway.setAuthenticatedStorage(
          new SetAuthenticatedStorageParams(storageType, path, refreshToken),
        );
      },
      getCurrentCloudStorage: () => {
        return coreGateway.getCurrentCloudStorage();
      },
      getAvailableCloudStorageOptions: () => {
        return coreGateway.getAvailableCloudStorageOptions();
      },
    };

    eventEmitter.on(PORT_NOTIFICATION, (resp: BaseNotification) => {
      _this.emit(resp.type, resp);
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return coreGateway.setDefaultReceivingAddress(
      new SetDefaultReceivingAddressParams(receivingAddress),
    );
  }
  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, ProxyError> {
    return coreGateway.setReceivingAddress(
      new SetReceivingAddressParams(contractAddress, receivingAddress),
    );
  }
  public getReceivingAddress(
    contractAddress?: EVMContractAddress | undefined,
  ): ResultAsync<AccountAddress, ProxyError> {
    return coreGateway.getReceivingAddress(
      new GetReceivingAddressParams(contractAddress),
    );
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, ProxyError> {
    return coreGateway.getMarketplaceListingsByTag(
      new GetMarketplaceListingsByTagParams(pagingReq, tag, filterActive),
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, ProxyError> {
    return coreGateway.getListingsTotalByTag(
      new GetListingsTotalByTagParams(tag),
    );
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], ProxyError> {
    return coreGateway.getTokenMarketData(new GetTokenMarketDataParams(ids));
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, ProxyError> {
    return coreGateway.getTokenInfo(
      new GetTokenInfoParams(chainId, contractAddress),
    );
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, ProxyError> {
    return coreGateway.getTokenPrice(
      new GetTokenPriceParams(chainId, address, timestamp),
    );
  }
  public getEarnedRewards(): ResultAsync<EarnedReward[], ProxyError> {
    return coreGateway.getEarnedRewards();
  }

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, ProxyError> {
    return coreGateway.getQueryStatusByQueryCID(
      new GetQueryStatusByCidParams(queryCID),
    );
  }

  public getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<QueryStatus[], ProxyError> {
    return coreGateway.getQueryStatuses(
      new GetQueryStatusesParams(contractAddress, blockNumber),
    );
  }

  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, ProxyError> {
    return coreGateway.checkInvitationStatus(
      new CheckInvitationStatusParams(consentAddress, signature, tokenId),
    );
  }
  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, ProxyError> {
    return coreGateway.getContractCID(
      new GetConsentContractCIDParams(consentAddress),
    );
  }
  public getState() {
    return coreGateway.getState();
  }

  public getTransactionValueByChain() {
    return coreGateway.getTransactionValueByChain();
  }
  public getTransactions(filter?: TransactionFilter) {
    return coreGateway.getTransactions(new GetTransactionsParams(filter));
  }

  public getAccountBalances() {
    return coreGateway.getAccountBalances();
  }

  public getFamilyName() {
    return coreGateway.getFamilyName();
  }
  public getGivenName() {
    return coreGateway.getGivenName();
  }
  public getAge() {
    return coreGateway.getAge();
  }
  public getBirthday() {
    return coreGateway.getBirtday();
  }
  public getEmail() {
    return coreGateway.getEmail();
  }
  public getLocation() {
    return coreGateway.getLocation();
  }
  public getGender() {
    return coreGateway.getGender();
  }
  public setFamilyName(familyName: FamilyName) {
    return coreGateway.setFamilyName(new SetFamilyNameParams(familyName));
  }
  public setGivenName(givenName: GivenName) {
    return coreGateway.setGivenName(new SetGivenNameParams(givenName));
  }
  public setBirthday(birthday: UnixTimestamp) {
    return coreGateway.setBirtday(new SetBirthdayParams(birthday));
  }
  public setEmail(email: EmailAddressString) {
    return coreGateway.setEmail(new SetEmailParams(email));
  }
  public setLocation(location: CountryCode) {
    return coreGateway.setLocation(new SetLocationParams(location));
  }
  public setGender(gender: Gender) {
    return coreGateway.setGender(new SetGenderParams(gender));
  }
  public getAcceptedInvitationsCID() {
    return coreGateway.getAcceptedInvitationsCID();
  }

  public getAvailableInvitationsCID() {
    return coreGateway.getAvailableInvitationsCID();
  }

  public getInvitationMetadataByCID(ipfsCID: IpfsCID) {
    return coreGateway.getInvitationMetadataByCID(
      new GetInvitationMetadataByCIDParams(ipfsCID),
    );
  }

  public getDataPermissions(consentContractAddress: EVMContractAddress) {
    return coreGateway.getDataPermissions(
      new GetAgreementPermissionsParams(consentContractAddress),
    );
  }
  public updateAgreementPermissions(
    consentContractAddress: EVMContractAddress,
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, ProxyError> {
    return coreGateway.updateAgreementPermissions(
      new UpdateAgreementPermissionsParams(consentContractAddress, dataTypes),
    );
  }

  public leaveCohort(consentContractAddress: EVMContractAddress) {
    return coreGateway.leaveCohort(
      new LeaveCohortParams(consentContractAddress),
    );
  }
  public getDataWalletAddress() {
    return coreGateway.getDataWalletAddress();
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], ProxyError> {
    return coreGateway.getSiteVisits();
  }
  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, ProxyError> {
    return coreGateway.getSiteVisitsMap();
  }

  public getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    ProxyError
  > {
    return coreGateway.getEarnedRewardsByContractAddress(
      new GetPossibleRewardsParams(contractAddresses),
    );
  }

  public setUIState(state: JSONString): ResultAsync<void, ProxyError> {
    return coreGateway.setUIState(state);
  }
  public getUIState(): ResultAsync<JSONString | null, ProxyError> {
    return coreGateway.getUIState();
  }
}

// export const DataWalletProxy = new _DataWalletProxy();
