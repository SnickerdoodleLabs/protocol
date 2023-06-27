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
  ISdlDiscordMethods,
  ISdlTwitterMethods,
  LanguageCode,
  MarketplaceListing,
  MarketplaceTag,
  OAuthAuthorizationCode,
  PagedResponse,
  PagingRequest,
  PossibleReward,
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
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
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
  TNotification,
  AddAccountParams,
  UnlockParams,
  UnlinkAccountParams,
  SetBirthdayParams,
  SetGivenNameParams,
  SetFamilyNameParams,
  GetUnlockMessageParams,
  SetApplyDefaultPermissionsParams,
  SetEmailParams,
  SetLocationParams,
  SetGenderParams,
  AcceptInvitationParams,
  GetAgreementPermissionsParams,
  SetDefaultPermissionsWithDataTypesParams,
  LeaveCohortParams,
  GetInvitationMetadataByCIDParams,
  ScamFilterSettingsParams,
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
  twitter: ISdlTwitterMethods;

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
      unlink: (discordProfileId: DiscordID) => {
        return coreGateway.discord.unlink(discordProfileId);
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
    eventEmitter.on(PORT_NOTIFICATION, (resp: TNotification) => {
      _this.emit(resp.type, resp);
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return coreGateway.setDefaultReceivingAddress(
      new SetDefaultReceivingAddressParams(receivingAddress),
    );
  }
  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return coreGateway.setReceivingAddress(
      new SetReceivingAddressParams(contractAddress, receivingAddress),
    );
  }
  public getReceivingAddress(
    contractAddress?: EVMContractAddress | undefined,
  ): ResultAsync<AccountAddress, unknown> {
    return coreGateway.getReceivingAddress(
      new GetReceivingAddressParams(contractAddress),
    );
  }

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<PagedResponse<MarketplaceListing>, unknown> {
    return coreGateway.getMarketplaceListingsByTag(
      new GetMarketplaceListingsByTagParams(pagingReq, tag, filterActive),
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<number, unknown> {
    return coreGateway.getListingsTotalByTag(
      new GetListingsTotalByTagParams(tag),
    );
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], unknown> {
    return coreGateway.getTokenMarketData(new GetTokenMarketDataParams(ids));
  }
  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, unknown> {
    return coreGateway.getTokenInfo(
      new GetTokenInfoParams(chainId, contractAddress),
    );
  }
  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, unknown> {
    return coreGateway.getTokenPrice(
      new GetTokenPriceParams(chainId, address, timestamp),
    );
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
      new CheckInvitationStatusParams(consentAddress, signature, tokenId),
    );
  }
  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, JsonRpcError> {
    return coreGateway.getContractCID(
      new GetConsentContractCIDParams(consentAddress),
    );
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
    return coreGateway.unlock(
      new UnlockParams(accountAddress, signature, chain, languageCode),
    );
  }
  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.addAccount(
      new AddAccountParams(accountAddress, signature, chain, languageCode),
    );
  }
  public unlinkAcccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.unlinkAccount(
      new UnlinkAccountParams(accountAddress, signature, chain, languageCode),
    );
  }
  public getUnlockMessage(languageCode: LanguageCode = LanguageCode("en")) {
    return coreGateway.getUnlockMessage(
      new GetUnlockMessageParams(languageCode),
    );
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

  public getDefaultPermissions() {
    return coreGateway.getDefaultPermissions();
  }

  public setDefaultPermissions(dataTypes: EWalletDataType[]) {
    return coreGateway.setDefaultPermissionsWithDataTypes(
      new SetDefaultPermissionsWithDataTypesParams(dataTypes),
    );
  }

  public setDefaultPermissionsToAll() {
    return coreGateway.setDefaultPermissionsToAll();
  }

  public getInvitationMetadataByCID(ipfsCID: IpfsCID) {
    return coreGateway.getInvitationMetadataByCID(
      new GetInvitationMetadataByCIDParams(ipfsCID),
    );
  }

  public getAgreementPermissions(consentContractAddress: EVMContractAddress) {
    return coreGateway.getAgreementPermissions(
      new GetAgreementPermissionsParams(consentContractAddress),
    );
  }
  public getApplyDefaultPermissionsOption() {
    return coreGateway.getApplyDefaultPermissionsOption();
  }
  public setApplyDefaultPermissionsOption(option: boolean) {
    return coreGateway.setApplyDefaultPermissionsOption(
      new SetApplyDefaultPermissionsParams(option),
    );
  }
  public acceptInvitation(
    dataTypes: EWalletDataType[],
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ) {
    return coreGateway.acceptInvitation(
      new AcceptInvitationParams(
        dataTypes,
        consentContractAddress,
        tokenId,
        businessSignature,
      ),
    );
  }

  public leaveCohort(consentContractAddress: EVMContractAddress) {
    return coreGateway.leaveCohort(
      new LeaveCohortParams(consentContractAddress),
    );
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
      new ScamFilterSettingsParams(isScamFilterActive, showMessageEveryTime),
    );
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], unknown> {
    return coreGateway.getSiteVisits();
  }
  public getSiteVisitsMap(): ResultAsync<Map<URLString, number>, unknown> {
    return coreGateway.getSiteVisitsMap();
  }

  public getConsentCapacity(
    contractAddress: EVMContractAddress,
  ): ResultAsync<IConsentCapacity, unknown> {
    return coreGateway.getConsentCapacity(
      new GetConsentCapacityParams(contractAddress),
    );
  }

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs?: number,
  ): ResultAsync<Record<EVMContractAddress, PossibleReward[]>, unknown> {
    return coreGateway.getPossibleRewards(
      new GetPossibleRewardsParams(contractAddresses, timeoutMs),
    );
  }
}

export const DataWalletProxy = new _DataWalletProxy();
