import { EHashAlgorithm, ESignatureAlgorithm } from "@objects/businessObjects";
import { URLString } from "@objects/primitives";

export interface OAuth1Config {
  apiKey: string; // aka consumer key
  apiSecretKey: string; // aka consumer secret
  signingAlgorithm: ESignatureAlgorithm;
  hashingAlgorithm: EHashAlgorithm;
  oAuthBaseUrl: URLString;
  oAuthCallbackUrl: URLString;
}
