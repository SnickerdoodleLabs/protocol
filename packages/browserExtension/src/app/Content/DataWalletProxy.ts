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
  LinkedAccount,
  TokenBalance,
  WalletNFT,
  IOpenSeaMetadata,
  DataWalletAddress,
  IScamFilterPreferences,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine, JsonRpcError } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { ResultAsync } from "neverthrow";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";

import { ExternalCoreGateway } from "@app/coreGateways/index.js";
import { UpdatableEventEmitterWrapper } from "@app/utils/index.js";
import {
  ONBOARDING_PROVIDER_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  PORT_NOTIFICATION,
} from "@shared/constants/ports.js";
import { TNotification } from "@shared/types/notification.js";

export class DataWalletProxy extends EventEmitter implements ISdlDataWallet {
  protected mux: ObjectMultiplex;
  protected rpcEngine: JsonRpcEngine;
  protected coreGateway: ExternalCoreGateway;
  protected eventEmitter: UpdatableEventEmitterWrapper;
  constructor() {
    super();

    // Create a message stream and a new mux object
    const localStream = new LocalMessageStream({
      name: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
      target: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
    });
    this.mux = new ObjectMultiplex();

    // Send the stream through the mux
    pump(localStream, this.mux, localStream);

    // Create the stream middleware
    const _streamMiddleware = createStreamMiddleware();

    // Send it through the mux
    pump(
      _streamMiddleware.stream,
      this.mux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
      _streamMiddleware.stream,
    );

    // Now create a new rpcEngine and connect it to the stream middleware
    this.rpcEngine = new JsonRpcEngine();
    this.rpcEngine.push(_streamMiddleware.middleware);

    // Create a new connection to the core, with this initial rpcEngine.
    this.coreGateway = new ExternalCoreGateway(this.rpcEngine);

    // Create a new event emitter wrapper based on events from the stream middleware
    this.eventEmitter = new UpdatableEventEmitterWrapper(
      _streamMiddleware.events,
      PORT_NOTIFICATION,
    );

    // Echo PORT_NOTIFICATION events from the internal event emitter to this class itself
    // (which is an event emitter)
    this.eventEmitter.on(PORT_NOTIFICATION, (resp: TNotification) => {
      this.emit(resp.type, resp);
    });

    // Listen to the document, anytime the stream channel is closed we need to renew things.
    document.addEventListener("extension-stream-channel-closed", () => {
      this.renewConnection();
    });
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return this.coreGateway.setDefaultReceivingAddress(receivingAddress);
  }
  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, unknown> {
    return this.coreGateway.setReceivingAddress(
      contractAddress,
      receivingAddress,
    );
  }
  public getReceivingAddress(
    contractAddress?: EVMContractAddress | undefined,
  ): ResultAsync<AccountAddress, unknown> {
    return this.coreGateway.getReceivingAddress(contractAddress);
  }

  public getMarketplaceListings(
    count?: number | undefined,
    headAt?: number | undefined,
  ): ResultAsync<MarketplaceListing, unknown> {
    return this.coreGateway.getMarketplaceListings(count, headAt);
  }

  public getListingsTotal(): ResultAsync<number, unknown> {
    return this.coreGateway.getListingsTotal();
  }

