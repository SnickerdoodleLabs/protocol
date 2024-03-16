import "reflect-metadata";
import {
  EKnownDomains,
  ELanguageCode,
  ETask,
} from "@snickerdoodlelabs/objects";

import { KeywordUtils, URLUtils } from "@ai-scraper/implementations";
import {
  AMAZON_HOST_NAME,
  AMAZON_URL,
  GOOGLE_URL,
  INVALID_URL,
  MockKeywordRepository,
} from "@ai-scraper-test/mocks";

export class URLUtilsMocks {
  public keywordRepository = new MockKeywordRepository().factory();

  public factory(): URLUtils {
    return new URLUtils(new KeywordUtils(this.keywordRepository));
  }
}

describe("URLUtils", () => {
  test("test valid hostname", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = AMAZON_URL;

    // Act
    const result = await urlUtils.getHostname(url);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(AMAZON_HOST_NAME);
  });

  test("test invalid hostname", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = INVALID_URL;

    // Act
    const result = await urlUtils.getHostname(url);

    // Assert
    expect(result.isErr()).toBeTruthy();
    // console.log(result._unsafeUnwrapErr());
  });

  test("test amazon domain name", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = AMAZON_URL;

    // Act
    const result = await urlUtils.getDomain(url);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(EKnownDomains.Amazon);
  });

  test("amazon purchase task", async () => {
    // Arrange
    const mocks = new URLUtilsMocks();
    const urlUtils = mocks.factory();
    const keywordRepository = mocks.keywordRepository;
    const url = AMAZON_URL;

    // Act
    const result = await urlUtils.getTask(url, ELanguageCode.English);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(ETask.PurchaseHistory);
  });

  test("unknown task", async () => {
    // Arrange
    const mocks = new URLUtilsMocks();
    const urlUtils = mocks.factory();
    const keywordRepository = mocks.keywordRepository;
    const url = GOOGLE_URL;

    // Act
    const result = await urlUtils.getTask(url, ELanguageCode.English);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(ETask.Unknown);
  });
});
