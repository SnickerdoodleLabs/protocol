import { LLMError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  LLMResponse,
  Prompt,
} from "@ai-scraper/interfaces/primitives/index.js";

export interface ILLMProvider {
  maxTokens(model: string): number;
  executePrompt(prompt: Prompt): ResultAsync<LLMResponse, LLMError>;
}

export const ILLMProviderType = Symbol.for("ILLMProvider");
