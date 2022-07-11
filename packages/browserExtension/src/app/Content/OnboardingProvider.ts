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
  EVMAccountAddress,
  LanguageCode,
  Signature,
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
}

export default OnboardingProvider;
