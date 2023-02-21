import { OAuthConfig } from "@objects/businessObjects/OAuthConfig";
import { URLString } from "@objects/primitives/URLString";

export interface DiscordConfig extends OAuthConfig {
  dataAPIUrl: URLString;
}
