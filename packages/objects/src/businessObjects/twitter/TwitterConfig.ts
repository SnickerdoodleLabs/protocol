import { OAuth1aConfig } from "@objects/businessObjects";
import { URLString } from "@objects/primitives";

export class TwitterConfig extends OAuth1aConfig {
  constructor(
    apiKey: string,
    apiSecretKey: string,
    oAuthBaseUrl: URLString,
    oAuthCallbackUrl: URLString,
    public dataAPIUrl: URLString,
    public pollInterval: number,
  ) {
    super(
      apiKey,
      apiSecretKey,
      "hmac",
      "sha1",
      oAuthBaseUrl,
      oAuthCallbackUrl
    );
  }
}
