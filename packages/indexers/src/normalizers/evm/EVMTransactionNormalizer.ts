import { ValidationUtils } from "@snickerdoodlelabs/common-utils";
import {
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
  }

  protected normalizeBlockHeight(transaction: EVMTransaction): void {
    if (typeof transaction.blockHeight === "string") {
      transaction.blockHeight = this.stringToNumber(transaction.blockHeight);
    }
  }

  protected normalizeAccountAddress(
    transaction: EVMTransaction,
    propertyName: "to" | "from",
  ): void {
    const propertyValue = transaction[propertyName];
    if (propertyValue !== null && typeof propertyValue === "string") {
      transaction[propertyName] = EVMAccountAddress(
        propertyValue.toLowerCase(),
      );
    }
  }

  protected normalizeStringTimestamp(transaction: EVMTransaction): void {
    if (typeof transaction.timestamp === "string") {
      const transformedTransaction = this.stringToNumber(transaction.timestamp);
      transaction.timestamp = transformedTransaction;
    }
  }

  protected stringToNumber(value: string): UnixTimestamp {
    if (ValidationUtils.isNonNegativeNumberString(value)) {
      try {
        const timestamp = parseInt(value, 10);
        return timestamp >= 0 ? UnixTimestamp(timestamp) : UnixTimestamp(-1);
      } catch (error) {
        return UnixTimestamp(-1);
      }
    } else if (ValidationUtils.isHexString(value)) {
      try {
        const timestamp = parseInt(value, 16);
        return UnixTimestamp(timestamp);
      } catch (error) {
        return UnixTimestamp(-1);
      }
    } else {
      return UnixTimestamp(-1);
    }
  }
}
