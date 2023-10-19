import "reflect-metadata";
import { LLMData, Prompt } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { PromptDirector } from "@ai-scraper/implementations";
import {
  ILLMProductMetaUtils,
  ILLMPurchaseHistoryUtils,
  IPromptBuilderFactory,
  IPromptDirector,
} from "@ai-scraper/interfaces";
import { MockPromptBuilder } from "@ai-scraper-test/mocks/MockPromptBuilder";

/**
 * PromptDirector glues everything together. So, we test if it's able to glue the right things together.
 */

const promptPH = Prompt("This is a purchase history prompt");
const promptProductMeta = Prompt("This is a product meta prompt");
class mocks {
  private purchaseHistoryLLMUtils = td.object<ILLMPurchaseHistoryUtils>();
  private productMetaUtils = td.object<ILLMProductMetaUtils>();
  private promptBuilderFactory = td.object<IPromptBuilderFactory>();
  private phBuilder = new MockPromptBuilder(promptPH);
  private productMetaBuilder = new MockPromptBuilder(promptProductMeta);
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
    td.when(this.promptBuilderFactory.productMeta()).thenReturn(
      this.productMetaBuilder,
    );
  }
  public factory(): IPromptDirector {
    return new PromptDirector(
      this.promptBuilderFactory,
      this.purchaseHistoryLLMUtils,
      this.productMetaUtils,
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
