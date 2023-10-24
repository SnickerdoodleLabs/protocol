import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  ELanguageCode,
  HTMLString,
  PageNo,
  URLString,
  Year,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import {
  IAmazonNavigationUtils,
  IHTMLPreProcessor,
  IHTMLPreProcessorType,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class AmazonNavigationUtils implements IAmazonNavigationUtils {
  constructor(
    @inject(ITimeUtilsType)
    protected readonly timeUtils: ITimeUtils,
    @inject(IHTMLPreProcessorType)
    protected readonly htmlPreProcessor: IHTMLPreProcessor,
  ) {}
  public getOrderHistoryPage(lang: ELanguageCode, page: PageNo): URLString {
    return URLString("https://www.amazon.com/your-orders/orders?startIndex=0");
  }

  public getYears(html: HTMLString): Year[] {
    const curYear = this.timeUtils.getCurYear();
    const years = [curYear];
    for (let i = 1; i < 5; i++) {
      years.push(Year(curYear - i));
    }
    return years;
  }
  public getPageCount(html: HTMLString, year: Year): number {
    return 5; // TODO
    const amazonPagination = {
      baseElements: { selectors: [".a-pagination"] },
    };
    // return number of elements in this format: [.*]
  }

  public getOrderHistoryPageByYear(
    lang: ELanguageCode,
    year: Year,
    page: PageNo,
  ): URLString {
    // TODO: this URL structure may break very easily. We should find a better way to do this.
    const startIndex = (page - 1) * 10;
    return URLString(
      `https://www.amazon.com/gp/your-account/order-history?orderFilter=year-${year}&startIndex=${startIndex}`,
    );
  }

  public getPurchaseHistoryPagePreprocessingOptions(): unknown {
    const options = {
      baseElements: { selectors: [".your-orders-content-container"] },
      selectors: [
        { selector: "a", options: { ignoreHref: true } },
        { selector: "img", format: "skip" },
      ],
    };
    return options;
  }
}
