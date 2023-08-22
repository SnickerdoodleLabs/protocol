import { LLMError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { PromptBuilder } from "@ai-scraper/implementations/business/utils/PromptBuilder.js";
import {
  Exemplar,
  IPurchaseHistoryPromptBuilder,
  LLMAnswerStructure,
  LLMData,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

/**
 * @description this class is responsible for building prompts for purchase history
 */
@injectable()
export class PurchaseHistoryPromptBuilder
  extends PromptBuilder
  implements IPurchaseHistoryPromptBuilder
{
  /**
   *
   * @description ignore exemplars for purchase history as this breaks the token limit easily
   */
  public setExemplars(exemplars: Exemplar[]): void {}
}
