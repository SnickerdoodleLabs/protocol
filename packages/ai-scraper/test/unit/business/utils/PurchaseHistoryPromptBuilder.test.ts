import "reflect-metadata";
import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations";
import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMQuestion,
} from "@ai-scraper/interfaces";
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
    const answerStructure = LLMAnswerStructure("json");
    const data = LLMData("na");

    // Act
    builder.setExemplars(Exemplars);
    builder.setQuestion(question);
    builder.setAnswerStructure(answerStructure);
    builder.setData(data);
    const result = await builder.getPrompt();

    // Assert
    expect(result.isOk()).toBe(true);
    const prompt = result._unsafeUnwrap();
    expect(prompt.includes(question)).toBe(true);
    expect(prompt.includes(Exemplars[0])).toBe(false);
  });

  test("must have question", async () => {});
  test("must have answer structure", async () => {});
  test("must have data", async () => {});
  test("role is optional", async () => {});
});
