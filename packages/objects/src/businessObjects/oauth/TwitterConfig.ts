import { OAuth1Config } from "@objects/businessObjects/oauth/OAuth1Config.js";
import { URLString } from "@objects/primitives";

export interface TwitterConfig extends OAuth1Config {
  dataAPIUrl: URLString;
  pollInterval: number;
}
