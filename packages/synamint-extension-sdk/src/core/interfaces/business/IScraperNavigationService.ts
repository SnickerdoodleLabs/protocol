import {
  ELanguageCode,
  HTMLString,
  PageNumber,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";

export interface IScraperNavigationService {
  getOrderHistoryPage(lang: ELanguageCode, page: PageNumber): URLString;
  getYears(html: HTMLString): Year[];
  getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNumber,
  ): URLString;
  getPageCount(html: HTMLString, year: Year): number;
}
export const IScraperNavigationServiceType = Symbol.for(
  "IScraperNavigationService",
);
