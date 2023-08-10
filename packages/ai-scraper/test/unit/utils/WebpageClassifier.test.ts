import "reflect-metadata";
import { KnownDomains, Task } from "@ai-scraper/interfaces";
import { WebpageClassifierMocks } from "@ai-scraper-test/mocks/WebpageClassifierMocks";

describe("WebpageClassifier", () => {
  test("Amazon domain task", async () => {
    // Arrange
    const mocks = new WebpageClassifierMocks();
    const classifier = mocks.factory();
    const url = mocks.urlUtilsMocks.getAmazonURL();

    // Act
    const result = await classifier.classify(url);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected.domain).toBe(KnownDomains.Amazon);
    expect(expected.task).toBe(Task.PurchaseHistory);
  });
});
