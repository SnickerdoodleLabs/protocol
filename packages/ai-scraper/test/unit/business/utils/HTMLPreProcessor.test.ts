import { HTMLPreProcessor } from "@ai-scraper/implementations/business/HTMLPreProcessor";
import { IHTMLPreProcessor } from "@ai-scraper/interfaces";
import { html1, text1 } from "@ai-scraper-test/mocks/testHTMLPreprocessorData";

class mocks {
  public factory(): IHTMLPreProcessor {
    return new HTMLPreProcessor();
  }
}
describe("HTMLPreProcessor", () => {
  test("htmlToText hello world", async () => {
    // Arrange
    const processor = new mocks().factory();
    // Act
    const result = await processor.htmlToText(html1, null);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(text1);
  });

  test("htmlToText full text without images", async () => {
    // Arrange
    const processor = new mocks().factory();
    // Act
    const result = await processor.htmlToText(html1, null);
    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(text1);
  });
});
