import { ValidationUtils } from "@snickerdoodlelabs/common-utils";
import {
  BigNumberString,
  EVMAccountAddress,
  EVMTransaction,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";

import { IEVMTransactionNormalizer } from "@indexers/interfaces";

@injectable()
export class EVMTransactionNormalizer implements IEVMTransactionNormalizer {
  public normalize(transaction: EVMTransaction): void {
    this.normalizeAccountAddress(transaction, "to");
    this.normalizeAccountAddress(transaction, "from");
    this.normalizeBlockHeight(transaction);
    this.normalizeStringTimestamp(transaction);
    this.normalizeValue(transaction);
  }

  protected normalizeBlockHeight(transaction: EVMTransaction): void {
    if (typeof transaction.blockHeight === "string") {
      const transformedBlockHeight = this.stringToNumber(
        transaction.blockHeight,
      );
      if (transformedBlockHeight != null) {
        transaction.blockHeight = transformedBlockHeight;
      }
    }
  }

  protected normalizeValue(transaction: EVMTransaction): void {
    if (typeof transaction.value === "number") {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const txVal: string = transaction.value.toString();
      transaction.value = BigNumberString(txVal);
    }
  }

  protected normalizeAccountAddress(
    transaction: EVMTransaction,
    propertyName: "to" | "from",
  ): void {
    const propertyValue = transaction[propertyName];
    if (propertyValue != null && typeof propertyValue === "string") {
      transaction[propertyName] = EVMAccountAddress(
        propertyValue.toLowerCase(),
      );
    }
  }

  protected normalizeStringTimestamp(transaction: EVMTransaction): void {
    if (typeof transaction.timestamp === "string") {
      const transformedTransaction = this.stringToNumber(transaction.timestamp);
      if (transformedTransaction != null) {
        transaction.timestamp = UnixTimestamp(transformedTransaction);
      }
    }
  }

  protected stringToNumber(value: string): number | null {
    if (ValidationUtils.isNonNegativeNumberString(value)) {
      try {
        const timestamp = parseInt(value, 10);
        return timestamp >= 0 ? timestamp : null;
      } catch (error) {
        return null;
      }
    } else if (ValidationUtils.isHexString(value)) {
      try {
        const timestamp = parseInt(value, 16);
        return timestamp;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }
}
