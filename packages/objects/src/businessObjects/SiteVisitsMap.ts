import {
  URLString,
  DomainName,
} from "@objects/primitives/index.js";
import { SiteVisitsData } from "@objects/businessObjects/SiteVisitsData.js";
export type SiteVisitsMap = Map<URLString | DomainName, SiteVisitsData>;

