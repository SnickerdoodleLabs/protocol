import { SiteVisitsData } from "@objects/businessObjects/SiteVisitsData.js";
import { URLString, DomainName } from "@objects/primitives/index.js";
export type SiteVisitsMap = Map<URLString | DomainName, SiteVisitsData>;
