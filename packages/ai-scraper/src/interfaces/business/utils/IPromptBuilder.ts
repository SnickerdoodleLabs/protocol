import { LLMError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@ai-scraper/interfaces/primitives/index.js";

export interface IPromptBuilder {
  setExemplars(exemplars: Exemplar[]): void;
  setRole(role: LLMRole): void;
  setQuestion(question: LLMQuestion): void;
  setAnswerStructure(structure: LLMAnswerStructure): void;
  setData(data: LLMData): void;
  getPrompt(): ResultAsync<Prompt, LLMError>;
}

export const IPromptBuilderType = Symbol.for("IPromptBuilder");
