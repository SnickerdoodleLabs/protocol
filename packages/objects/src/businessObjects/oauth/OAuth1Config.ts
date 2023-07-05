import { EHashAlgorithm, ESignatureAlgorithm } from "@objects/enum/index.js";
import { URLString } from "@objects/primitives/index.js";

export interface OAuth1Config {
  apiKey: string; // aka consumer key
  apiSecretKey: string; // aka consumer secret
  signingAlgorithm: ESignatureAlgorithm;
  hashingAlgorithm: EHashAlgorithm;
  oAuthBaseUrl: URLString;
  oAuthCallbackUrl: URLString;
}
