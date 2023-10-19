import { LLMData, LLMError, Prompt } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IPromptDirector {
  makePurchaseHistoryPrompt(data: LLMData): ResultAsync<Prompt, LLMError>;
  makeProductMetaPrompt(data: LLMData): ResultAsync<Prompt, LLMError>;
}

export const IPromptDirectorType = Symbol.for("IPromptDirector");
