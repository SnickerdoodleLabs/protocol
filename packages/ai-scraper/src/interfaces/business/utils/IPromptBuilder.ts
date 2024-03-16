import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMError,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPromptBuilder {
  setExemplars(exemplars: Exemplar[]): void;
  setRole(role: LLMRole): void;
  setQuestion(question: LLMQuestion): void;
  setAnswerStructure(structure: LLMAnswerStructure): void;
  setData(data: LLMData): void;
  getPrompt(): ResultAsync<Prompt, LLMError>;
}

export const IPromptBuilderType = Symbol.for("IPromptBuilder");
