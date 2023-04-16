import {
  HashAlgorithm,
  ITokenAndSecret,
  SignatureAlgorithm,
  SignatureMethod,
} from "@objects/businessObjects";
import { Base64String, URLString } from "@objects/primitives";
import Crypto from "crypto";
import OAuth from "oauth-1.0a";

export class OAuth1aConfig {
  public signatureMethod: SignatureMethod;
  public oauth: OAuth;

  constructor(
    public apiKey: string, // aka consumer key
    public apiSecretKey: string, // aka consumer secret
    public signingAlgorithm: SignatureAlgorithm,
    public hashingAlgorithm: HashAlgorithm,
    public oAuthBaseUrl: URLString,
    public oAuthCallbackUrl: URLString,
  ) {
    this.signatureMethod = (this.signingAlgorithm.toUpperCase() +
      "-" +
      this.hashingAlgorithm.toUpperCase()) as SignatureMethod;

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

  public getOAuth1aHeader(
    requestOptions: OAuth.RequestOptions,
    accessToken?: ITokenAndSecret,
  ): string {
    return this.oauth.toHeader(
      this.oauth.authorize(
        requestOptions,
        accessToken
          ? {
              key: accessToken.token,
              secret: accessToken.secret,
            }
          : undefined,
      ),
    ).Authorization;
  }
}
