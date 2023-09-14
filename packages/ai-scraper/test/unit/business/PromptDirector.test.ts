import "reflect-metadata";
import { LLMData, Prompt } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { PromptDirector } from "@ai-scraper/implementations";
import {
  ILLMPurchaseHistoryUtils,
  IPromptBuilderFactory,
  IPromptDirector,
} from "@ai-scraper/interfaces";
import { MockPromptBuilder } from "@ai-scraper-test/mocks/MockPromptBuilder";

/**
 * PromptDirector glues everything together. So, we test if it's able to glue the right things together.
 */

const promptPH = Prompt("This is a purchase history prompt");
class mocks {
  private purchaseHistoryLLMUtils = td.object<ILLMPurchaseHistoryUtils>();
  private promptBuilderFactory = td.object<IPromptBuilderFactory>();
  private phBuilder = new MockPromptBuilder(promptPH);
  public constructor() {
    // td.when(this.purchaseHistoryLLMUtils.getRole()).thenReturn(
    //   LLMRole("user PH"),
    // ); // Argument of type 'LLMRole' is not assignable to parameter of type 'never'.
    // td.when(this.purchaseHistoryLLMUtils.getQuestion()).thenReturn(
    //   LLMQuestion("question PH"),
    // );
    // td.when(this.purchaseHistoryLLMUtils.getAnswerStructure()).thenReturn(
    //   LLMAnswerStructure("answer PH"),
    // );
    td.when(this.promptBuilderFactory.purchaseHistory()).thenReturn(
      this.phBuilder,
    );
  }
  public factory(): IPromptDirector {
    return new PromptDirector(
      this.purchaseHistoryLLMUtils,
      this.promptBuilderFactory,
    );
  }
}

describe("PromptDirector", () => {
  test("makePurchaseHistoryPrompt", async () => {
    // Arrange
    const m = new mocks();
    const director = m.factory();

    // Act
    const promptRes = await director.makePurchaseHistoryPrompt(
      LLMData("anything"),
    );

    // Assert
    expect(promptRes.isOk()).toBe(true);
    const prompt = promptRes._unsafeUnwrap();
    expect(prompt).toEqual(promptPH);
  });
});
