import "reflect-metadata";
import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations";
import { Exemplar, LLMQuestion } from "@ai-scraper/interfaces";
import { Exemplars } from "@ai-scraper-test/mocks";

class PHPBuilderMocks {
  public factory(): PurchaseHistoryPromptBuilder {
    return new PurchaseHistoryPromptBuilder();
  }
}

describe("PurchaseHistoryPromptBuilder", () => {
  test("no exemplars in prompt", async () => {
    // Arrange
    const mocks = new PHPBuilderMocks();
    const builder = mocks.factory();
    const question = LLMQuestion("What is 10 + 20?");

    // Act
    builder.setExemplars(Exemplars);
    const result = await builder.getPrompt();
    const prompt = result._unsafeUnwrap();

    // Assert
    expect(result.isOk()).toBe(true);
    expect(prompt.includes(question)).toBe(true);
    expect(prompt.includes(Exemplars[0])).toBe(false);
  });

  test("must have question", async () => {});
  test("must have answer structure", async () => {});
  test("must have data", async () => {});
  test("role is optional", async () => {});
});
