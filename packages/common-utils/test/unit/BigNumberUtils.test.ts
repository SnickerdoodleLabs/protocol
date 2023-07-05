import "reflect-metadata";
import { BigNumberString } from "@snickerdoodlelabs/objects";
import { BigNumber, utils } from "ethers";

import { BigNumberUtils } from "@common-utils/implementations/BigNumberUtils";

describe("BigNumberUtils class", () => {
  const bigNumberUtils = new BigNumberUtils();

  test("should multiply BigNumber or BigNumberString by a number", () => {
    const multiplier1 = 1000;
    const multiplier2 = 12345;
    const multiplier3 = 246523.32;
    const BNSValue1 = BigNumber.from("1000000000000");
    const BNSValue2 = BigNumberString("2893575734892374");

    const mulValue1 = bigNumberUtils.multiply(BNSValue1, multiplier1);
    const mulValue2 = bigNumberUtils.multiply(BNSValue2, multiplier1);
    const mulValue3 = bigNumberUtils.multiply(BNSValue1, multiplier2);
    const mulValue4 = bigNumberUtils.multiply(BNSValue2, multiplier2);
    const mulValue5 = bigNumberUtils.multiply(BNSValue1, multiplier3);
    const mulValue6 = bigNumberUtils.multiply(BNSValue2, multiplier3);

    expect(utils.formatUnits(mulValue1)).toBe("0.001");
    expect(utils.formatUnits(mulValue2)).toBe("2.893575734892374");
    expect(utils.formatUnits(mulValue3)).toBe("0.012345");
    expect(utils.formatUnits(mulValue4)).toBe("35.72119244724635703");
    expect(utils.formatUnits(mulValue5)).toBe("0.24652332");
    expect(utils.formatUnits(mulValue6)).toBe("713.333896837107881161");
  });

  test("should divide BigNumber or BigNumberString to a number", () => {
    const multiplier1 = 1000;
    const multiplier2 = 41;
    const multiplier3 = 3.32;
    const BNSValue1 = BigNumber.from("1000000000000000");
    const BNSValue2 = BigNumberString("2893575734892374182321");

    const mulValue1 = bigNumberUtils.divide(BNSValue1, multiplier1);
    const mulValue2 = bigNumberUtils.divide(BNSValue2, multiplier1);
    const mulValue3 = bigNumberUtils.divide(BNSValue1, multiplier2);
    const mulValue4 = bigNumberUtils.divide(BNSValue2, multiplier2);
    const mulValue5 = bigNumberUtils.divide(BNSValue1, multiplier3);
    const mulValue6 = bigNumberUtils.divide(BNSValue2, multiplier3);

    expect(utils.formatUnits(mulValue1)).toBe("0.000001");
    expect(utils.formatUnits(mulValue2)).toBe("2.893575734892374182");
    expect(utils.formatUnits(mulValue3)).toBe("0.000024390243902439");
    expect(utils.formatUnits(mulValue4)).toBe("70.575017924204248349");
    expect(utils.formatUnits(mulValue5)).toBe("0.000301204819277108");
    expect(utils.formatUnits(mulValue6)).toBe("871.558956292883789855");
  });
});
