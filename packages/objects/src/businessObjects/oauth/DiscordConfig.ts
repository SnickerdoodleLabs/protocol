import { OAuth2Config } from "@objects/businessObjects/oauth/OAuth2Config.js";
import { URLString } from "@objects/primitives/index.js";

export interface DiscordConfig extends OAuth2Config {
  dataAPIUrl: URLString;
  iconBaseUrl: URLString;
  pollInterval: number;
}
