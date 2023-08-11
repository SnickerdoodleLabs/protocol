import { URLString } from "@snickerdoodlelabs/objects";

import { KeywordUtils, URLUtils } from "@ai-scraper/implementations/index.js";

export class URLUtilsMocks {
  public getAmazonURL(): URLString {
    return URLString(
      "https://www.amazon.com/gp/css/order-history?ref_=nav_orders_first",
    );
  }
  public getGoogleURL(): URLString {
    return URLString("https://www.google.com");
  }
  public getInvalidURL(): URLString {
    return URLString("invalidUrl");
  }

  public factory(): URLUtils {
    return new URLUtils(new KeywordUtils());
  }
}
