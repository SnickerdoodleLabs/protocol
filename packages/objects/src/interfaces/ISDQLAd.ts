import { AdContent } from "@objects/businessObjects/index.js";
import { EAdDisplayType } from "@objects/enum/index.js";
import {
  UnixTimestamp,
  ISDQLConditionString,
} from "@objects/primitives/index.js";

export interface ISDQLAd {
  name: string;
  content: AdContent;
  text: string | null;
  displayType: EAdDisplayType;
  weight: number;
  expiry: UnixTimestamp;
  keywords: string[];
  target?: ISDQLConditionString;
}
