import { OAuthConfig } from "@objects/businessObjects";
import { URLString } from "@objects/primitives";

export interface DiscordConfig extends OAuthConfig {
  dataAPIUrl: URLString;
  iconBaseUrl: URLString;
  pollInterval: number;
}
