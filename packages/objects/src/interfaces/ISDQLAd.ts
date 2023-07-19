import { AdContent } from "@objects/businessObjects/AdContent.js";
import {
  UnixTimestamp,
  EAdDisplayType,
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
