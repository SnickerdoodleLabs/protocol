import { WebpageClassifier } from "@ai-scraper/implementations/index.js";
import { URLUtilsMocks } from "@ai-scraper-test/mocks/URLUtilsMocks.js";

export class WebpageClassifierMocks {
  public urlUtilsMocks = new URLUtilsMocks();

  public factory(): WebpageClassifier {
    return new WebpageClassifier(this.urlUtilsMocks.factory());
  }
}
