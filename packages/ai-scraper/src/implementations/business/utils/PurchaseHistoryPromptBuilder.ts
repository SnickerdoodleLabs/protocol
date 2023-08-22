import { LLMError } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { PromptBuilder } from "@ai-scraper/implementations/business/utils/PromptBuilder.js";
import { IPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPromptBuilder.js";
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
export class PurchaseHistoryPromptBuilder
  extends PromptBuilder
  implements IPurchaseHistoryPromptBuilder
{
  /**
   *
   * @description ignore exemplars for purchase history as this breaks the token limit easily
   */
  public setExemplars(exemplars: Exemplar[]): void {}
  public getPrompt(): ResultAsync<Prompt, LLMError> {
    const error = this.validateBeforeBuild();
    if (error != null) {
      return errAsync(error);
    }

    let orderedInstructions: (string | null)[] = [];
    // 1. role
    if (this.role != null) {
      orderedInstructions = [this.role, ...orderedInstructions];
    }

    // 2. no exemplars

    // 3. question
    // 4. answer structure
    // 5. data
    orderedInstructions = [
      ...orderedInstructions,
      this.question,
      this.answerStructure,
      "\n\n",
      this.data,
    ];

    return okAsync(Prompt(orderedInstructions.join(" ")));
  }

  private validateBeforeBuild(): LLMError | null {
    if (this.question == null) {
      return new LLMError(
        "Missing question for purchase history prompts",
        this,
      );
    } else if (this.answerStructure == null) {
      return new LLMError(
        "Missing answerStructure for purchase history prompts",
        this,
      );
    } else if (this.data == null) {
      return new LLMError("Missing data for purchase history prompts", this);
    }

    return null;
  }
}
