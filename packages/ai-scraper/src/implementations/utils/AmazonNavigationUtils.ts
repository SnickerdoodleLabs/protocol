import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ELanguageCode,
  PageNo,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { IAmazonNavigationUtils } from "@ai-scraper/interfaces/utils/IAmazonNavigationUtils";

@injectable()
export class AmazonNavigationUtils implements IAmazonNavigationUtils {
  constructor(
    @inject(ITimeUtilsType)
    protected readonly timeUtils: ITimeUtils,
  ) {}
  public getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString {
    return URLString("https://www.amazon.com/your-orders/orders?startIndex=0");
  }

  public getYears(): Year[] {
    const curYear = this.timeUtils.getCurYear();
    const years = [curYear];
    for (let i = 1; i < 5; i++) {
      years.push(Year(curYear - i));
    }
    return years;
  }
  public getPageCount(year: Year): number {
    return 5; // TODO
  }

  public getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString {
    const startIndex = (page - 1) * 10;
    return URLString(
      `https://www.amazon.com/gp/your-account/order-history?orderFilter=year-${year}&startIndex=${startIndex}`,
    );
  }
}
