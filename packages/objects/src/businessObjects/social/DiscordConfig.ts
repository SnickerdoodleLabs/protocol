import { OAuth2Config } from "@objects/businessObjects/social/OAuth2Config.js";
import { URLString } from "@objects/primitives";

export interface DiscordConfig extends OAuth2Config {
  dataAPIUrl: URLString;
  iconBaseUrl: URLString;
  pollInterval: number;
}
