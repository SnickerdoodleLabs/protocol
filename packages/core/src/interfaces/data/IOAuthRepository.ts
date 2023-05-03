import {
  AjaxError,
  OAuth1RequstToken,
  OAuthError,
  TokenAndSecret,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";
import { OAuth1Config } from "packages/objects/src/businessObjects/oauth/OAuth1Config.js";

export interface IOAuthRepository {
  getOauth1RequestToken(
    url: URLString,
    config: OAuth1Config,
    method: "GET" | "POST",
  ): ResultAsync<TokenAndSecret, OAuthError>;
  getOauth1AccessToken(
    url: URLString,
    config: OAuth1Config,
    method: "GET" | "POST",
    requestToken: OAuth1RequstToken,
    verifier: string,
  ): ResultAsync<URLSearchParams, OAuthError>;
  makeAPICallWithOAuth1<T>(
    url: URLString,
    method: "GET" | "POST",
    config: OAuth1Config,
    accessTokenAndSecret?: TokenAndSecret,
    pathParams?: object,
    bodyParams?: object,
  ): ResultAsync<T, AjaxError>;
}

export const IOAuthRepositoryType = Symbol.for("IOAuthRepository");
