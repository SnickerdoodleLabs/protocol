import { OAuth1Config } from "@objects/businessObjects/oauth/OAuth1Config.js";
import { URLString } from "@objects/primitives/index.js";

export interface TwitterConfig extends OAuth1Config {
  dataAPIUrl: URLString;
  pollInterval: number;
}
