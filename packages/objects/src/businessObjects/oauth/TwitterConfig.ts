import { EHashAlgorithm, ESignatureAlgorithm } from "@objects/businessObjects";
import { OAuth1aConfig } from "@objects/businessObjects/oauth/OAuth1aConfig.js";
import { TokenSecret, URLString } from "@objects/primitives";

export class TwitterConfig extends OAuth1aConfig {
  constructor(
    apiKey: string,
    apiSecretKey: TokenSecret,
    oAuthBaseUrl: URLString,
    oAuthCallbackUrl: URLString,
    public dataAPIUrl: URLString,
    public pollInterval: number,
  ) {
    super(
      apiKey,
      apiSecretKey,
      ESignatureAlgorithm.HMAC,
      EHashAlgorithm.SHA1,
      oAuthBaseUrl,
      oAuthCallbackUrl,
    );
  }
}
