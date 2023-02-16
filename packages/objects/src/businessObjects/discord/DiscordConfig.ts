import { okAsync, ResultAsync } from "neverthrow";

import { DiscordError } from "@objects/errors";
import { URLString } from "@objects/primitives/URLString";

export interface DiscordConfig {
  clientId: string;
  oauthBaseUrl: URLString;
  oauthRedirectUrl: URLString;
  dataAPIUrl: URLString;
}
