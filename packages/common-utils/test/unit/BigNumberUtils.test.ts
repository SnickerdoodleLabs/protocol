import "reflect-metadata";
import { BigNumberString, HexString32 } from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";

import { BigNumberUtils } from "@common-utils/implementations/BigNumberUtils.js";

describe("BigNumberUtils class", () => {
  const bigNumberUtils = new BigNumberUtils();

  test("should multiply BigNumber or BigNumberString by a number", () => {
    const multiplier1 = 1000;
    const multiplier2 = 12345;
    const multiplier3 = 246523.32;
    const BNSValue1 = 1000000000000n;
    const BNSValue2 = BigNumberString("2893575734892374");

    const mulValue1 = bigNumberUtils.multiply(BNSValue1, multiplier1);
    const mulValue2 = bigNumberUtils.multiply(BNSValue2, multiplier1);
    const mulValue3 = bigNumberUtils.multiply(BNSValue1, multiplier2);
    const mulValue4 = bigNumberUtils.multiply(BNSValue2, multiplier2);
    const mulValue5 = bigNumberUtils.multiply(BNSValue1, multiplier3);
    const mulValue6 = bigNumberUtils.multiply(BNSValue2, multiplier3);

    expect(ethers.formatUnits(mulValue1)).toBe("0.001");
    expect(ethers.formatUnits(mulValue2)).toBe("2.893575734892374");
    expect(ethers.formatUnits(mulValue3)).toBe("0.012345");
    expect(ethers.formatUnits(mulValue4)).toBe("35.72119244724635703");
    expect(ethers.formatUnits(mulValue5)).toBe("0.24652332");
    expect(ethers.formatUnits(mulValue6)).toBe("713.333896837107881161");
  });

  test("should divide BigNumber or BigNumberString to a number", () => {
    const multiplier1 = 1000;
    const multiplier2 = 41;
    const multiplier3 = 3.32;
    const BNSValue1 = BigInt("1000000000000000");
    const BNSValue2 = BigNumberString("2893575734892374182321");

    const mulValue1 = bigNumberUtils.divide(BNSValue1, multiplier1);
    const mulValue2 = bigNumberUtils.divide(BNSValue2, multiplier1);
    const mulValue3 = bigNumberUtils.divide(BNSValue1, multiplier2);
    const mulValue4 = bigNumberUtils.divide(BNSValue2, multiplier2);
    const mulValue5 = bigNumberUtils.divide(BNSValue1, multiplier3);
    const mulValue6 = bigNumberUtils.divide(BNSValue2, multiplier3);

    expect(ethers.formatUnits(mulValue1)).toBe("0.000001");
    expect(ethers.formatUnits(mulValue2)).toBe("2.893575734892374182");
    expect(ethers.formatUnits(mulValue3)).toBe("0.000024390243902439");
    expect(ethers.formatUnits(mulValue4)).toBe("70.575017924204248349");
    expect(ethers.formatUnits(mulValue5)).toBe("0.000301204819277108");
    expect(ethers.formatUnits(mulValue6)).toBe("871.558956292883789855");
  });

  test("BigNumber from hex string", () => {
    const hexString1 = "0x7f49b9052e509c";
    const hexString2 = "0x1";
    const bigNum1 = BigInt(hexString1);
    const bigNum2 = BigInt(hexString2);

    expect(bigNum1.toString()).toBe("35828381046952092");
    expect(bigNum2.toString()).toBe("1");
  });

  test("BNStoHexString32 should convert BigNumberString to HexString32 with '0x' prefix", () => {
    const BNSValue = BigNumberString("10");
    const hexValue = bigNumberUtils.BNStoHexString32(BNSValue);

    expect(hexValue.startsWith("0x")).toBe(true);
    expect(hexValue).toBe("0x0a");
  });

  test("BNStoHexString32NoPrefix should convert BigNumberString to HexString32 without '0x' prefix", () => {
    const BNSValue = BigNumberString("10");
    const hexValue = bigNumberUtils.BNStoHexString32NoPrefix(BNSValue);

    expect(hexValue.startsWith("0x")).toBe(false);
    expect(hexValue).toBe("0a");
  });

  test("HexString32NoPrefixToBNS should convert HexString32 without '0x' prefix to BigNumberString", () => {
    const hexString = HexString32("0a");
    const BNSValue = bigNumberUtils.HexString32NoPrefixToBNS(hexString);

    expect(BNSValue).toBe("10");
  });
});
