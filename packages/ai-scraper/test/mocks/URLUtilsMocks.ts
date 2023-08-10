import { URLString } from "@snickerdoodlelabs/objects";

import { URLUtils } from "@ai-scraper/implementations/utils/URLUtils";
export class URLUtilsMocks {
  public getAmazonURL(): URLString {
    return URLString("https://www.amazon.com");
  }

  public factory(): URLUtils {
    return new URLUtils();
  }
}
