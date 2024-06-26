// This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query
import { ISDQLAdsBlock } from "@objects/interfaces/ISDQLAdsBlock.js";
import { ISDQLCompensationBlock } from "@objects/interfaces/ISDQLCompensationBlock.js";
import { ISDQLInsightsBlock } from "@objects/interfaces/ISDQLInsightsBlock.js";
import { ISDQLQueriesBlock } from "@objects/interfaces/ISDQLQueriesBlock.js";
import { ISDQLQuestionBlock } from "@objects/interfaces/ISDQLQuestionBlock.js";
import {
  URLString,
  ISO8601DateString,
  IpfsCID,
} from "@objects/primitives/index.js";

export interface ISDQLQueryObject {
  name: string;
  version: string;
  insightPlatform: URLString;
  timestamp: ISO8601DateString;
  expiry: ISO8601DateString;
  description: string;
  image?: IpfsCID;
  points?: string;
  business: string;
  ads: ISDQLAdsBlock;
  queries: ISDQLQueriesBlock;
  insights: ISDQLInsightsBlock;
  compensations: ISDQLCompensationBlock;
  questions: ISDQLQuestionBlock[];
}
