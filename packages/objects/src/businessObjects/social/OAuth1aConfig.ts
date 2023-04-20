import {
  EHashAlgorithm,
  ESignatureAlgorithm,
  ESignatureMethod,
} from "@objects/businessObjects";
import { Base64String, URLString } from "@objects/primitives";
import Crypto from "crypto";
import OAuth from "oauth-1.0a";

export class OAuth1aConfig {
  public signatureMethod: ESignatureMethod;
  public oauth: OAuth;

  constructor(
    public apiKey: string, // aka consumer key
    public apiSecretKey: string, // aka consumer secret
    public signingAlgorithm: ESignatureAlgorithm,
    public hashingAlgorithm: EHashAlgorithm,
    public oAuthBaseUrl: URLString,
    public oAuthCallbackUrl: URLString,
  ) {
    this.signatureMethod = (this.signingAlgorithm.toUpperCase() +
      "-" +
      this.hashingAlgorithm.toUpperCase()) as ESignatureMethod;

    this.oauth = new OAuth({
      consumer: {
        key: apiKey,
        secret: apiSecretKey,
      },
      signature_method: this.signatureMethod,
      hash_function: (baseString, secretKey) =>
        Crypto.createHmac(this.hashingAlgorithm.toLowerCase(), secretKey)
          .update(baseString)
          .digest("base64") as Base64String,
    });
  }
}
