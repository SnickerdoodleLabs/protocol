import { LLMError, LLMResponse, Prompt } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ILLMRepository {
  defaultMaxTokens(): number;
  maxTokens(model: string): number;
  getPromptTokens(prompt: Prompt): ResultAsync<number, Error>;
  executePrompt(prompt: Prompt): ResultAsync<LLMResponse, LLMError>;
}

export const ILLMRepositoryType = Symbol.for("ILLMRepository");
