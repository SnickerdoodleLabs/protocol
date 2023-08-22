import { LLMError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { LLMData, Prompt } from "@ai-scraper/interfaces/primitives/index.js";

export interface IPromptDirector {
  makePurchaseHistoryPrompt(data: LLMData): ResultAsync<Prompt, LLMError>;
}

export const IPromptDirectorType = Symbol.for("IPromptDirector");
