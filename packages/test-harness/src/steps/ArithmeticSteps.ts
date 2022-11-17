import tsflow from "cucumber-tsflow";
const { binding, given, then, when } = tsflow;

import { Environment } from "@test-harness/mocks/index.js";
import { AddAccount } from "@test-harness/prompts/index.js";

@binding()
export default class ArithmeticSteps {
  private computedResult = 0;
  @given(/A static step/)
  public givenAStaticStep(): void {
    console.log("Static Given");
    const temp = new AddAccount({} as Environment);
  }

  @when(/I enter '(\d*)' and '(\d*)'"/)
  public whenTwoNumbers(num1: string, num2: string): void {
    this.computedResult = parseInt(num1) + parseInt(num2);
  }

  @then(/I receive the result '(\d*)'/)
  public thenResultReceived(expectedResult: string): void {
    if (parseInt(expectedResult) !== this.computedResult) {
      throw new Error("Arithmetic Error");
    }
  }
}
