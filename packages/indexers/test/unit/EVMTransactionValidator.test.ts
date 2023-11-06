import "reflect-metadata";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import { EChain, EDataProvider } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { IEVMTransactionValidator } from "@indexers/interfaces/index.js";
import { EVMTransactionValidator } from "@indexers/validators/index.js";
import {
  validEVMTransactions,
  invalidEVMTransactions,
} from "@indexers-test/mock/EthereumTransactions.js";

describe("EVMTransactionValidator", () => {
  const logUtils = td.object<ILogUtils>();

  let evmTransactionValidator: IEVMTransactionValidator;
  beforeEach(() => {
    // Arrange
    evmTransactionValidator = new EVMTransactionValidator(logUtils);
  });

  describe("valid transaction", () => {
    test("should return true for valid transaction", () => {
      for (const validTransaction of validEVMTransactions) {
        // Act
        const result = evmTransactionValidator.validate(
          validTransaction,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).toBe(true);
      }
    });
  });

  describe("invalid transaction", () => {
    test("should return false for invalid transaction", () => {
      for (const invalidTransaction of invalidEVMTransactions) {
        // Act
        const result = evmTransactionValidator.validate(
          invalidTransaction,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).toBe(false);
      }
    });
  });
});
