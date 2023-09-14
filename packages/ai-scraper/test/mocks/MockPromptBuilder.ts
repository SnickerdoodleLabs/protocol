import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMError,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, okAsync } from "neverthrow";

import { IPromptBuilder } from "@ai-scraper/interfaces";

export class MockPromptBuilder implements IPromptBuilder {
  private promptToReturn: Prompt;
  public constructor(promptToReturn: Prompt) {
    this.promptToReturn = promptToReturn;
  }
  setExemplars(exemplars: Exemplar[]): void {}
  setRole(role: LLMRole): void {}
  setQuestion(question: LLMQuestion): void {}
  setAnswerStructure(structure: LLMAnswerStructure): void {}
  setData(data: LLMData): void {}
  getPrompt(): ResultAsync<Prompt, LLMError> {
    return okAsync(this.promptToReturn);
  }
}
