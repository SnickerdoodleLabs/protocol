import { TokenAndSecret } from "@snickerdoodlelabs/objects";

export interface IOAuthUtils {
  getOAuth1aString(
    requestOptions: OAuth.RequestOptions,
    oAuth: OAuth,
    accessTokenAndSecret?: TokenAndSecret,
  ): string;
}

export const IOAuthUtilsType = Symbol.for("IOAuthUtils");
