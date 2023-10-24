import "reflect-metadata";
import { ELanguageCode } from "@snickerdoodlelabs/objects";

import {
  KeywordUtils,
  URLUtils,
  WebpageClassifier,
} from "@ai-scraper/implementations/index.js";
import { EKnownDomains, ETask } from "@ai-scraper/interfaces";
import { AMAZON_URL } from "@ai-scraper-test/mocks";
import { MockKeywordRepository } from "@ai-scraper-test/mocks/MockKeywordRepository.js";

export class WebpageClassifierMocks {
  public keywordRepository = new MockKeywordRepository().factory();
  public factory(): WebpageClassifier {
    return new WebpageClassifier(
      new URLUtils(new KeywordUtils(this.keywordRepository)),
      this.keywordRepository,
    );
  }
}

describe("WebpageClassifier", () => {
  test("Amazon domain task", async () => {
    // Arrange
    const mocks = new WebpageClassifierMocks();
    const classifier = mocks.factory();
    const url = AMAZON_URL;

    // Act
    const result = await classifier.classify(url, ELanguageCode.English);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected.domain).toBe(EKnownDomains.Amazon);
    expect(expected.taskType).toBe(ETask.PurchaseHistory);
  });
});
