import {
  ELanguageCode,
  HTMLString,
  PageNo,
  ScraperError,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";

export interface IScraperNavigationService {
  getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString;
  getYears(html: HTMLString): Year[];
  getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString;
  getPageCount(html: HTMLString, year: Year): number;
}
export const IScraperNavigationServiceType = Symbol.for(
  "IScraperNavigationService",
);
