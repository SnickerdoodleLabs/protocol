import "reflect-metadata";
import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMError,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@snickerdoodlelabs/objects";
import { Result, ResultAsync } from "neverthrow";

import { PurchaseHistoryPromptBuilder } from "@ai-scraper/implementations";
import { ProductMetaPromptBuilder } from "@ai-scraper/implementations/business/utils/ProductMetaPromptBuilder";
import { Exemplars } from "@ai-scraper-test/mocks";

class Mocks {
  public factory(): ProductMetaPromptBuilder {
    return new ProductMetaPromptBuilder();
  }
}

function getTestPrompt(
  exemplars: Exemplar[] | null,
  question: LLMQuestion | null,
  answerStructure: LLMAnswerStructure | null,
  data: LLMData | null,
  role: LLMRole | null,
): ResultAsync<Prompt, LLMError> {
  // Arrange
  const mocks = new Mocks();
  const builder = mocks.factory();

  // Act
  if (exemplars != null) builder.setExemplars(Exemplars);

  if (question != null) builder.setQuestion(question);
  if (answerStructure != null) builder.setAnswerStructure(answerStructure);
  if (data != null) builder.setData(data);
  if (role != null) builder.setRole(role);
  return builder.getPrompt();
}

describe("ProductMetaPromptBuilder", () => {
  test("no exemplars in prompt", async () => {
    // Arrange
    const question = LLMQuestion("What is 10 + 20?");
    const answerStructure = LLMAnswerStructure("json");
    const data = LLMData("na");
    const role = LLMRole("assistant");

    // Act
    const result = await getTestPrompt(
      Exemplars,
      question,
      answerStructure,
      data,
      role,
    );

    // Assert
    expect(result.isOk()).toBe(true);
    const prompt = result._unsafeUnwrap();
    expect(prompt.includes(question)).toBe(true);
    expect(prompt.includes(Exemplars[0])).toBe(false);
  });

  test("must have question", async () => {
    // Arrange
    const question = null;
    const answerStructure = LLMAnswerStructure("json");
    const data = LLMData("na");
    const role = LLMRole("assistant");

    // Act
    const result = await getTestPrompt(
      Exemplars,
      question,
      answerStructure,
      data,
      role,
    );

    // Assert
    expect(result.isErr()).toBe(true);
    const error = result._unsafeUnwrapErr();
    expect(error.message).toContain("question");
  });

  test("must have answer structure", async () => {
    // Arrange
    const question = LLMQuestion("What is 10 + 20?");
    const answerStructure = null;
    const data = LLMData("na");
    const role = LLMRole("assistant");

    // Act
    const result = await getTestPrompt(
      Exemplars,
      question,
      answerStructure,
      data,
      role,
    );

    // Assert
    expect(result.isErr()).toBe(true);
    const error = result._unsafeUnwrapErr();
    expect(error.message).toContain("answerStructure");
  });

  test("must have data", async () => {
    // Arrange
    const question = LLMQuestion("What is 10 + 20?");
    const answerStructure = LLMAnswerStructure("json");
    const data = null;
    const role = LLMRole("assistant");

    // Act
    const result = await getTestPrompt(
      Exemplars,
      question,
      answerStructure,
      data,
      role,
    );

    // Assert
    expect(result.isErr()).toBe(true);
    const error = result._unsafeUnwrapErr();
    expect(error.message).toContain("data");
  });

  test("role is optional", async () => {
    // Arrange
    const question = LLMQuestion("What is 10 + 20?");
    const answerStructure = LLMAnswerStructure("json");
    const data = LLMData("na");
    const role = null;

    // Act
    const result = await getTestPrompt(
      Exemplars,
      question,
      answerStructure,
      data,
      role,
    );

    // Assert
    expect(result.isOk()).toBe(true);
  });
});