  public getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], unknown> {
    return this.coreGateway.getTokenMarketData(ids);
  }

  public getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, unknown> {
    return this.coreGateway.getTokenInfo(chainId, contractAddress);
  }

  public getTokenPrice(
    chainId: ChainId,
    address: TokenAddress | null,
    timestamp?: UnixTimestamp,
  ): ResultAsync<number, unknown> {
    return this.coreGateway.getTokenPrice(chainId, address, timestamp);
  }
  public getEarnedRewards(): ResultAsync<EarnedReward[], unknown> {
    return this.coreGateway.getEarnedRewards();
  }

  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, JsonRpcError> {
    return this.coreGateway.checkInvitationStatus(
      consentAddress,
      signature,
      tokenId,
    );
  }
  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<IpfsCID, JsonRpcError> {
    return this.coreGateway.getContractCID(consentAddress);
  }
  public getState() {
    return this.coreGateway.getState();
  }

  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return this.coreGateway.unlock(
      accountAddress,
      signature,
      chain,
      languageCode,
    );
  }
  public addAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return this.coreGateway.addAccount(
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
    return this.coreGateway.unlinkAccount(
      accountAddress,
      signature,
      chain,
      languageCode,
    );
  }
  public getUnlockMessage(languageCode: LanguageCode = LanguageCode("en")) {
    return this.coreGateway.getUnlockMessage(languageCode);
  }
  public getAccounts(): ResultAsync<LinkedAccount[], JsonRpcError> {
    return this.coreGateway.getAccounts();
  }
  public getAccountBalances(): ResultAsync<TokenBalance[], JsonRpcError> {
    return this.coreGateway.getAccountBalances();
  }
  public getAccountNFTs(): ResultAsync<WalletNFT[], JsonRpcError> {
    return this.coreGateway.getAccountNFTs();
  }
  public getFamilyName(): ResultAsync<FamilyName | null, JsonRpcError> {
    return this.coreGateway.getFamilyName();
  }
  public getGivenName(): ResultAsync<GivenName | null, JsonRpcError> {
    return this.coreGateway.getGivenName();
  }
  public getAge(): ResultAsync<Age | null, JsonRpcError> {
    return this.coreGateway.getAge();
  }
  public getBirthday(): ResultAsync<UnixTimestamp | null, JsonRpcError> {
    return this.coreGateway.getBirtday();
  }
  public getEmail(): ResultAsync<EmailAddressString | null, JsonRpcError> {
    return this.coreGateway.getEmail();
  }
  public getLocation(): ResultAsync<CountryCode | null, JsonRpcError> {
    return this.coreGateway.getLocation();
  }
  public getGender(): ResultAsync<Gender | null, JsonRpcError> {
    return this.coreGateway.getGender();
  }
  public setFamilyName(
    familyName: FamilyName,
  ): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setFamilyName(familyName);
  }
  public setGivenName(givenName: GivenName): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setGivenName(givenName);
  }
  public setBirthday(birthday: UnixTimestamp): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setBirtday(birthday);
  }
  public setEmail(email: EmailAddressString): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setEmail(email);
  }
  public setLocation(location: CountryCode): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setLocation(location);
  }
  public setGender(gender: Gender): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setGender(gender);
  }
  public getAcceptedInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this.coreGateway.getAcceptedInvitationsCID();
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Record<EVMContractAddress, IpfsCID>,
    JsonRpcError
  > {
    return this.coreGateway.getAvailableInvitationsCID();
  }

  public getDefaultPermissions(): ResultAsync<EWalletDataType[], JsonRpcError> {
    return this.coreGateway.getDefaultPermissions();
  }

  public setDefaultPermissions(
    dataTypes: EWalletDataType[],
  ): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setDefaultPermissionsWithDataTypes(dataTypes);
  }

  public setDefaultPermissionsToAll(): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setDefaultPermissionsToAll();
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, JsonRpcError> {
    return this.coreGateway.getInvitationMetadataByCID(ipfsCID);
  }

  public getAgreementPermissions(consentContractAddres: EVMContractAddress) {
    return this.coreGateway.getAgreementPermissions(consentContractAddres);
  }
  public getApplyDefaultPermissionsOption() {
    return this.coreGateway.getApplyDefaultPermissionsOption();
  }
  public setApplyDefaultPermissionsOption(option: boolean) {
    return this.coreGateway.setApplyDefaultPermissionsOption(option);
  }
  public acceptInvitation(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
    tokenId?: BigNumberString,
    businessSignature?: Signature,
  ) {
    return this.coreGateway.acceptInvitation(
      dataTypes,
      consentContractAddress,
      tokenId,
      businessSignature,
    );
  }

  public leaveCohort(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.leaveCohort(consentContractAddress);
  }
  public closeTab(): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.closeTab();
  }
  public getDataWalletAddress(): ResultAsync<
    DataWalletAddress | null,
    JsonRpcError
  > {
    return this.coreGateway.getDataWalletAddress();
  }
  public getScamFilterSettings(): ResultAsync<
    IScamFilterPreferences,
    JsonRpcError
  > {
    return this.coreGateway.getScamFilterSettings();
  }
  public setScamFilterSettings(
    isScamFilterActive: boolean,
    showMessageEveryTime: boolean,
  ): ResultAsync<void, JsonRpcError> {
    return this.coreGateway.setScamFilterSettings(
      isScamFilterActive,
      showMessageEveryTime,
    );
  }
  public getSiteVisits(): ResultAsync<SiteVisit[], unknown> {
    return this.coreGateway.getSiteVisits();
  }
  public getSiteVisitsMap(): ResultAsync<Record<URLString, number>, unknown> {
    return this.coreGateway.getSiteVisitsMap();
  }

  protected renewConnection() {
    // Create a new message stream
    const localStream = new LocalMessageStream({
      name: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
      target: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
    });

    // Destroy the old mux and recreate it
    this.mux.destroy();
    this.mux = new ObjectMultiplex();

    // Send the message stream through the mux
    pump(localStream, this.mux, localStream);

    // Create a new middleware and send it through the mux
    const _streamMiddleware = createStreamMiddleware();
    pump(
      _streamMiddleware.stream,
      this.mux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
      _streamMiddleware.stream,
    );

    // Create a brand new JsonRpcEngine
    this.rpcEngine = new JsonRpcEngine();
    this.rpcEngine.push(_streamMiddleware.middleware);

    // Update the existing core gateway and event emitter
    this.coreGateway.updateRpcEngine(this.rpcEngine);
    this.eventEmitter.update(_streamMiddleware.events);
  }
}
