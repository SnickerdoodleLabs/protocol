import { Exemplar, LLMError, Prompt } from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { PromptBuilder } from "@ai-scraper/implementations/business/utils/PromptBuilder.js";
import { IProductMetaPromptBuilder } from "@ai-scraper/interfaces/index.js";

/**
 * @description this class is responsible for building prompts for purchase history
 */
export class ProductMetaPromptBuilder
  extends PromptBuilder
  implements IProductMetaPromptBuilder
{
  /**
   *
   * @description ignore exemplars for purchase history as this breaks the token limit easily
   */
  public setExemplars(exemplars: Exemplar[]): void {}
  public getPrompt(): ResultAsync<Prompt, LLMError> {
    return this.assureValid().map(() => {
      let orderedInstructions: (string | null)[] = [];
      // 1. role
      if (this.role != null) {
        orderedInstructions = [this.role, ...orderedInstructions];
      }

      orderedInstructions = [
        ...orderedInstructions,
        this.answerStructure,
        this.question,
        "\n\n",
        this.data,
      ];

      return Prompt(orderedInstructions.join(" "));
    });
  }

  private assureValid(): ResultAsync<void, LLMError> {
    if (this.question == null) {
      return errAsync(
        new LLMError("Missing question for purchase history prompts", this),
      );
    } else if (this.answerStructure == null) {
      return errAsync(
        new LLMError(
          "Missing answerStructure for purchase history prompts",
          this,
        ),
      );
    } else if (this.data == null) {
      return errAsync(
        new LLMError("Missing data for purchase history prompts", this),
      );
    }

    return okAsync(undefined);
  }
}
