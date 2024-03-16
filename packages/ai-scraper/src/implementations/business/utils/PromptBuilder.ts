import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMError,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@snickerdoodlelabs/objects";
import { ResultAsync, errAsync, okAsync } from "neverthrow";

import { IPromptBuilder } from "@ai-scraper/interfaces/business/utils/IPromptBuilder.js";

/**
 * @description All the prompt builders should extend this class as
 * it provides a generic implementation of the IPromptBuilder interface and should work in most of the cases
 */
export abstract class PromptBuilder implements IPromptBuilder {
  protected exemplars: Exemplar[] | null = null;
  protected role: LLMRole | null = null;
  protected question: LLMQuestion | null = null;
  protected answerStructure: LLMAnswerStructure | null = null;
  protected data: LLMData | null = null;

  public setExemplars(exemplars: Exemplar[]): void {
    this.exemplars = exemplars;
  }
  public setRole(role: LLMRole): void {
    this.role = role;
  }
  public setQuestion(question: LLMQuestion): void {
    this.question = question;
  }
  public setAnswerStructure(answerStructure: LLMAnswerStructure): void {
    this.answerStructure = answerStructure;
  }
  public setData(data: LLMData): void {
    this.data = data;
  }
  public getPrompt(): ResultAsync<Prompt, LLMError> {
    if (this.question == null) {
      return errAsync(new LLMError("Missing question for prompts", this));
    }

    let orderedInstructions: (string | null)[] = [];
    // 1. role
    if (this.role != null) {
      orderedInstructions = [this.role, ...orderedInstructions];
    }

    // 2. exemplars
    if (this.exemplars != null) {
      orderedInstructions = [...this.exemplars, "\n\n"];
    }

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
}
