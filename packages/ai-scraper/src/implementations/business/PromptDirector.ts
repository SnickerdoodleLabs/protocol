import {
  Exemplar,
  LLMAnswerStructure,
  LLMData,
  LLMError,
  LLMQuestion,
  LLMRole,
  Prompt,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IPromptDirector,
  ILLMPurchaseHistoryUtilsType,
  ILLMPurchaseHistoryUtils,
  IPromptBuilderFactoryType,
  IPromptBuilderFactory,
  IPromptBuilder,
  ILLMProductMetaUtilsType,
  ILLMProductMetaUtils,
} from "@ai-scraper/interfaces/index.js";

@injectable()
export class PromptDirector implements IPromptDirector {
  constructor(
    @inject(IPromptBuilderFactoryType)
    private promptBuilderFactory: IPromptBuilderFactory,
    @inject(ILLMPurchaseHistoryUtilsType)
    private purchaseHistoryLLMUtils: ILLMPurchaseHistoryUtils,
    @inject(ILLMProductMetaUtilsType)
    private productMetaUtils: ILLMProductMetaUtils,
  ) {}

  /**
   * @description this method does not need to be result async as it does not depend on any external resources and O(1)
   */
  public makePurchaseHistoryPrompt(
    data: LLMData,
  ): ResultAsync<Prompt, LLMError> {
    // Acquire
    const builder = this.promptBuilderFactory.purchaseHistory();
    const role = this.purchaseHistoryLLMUtils.getRole();
    const question = this.purchaseHistoryLLMUtils.getQuestion();
    const answerStructure = this.purchaseHistoryLLMUtils.getAnswerStructure();

    // Attend
    return this.make(builder, [], role, question, answerStructure, data);
  }

  public makeProductMetaPrompt(data: LLMData): ResultAsync<Prompt, LLMError> {
    // Acquire
    const builder = this.promptBuilderFactory.productMeta();
    const role = this.productMetaUtils.getRole();
    const question = this.productMetaUtils.getQuestion();
    const answerStructure = this.productMetaUtils.getAnswerStructure();

    // Attend
    return this.make(builder, [], role, question, answerStructure, data);
  }

  private make(
    builder: IPromptBuilder,
    exemplars: Exemplar[],
    role: LLMRole,
    question: LLMQuestion,
    answerStructure: LLMAnswerStructure,
    data: LLMData,
  ): ResultAsync<Prompt, LLMError> {
    // Assemble
    builder.setExemplars(exemplars);
    builder.setRole(role);
    builder.setQuestion(question);
    builder.setAnswerStructure(answerStructure);
    builder.setData(data);

    // Attend
    return builder.getPrompt();
  }
}
