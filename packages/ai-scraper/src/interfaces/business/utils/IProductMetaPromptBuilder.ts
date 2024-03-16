import { IPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPromptBuilder.js";

export interface IProductMetaPromptBuilder extends IPromptBuilder {}
export const IProductMetaPromptBuilderType = Symbol.for(
  "IProductMetaPromptBuilder",
);
