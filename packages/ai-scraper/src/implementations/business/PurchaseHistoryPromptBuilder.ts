import { LLMError } from "@snickerdoodlelabs/objects";
import { Result, err, ok } from "neverthrow";

import {
  Exemplar,
  IPromptBuilder,
  LLMAnswerStructure,
  LLMData,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@ai-scraper/interfaces/index.js";

export class PurchaseHistoryPromptBuilder implements IPromptBuilder {
  private exemplars: Exemplar[] | null = null;
  private role: LLMRole | null = null;
  private question: LLMQuestion | null = null;
  private answerStructure: LLMAnswerStructure | null = null;
  private data: LLMData | null = null;

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
  public getPrompt(): Result<Prompt, LLMError> {
    if (this.question == null) {
      return err(new LLMError("Missing question for prompts", this));
    }

    let orderedInstructions: (string | null)[] = [];
    // 1. role
    if (this.role != null) {
      orderedInstructions = [`You are a ${this.role}`, ...orderedInstructions];
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

    return ok(Prompt(orderedInstructions.join(" ")));
  }
}
