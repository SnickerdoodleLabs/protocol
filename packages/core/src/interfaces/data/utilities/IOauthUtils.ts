import {
  AjaxError,
  OAuth1RequstToken,
  OAuthError,
  OAuth1Config,
  TokenAndSecret,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { EHttpMethods } from "@core/interfaces/enums/index.js";

export interface IOauthUtils {
  getOauth1RequestToken(
    url: URLString,
    config: OAuth1Config,
    method: EHttpMethods,
  ): ResultAsync<TokenAndSecret, OAuthError>;
  getOauth1AccessTokenSearchParams(
    url: URLString,
    config: OAuth1Config,
    method: EHttpMethods,
    requestToken: OAuth1RequstToken,
    verifier: string,
  ): ResultAsync<URLSearchParams, OAuthError>;
  makeAPICallWithOAuth1<T>(
    url: URLString,
    method: EHttpMethods,
    config: OAuth1Config,
    accessTokenAndSecret?: TokenAndSecret,
    pathParams?: object,
    bodyParams?: object,
  ): ResultAsync<T, AjaxError>;
}

export const IOAuthRepositoryType = Symbol.for("IOAuthRepository");
