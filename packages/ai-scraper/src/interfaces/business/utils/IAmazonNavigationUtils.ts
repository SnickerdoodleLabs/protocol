import {
  ELanguageCode,
  HTMLString,
  PageNo,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";

export interface IAmazonNavigationUtils {
  getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString;
  getYears(html: HTMLString): Year[];
  getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString;
  getPageCount(html: HTMLString, year: Year): number;
  getPurchaseHistoryPagePreprocessingOptions(): unknown;
}
export const IAmazonNavigationUtilsType = Symbol.for("IAmazonNavigationUtils");
