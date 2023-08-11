import "reflect-metadata";
import { Language } from "@snickerdoodlelabs/objects";

import { KnownDomains, Task } from "@ai-scraper/interfaces";
import { URLUtilsMocks } from "@ai-scraper-test/mocks/URLUtilsMocks";

describe("URLUtils", () => {
  test("test valid hostname", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getAmazonURL();

    // Act
    const result = await urlUtils.getHostname(url);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe("www.amazon.com");
  });

  test("test invalid hostname", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getInvalidURL();

    // Act
    const result = await urlUtils.getHostname(url);

    // Assert
    expect(result.isErr()).toBeTruthy();
    // console.log(result._unsafeUnwrapErr());
  });

  test("test amazon domain name", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getAmazonURL();

    // Act
    const result = await urlUtils.getDomain(url);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(KnownDomains.Amazon);
  });

  test("amazon purchase task", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getAmazonURL();

    // Act
    const result = await urlUtils.getTask(url, Language.English);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(Task.PurchaseHistory);
  });

  test("unknown task", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getGoogleURL();

    // Act
    const result = await urlUtils.getTask(url, Language.English);
    const expected = result._unsafeUnwrap();

    // Assert
    expect(expected).toBe(Task.Unknown);
  });
});
