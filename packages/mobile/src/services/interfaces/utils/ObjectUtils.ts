import { JSONString } from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";

export class ObjectUtils {
  static serialize(obj: unknown): JSONString {
    return JSONString(
      JSON.stringify(obj, (key, value) => {
        if (value instanceof Map) {
          return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
          };
        } else if (value instanceof Set) {
          return {
            dataType: "Set",
            value: [...value],
          };
        } else if (value instanceof BigInt) {
          return {
            dataType: "BigInt",
            value: BigNumber.from(value).toString(),
          };
        } else if (typeof value == "bigint") {
          return {
            dataType: "bigint",
            value: BigNumber.from(value).toString(),
          };
        } else if (
          typeof value == "object" &&
          value != null &&
          value.hasOwnProperty != null &&
          value.hasOwnProperty("type") &&
          value.hasOwnProperty("hex") &&
          value.type == "BigNumber" &&
          value.hex != null
        ) {
          return {
            dataType: "BigNumber",
            value: value.hex,
          };
        } else {
          return value;
        }
      }),
    );
  }

  static deserialize<T = Record<string, unknown>>(json: JSONString): T {
    return JSON.parse(json, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
          return new Map(value.value);
        } else if (value.dataType === "Set") {
          return new Set(value.value);
        } else if (value.dataType === "BigInt") {
          return BigNumber.from(value.value).toBigInt();
        } else if (value.dataType === "bigint") {
          return BigNumber.from(value.value).toBigInt();
        } else if (value.dataType === "BigNumber") {
          return BigNumber.from(value.value);
        }
      }
      return value;
    });
  }
}
