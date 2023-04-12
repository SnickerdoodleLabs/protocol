import { EventEmitter } from "events";

import {
  AccountAddress,
  Age,
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
  IpfsCID,
  ISdlDataWallet,
  LanguageCode,
  Signature,
  TokenAddress,
  TokenInfo,
  TokenMarketData,
  SiteVisit,
  UnixTimestamp,
  URLString,
  MarketplaceListing,
  IConsentCapacity,
  PossibleReward,
  PagingRequest,
  MarketplaceTag,
  PagedResponse,
  ISdlDiscordMethods,
  BearerAuthToken,
  DiscordProfile,
  DiscordGuildProfile,
  SnowflakeID,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { ResultAsync } from "neverthrow";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";

import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  ONBOARDING_PROVIDER_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  PORT_NOTIFICATION,
  TNotification,
} from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";

let coreGateway: ExternalCoreGateway;
let eventEmitter: UpdatableEventEmitterWrapper;

const initConnection = () => {
  const localStream = new LocalMessageStream({
    name: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
    target: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
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
      "extension-stream-channel-closed",
      clearMuxAndUpdate,
    );
    initConnection();
  };
  document.addEventListener(
    "extension-stream-channel-closed",
    clearMuxAndUpdate,
  );
};

initConnection();

export class _DataWalletProxy extends EventEmitter implements ISdlDataWallet {
  discord: ISdlDiscordMethods;

  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
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
      unlink: (discordProfileId: SnowflakeID) => {
        return coreGateway.discord.unlink(discordProfileId);
      },
    };
    eventEmitter.on(PORT_NOTIFICATION, (resp: TNotification) => {
      _this.emit(resp.type, resp);
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return coreGateway.setDefaultReceivingAddress(receivingAddress);
  }
  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return coreGateway.setReceivingAddress(contractAddress, receivingAddress);
  }
  public getReceivingAddress(
    contractAddress?: EVMContractAddress | undefined,
  ): ResultAsync<AccountAddress, unknown> {
    return coreGateway.getReceivingAddress(contractAddress);
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive: boolean = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, unknown> {
    return coreGateway.getMarketplaceListingsByTag(
      pagingReq,
      tag,
      filterActive,
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, unknown> {
    return coreGateway.getListingsTotalByTag(tag);
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], unknown> {
    return coreGateway.getTokenMarketData(ids);
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, unknown> {
    return coreGateway.getTokenInfo(chainId, contractAddress);
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, unknown> {
    return coreGateway.getTokenPrice(chainId, address, timestamp);
  }
  public getEarnedRewards(): ResultAsync<EarnedReward[], unknown> {
    return coreGateway.getEarnedRewards();
  }

  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, JsonRpcError> {
    return coreGateway.checkInvitationStatus(
      consentAddress,
      signature,
      tokenId,
    );
  }
  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, JsonRpcError> {
    return coreGateway.getContractCID(consentAddress);
  }
  public getState() {
    return coreGateway.getState();
  }
  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.unlock(accountAddress, signature, chain, languageCode);
  }
  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.addAccount(
      accountAddress,
      signature,
      chain,
      languageCode,
    );
  }
  public unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.unlinkAccount(
      accountAddress,
      signature,
      chain,
      languageCode,
    );
  }
  public getUnlockMessage(languageCode: LanguageCode = LanguageCode("en")) {
    return coreGateway.getUnlockMessage(languageCode);
  }
  public getAccounts() {
    return coreGateway.getAccounts();
  }
  public getAccountBalances() {
    return coreGateway.getAccountBalances();
  }
  public getAccountNFTs() {
    return coreGateway.getAccountNFTs();
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
    return coreGateway.setFamilyName(familyName);
  }
  public setGivenName(givenName: GivenName) {
    return coreGateway.setGivenName(givenName);
  }
  public setBirthday(birthday: UnixTimestamp) {
    return coreGateway.setBirtday(birthday);
  }
  public setEmail(email: EmailAddressString) {
    return coreGateway.setEmail(email);
  }
  public setLocation(location: CountryCode) {
    return coreGateway.setLocation(location);
  }
  public setGender(gender: Gender) {
    return coreGateway.setGender(gender);
  }
  public getAcceptedInvitationsCID() {
    return coreGateway.getAcceptedInvitationsCID();
  }

  public getAvailableInvitationsCID() {
    return coreGateway.getAvailableInvitationsCID();
  }

  public getDefaultPermissions() {
    return coreGateway.getDefaultPermissions();
  }

  public setDefaultPermissions(dataTypes: EWalletDataType[]) {
    return coreGateway.setDefaultPermissionsWithDataTypes(dataTypes);
  }

  public setDefaultPermissionsToAll() {
    return coreGateway.setDefaultPermissionsToAll();
  }

  public getInvitationMetadataByCID(ipfsCID: IpfsCID) {
    return coreGateway.getInvitationMetadataByCID(ipfsCID);
  }

  public getAgreementPermissions(consentContractAddres: EVMContractAddress) {
    return coreGateway.getAgreementPermissions(consentContractAddres);
  }
  public getApplyDefaultPermissionsOption() {
    return coreGateway.getApplyDefaultPermissionsOption();
  }
  public setApplyDefaultPermissionsOption(option: boolean) {
    return coreGateway.setApplyDefaultPermissionsOption(option);
  }
  public acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ) {
    return coreGateway.acceptInvitation(
      dataTypes,
      consentContractAddress,
      tokenId,
      businessSignature,
    );
  }

  public leaveCohort(consentContractAddress: EVMContractAddress) {
    return coreGateway.leaveCohort(consentContractAddress);
  }
  public closeTab() {
    return coreGateway.closeTab();
  }
  public getDataWalletAddress() {
    return coreGateway.getDataWalletAddress();
  }
  public getScamFilterSettings() {
    return coreGateway.getScamFilterSettings();
  }
  public setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ) {
    return coreGateway.setScamFilterSettings(
      isScamFilterActive,
      showMessageEveryTime,
    );
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], unknown> {
    return coreGateway.getSiteVisits();
  }
  public getSiteVisitsMap(): ResultAsync<Record<URLString, number>, unknown> {
    return coreGateway.getSiteVisitsMap();
  }

  public getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, unknown> {
    return coreGateway.getConsentCapacity(contractAddress);
  }

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, unknown> {
    return coreGateway.getPossibleRewards(contractAddresses, timeoutMs);
  }
}

export const DataWalletProxy = new _DataWalletProxy();
