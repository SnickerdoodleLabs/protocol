import { IPromptBuilder } from "@ai-scraper/interfaces/business/IPromptBuilder.js";

export interface IPromptDirector {
  makePurchaseHistoryPrompt(builder: IPromptBuilder);
}

export const IPromptDirectorType = Symbol.for("IPromptDirector");
