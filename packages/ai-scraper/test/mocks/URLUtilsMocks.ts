import { URLString } from "@snickerdoodlelabs/objects";

import { URLUtils } from "@ai-scraper/implementations/index.js";

export class URLUtilsMocks {
  public getAmazonURL(): URLString {
    return URLString("https://www.amazon.com");
  }
  public getGoogleURL(): URLString {
    return URLString("https://www.google.com");
  }
  public getInvalidURL(): URLString {
    return URLString("invalidUrl");
  }

  public factory(): URLUtils {
    return new URLUtils();
  }
}
