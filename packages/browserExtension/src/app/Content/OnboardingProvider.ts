import { EventEmitter } from "events";

import {
  Age,
  BigNumberString,
  CountryCode,
  EChain,
  EmailAddressString,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  FamilyName,
  Gender,
  GivenName,
  IpfsCID,
  ISdlDataWallet,
  LanguageCode,
  Signature,
  UnixTimestamp,
  UUID,
} from "@snickerdoodlelabs/objects";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";

import { ExternalCoreGateway } from "@app/coreGateways";
import {
  ONBOARDING_PROVIDER_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  PORT_NOTIFICATION,
} from "@shared/constants/ports";
import { MTSRNotification } from "@shared/objects/notifications/MTSRNotification";

const localStream = new LocalMessageStream({
  name: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  target: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
});
const mux = new ObjectMultiplex();
pump(localStream, mux, localStream);
const streamMiddleware = createStreamMiddleware();
pump(
  streamMiddleware.stream,
  mux.createStream(ONBOARDING_PROVIDER_SUBSTREAM),
  streamMiddleware.stream,
);
const rpcEngine = new JsonRpcEngine();
rpcEngine.push(streamMiddleware.middleware);

const coreGateway = new ExternalCoreGateway(rpcEngine);

const clearMux = () => {
  mux.destroy();
  document.removeEventListener("extension-stream-channel-closed", clearMux);
};
document.addEventListener("extension-stream-channel-closed", clearMux);

export class OnboardingProvider extends EventEmitter implements ISdlDataWallet {
  constructor() {
    super();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    streamMiddleware.events.on(PORT_NOTIFICATION, (resp: MTSRNotification) => {
      _this.emit(resp.type, resp);
    });
  }

  public getState() {
    return coreGateway.getState();
  }
  public unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    chain: EChain,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.unlock(accountAddress, signature, chain, languageCode);
  }
  public addAccount(
    accountAddress: EVMAccountAddress,
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
  public getUnlinkAccountRequest(accountAddress: EVMAccountAddress) {
    return coreGateway.getUnlinkAccountRequest(accountAddress);
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
  public setAge(age: Age) {
    return coreGateway.setAge(age);
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
  public acceptPublicInvitationByConsentContractAddress(
    dataTypes: EWalletDataType[] | null,
    consentContractAddress: EVMContractAddress,
  ) {
    return coreGateway.acceptPublicInvitationByConsentContractAddress(
      dataTypes,
      consentContractAddress,
    );
  }

  public leaveCohort(consentContractAddress: EVMContractAddress) {
    return coreGateway.leaveCohort(consentContractAddress);
  }
  public metatransactionSignatureRequestCallback(
    id: UUID,
    metatransactionSignature: Signature,
    nonce: BigNumberString,
  ) {
    return coreGateway.metatransactionSignatureRequestCallback(
      id,
      metatransactionSignature,
      nonce,
    );
  }
  public closeTab() {
    return coreGateway.closeTab();
  }
  public getDataWalletAddress() {
    return coreGateway.getDataWalletAddress();
  }
}

export default new OnboardingProvider();
