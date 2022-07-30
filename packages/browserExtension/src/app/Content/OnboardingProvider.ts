import { ExternalCoreGateway } from "@app/coreGateways";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import LocalMessageStream from "post-message-stream";
import pump from "pump";
import ObjectMultiplex from "obj-multiplex";
import {
  ONBOARDING_PROVIDER_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
} from "@shared/constants/ports";
import {
  Age,
  CountryCodeLetter,
  CountryCodeNumber,
  EmailAddressString,
  EVMAccountAddress,
  FamilyName,
  Gender,
  GivenName,
  LanguageCode,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

let coreGateway: ExternalCoreGateway;

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
coreGateway = new ExternalCoreGateway(rpcEngine);
const clearMux = () => {
  mux.destroy();
  document.removeEventListener("extension-stream-channel-closed", clearMux);
};
document.addEventListener("extension-stream-channel-closed", clearMux);

export class OnboardingProvider {
  static getState() {
    return coreGateway.getState();
  }

  static unlock(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.unlock(accountAddress, signature, languageCode);
  }
  static addAccount(
    accountAddress: EVMAccountAddress,
    signature: Signature,
    languageCode: LanguageCode = LanguageCode("en"),
  ) {
    return coreGateway.addAccount(accountAddress, signature, languageCode);
  }
  static getUnlockMessage(languageCode: LanguageCode = LanguageCode("en")) {
    return coreGateway.getUnlockMessage(languageCode);
  }
  static getAccounts() {
    return coreGateway.getAccounts();
  }
  static getAccountBalances() {
    return coreGateway.getAccountBalances();
  }
  static getAccountNFTs() {
    return coreGateway.getAccountNFTs();
  }
  static getFamilyName() {
    return coreGateway.getFamilyName();
  }
  static getGivenName() {
    return coreGateway.getGivenName();
  }
  static getAge() {
    return coreGateway.getAge();
  }
  static getBirthday() {
    return coreGateway.getBirtday();
  }
  static getEmail() {
    return coreGateway.getEmail();
  }
  static getLocation() {
    return coreGateway.getLocation();
  }
  static getGender() {
    return coreGateway.getGender();
  }
  static setFamilyName(familyName: FamilyName) {
    return coreGateway.setFamilyName(familyName);
  }
  static setGivenName(givenName: GivenName) {
    return coreGateway.setGivenName(givenName);
  }
  static setAge(age: Age) {
    return coreGateway.setAge(age);
  }
  static setBirthday(birthday: UnixTimestamp) {
    return coreGateway.setBirtday(birthday);
  }
  static setEmail(email: EmailAddressString) {
    return coreGateway.setEmail(email);
  }
  static setLocation(location: CountryCodeNumber | CountryCodeLetter) {
    return coreGateway.setLocation(location);
  }
  static setGender(gender: Gender) {
    return coreGateway.setGender(gender);
  }
}

export default OnboardingProvider;
