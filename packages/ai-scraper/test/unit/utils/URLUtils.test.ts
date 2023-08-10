import { URLUtilsMocks } from "@ai-scraper-test/mocks/URLUtilsMocks";
import "reflect-metadata";

describe("URLUtils", () => {
  test("test valid hostname", async () => {
    // Arrange
    const urlUtils = new URLUtilsMocks().factory();
    const url = new URLUtilsMocks().getAmazonURL();

    // Act
    const result = await urlUtils.getHostname(url);

    // Assert
    expect(result).toBe("www.amazon.com");
  });
});
