import {
  ELanguageCode,
  PageNo,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";

export interface IAmazonNavigationUtils {
  getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString;
  getYears(): Year[];
  getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString;
  getPageCount(year: Year): number;
}
export const IAmazonNavigationUtilsType = Symbol.for("IAmazonNavigationUtils");
