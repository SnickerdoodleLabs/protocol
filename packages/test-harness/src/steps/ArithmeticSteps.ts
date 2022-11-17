// import { binding, given, then } from "cucumber-tsflow";

import tsflow from "cucumber-tsflow";
const { binding, given, then, when } = tsflow;

@binding()
export default class ArithmeticSteps {
    private computedResult: number = 0;



    @given(/I enter '(\d*)' and '(\d*)'"/)
    public givenTwoNumbers(num1: string, num2: string): void {
        this.computedResult = parseInt(num1) + parseInt(num2);
    }

    @then(/I receive the result '(\d*)'/)
    public thenResultReceived(expectedResult: string): void {
        if (parseInt(expectedResult) !== this.computedResult) {
            throw new Error("Arithmetic Error");
        }
    }
}
