import { IOAuthRepository } from "@core/interfaces/data";
import { EHttpMethods } from "@core/interfaces/enums/index.js";
import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BearerToken,
  OAuth1RequstToken,
  OAuthError,
  TokenAndSecret,
  TokenSecret,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { OAuth1Config } from "packages/objects/src/businessObjects/oauth/OAuth1Config.js";

@injectable()
export class OAuthRepository implements IOAuthRepository {
  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public getOauth1RequestToken(
    url: URLString,
    config: OAuth1Config,
    method: EHttpMethods,
  ): ResultAsync<TokenAndSecret, OAuthError> {
    return this.makeAPICallWithOAuth1<string>(
      url,
      method,
      config,
      undefined,
      undefined,
      undefined,
      this.cryptoUtils.packOAuth1Credentials(config, url, method, {
        oauth_callback: config.oAuthCallbackUrl,
      }),
    )
      .mapErr((error) => {
        return new OAuthError(error.message, error);
      })
      .andThen((responseStr) => {
        const queryParams = new URLSearchParams(responseStr);
        if (!this._responseHasOAuthToken(queryParams)) {
          return errAsync(
            new OAuthError(
              `Requested a "request token" from ${url} but the response does not include a valid oAuth token. Response: ${responseStr}`,
            ),
          );
        }

        return okAsync(
          new TokenAndSecret(
            BearerToken(queryParams.get("oauth_token")!),
            TokenSecret(queryParams.get("oauth_token_secret")!),
          ),
        );
      });
  }

  public getOauth1AccessTokenSearchParams(
    url: URLString,
    config: OAuth1Config,
    method: EHttpMethods,
    requestToken: OAuth1RequstToken,
    verifier: string,
  ): ResultAsync<URLSearchParams, OAuthError> {
    return this.makeAPICallWithOAuth1<string>(url, method, config, undefined, {
      oauth_token: requestToken,
      oauth_verifier: verifier,
    })
      .mapErr((error) => {
        return new OAuthError(error.message, error);
      })
      .andThen((response) => {
        const queryParams = new URLSearchParams(response);
        if (!this._responseHasOAuthToken(queryParams)) {
          return errAsync(
            new OAuthError(
              `Requested a "access token" from ${url} but the response does not include a valid oAuth token. Response: ${response}`,
            ),
          );
        }
        return okAsync(queryParams);
      });
  }

  public makeAPICallWithOAuth1<T>(
    url: URLString,
    method: EHttpMethods,
    config: OAuth1Config,
    accessTokenAndSecret?: TokenAndSecret,
    pathParams?: object,
    bodyParams?: object,
    authOverrides?: string,
  ): ResultAsync<T, AjaxError> {
    switch (method) {
      case EHttpMethods.GET:
        return this.ajaxUtil.get<T>(new URL(url), {
          params: pathParams,
          headers: {
            authorization:
              authOverrides ||
              this.cryptoUtils.packOAuth1Credentials(
                config,
                url,
                method,
                pathParams,
                accessTokenAndSecret,
              ),
          },
        });
      case EHttpMethods.POST:
        return this.ajaxUtil.post<T>(new URL(url), undefined, {
          params: pathParams,
          data: bodyParams,
          headers: {
            authorization:
              authOverrides ||
              this.cryptoUtils.packOAuth1Credentials(
                config,
                url,
                method,
                {
                  ...pathParams,
                  ...bodyParams,
                },
                accessTokenAndSecret,
              ),
          },
        });
    }
  }

  private _responseHasOAuthToken(responseObj: URLSearchParams): boolean {
    return (
      responseObj.get("oauth_token") != null &&
      responseObj.get("oauth_token_secret") != null
    );
  }
}
