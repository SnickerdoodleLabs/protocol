import "reflect-metadata";
import { IBigNumberUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  EChain,
  EDataProvider,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { IEVMTransactionSanitizer } from "@indexers/interfaces/index.js";
import { EVMTransactionSanitizer } from "@indexers/sanitizers/index.js";
import {
  validEVMTransactions,
  validUpperCaseEVMTransactions,
  invalidEVMTransactions,
  invalidButCanBeNormalizedTransactions,
  validMixedCaseAddress,
} from "@indexers-test/mock/EthereumTransactions.js";

class EVMTransactionSanitizerMocks {
  public logUtils: ILogUtils;
  public bigNumberUtils: IBigNumberUtils;
  public constructor() {
    this.logUtils = td.object<ILogUtils>();
    this.bigNumberUtils = td.object<IBigNumberUtils>();

    td.when(this.bigNumberUtils.validateBNS(td.matchers.anything())).thenReturn(
      true,
    );
  }

  public factory(): IEVMTransactionSanitizer {
    return new EVMTransactionSanitizer(this.logUtils, this.bigNumberUtils);
  }
}

describe("EVMTransactionSanitizer", () => {
  describe("valid transaction", () => {
    test("should return EVMTransaction without modifying for valid transaction", () => {
      // Arrange
      const mocks = new EVMTransactionSanitizerMocks();
      const service = mocks.factory();

      for (const validTransaction of validEVMTransactions) {
        // Act
        const result = service.sanitize(
          validTransaction,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(EVMTransaction);
        expect(result).toEqual(validTransaction);
      }
    });

    test("should return EVMTransaction with lower casing the account address for valid transaction", () => {
      // Arrange
      const mocks = new EVMTransactionSanitizerMocks();
      const service = mocks.factory();

      //Both`to` and `from` are same
      const expectedAddress = validMixedCaseAddress.toLowerCase();
      for (const validUpperCaseTx of validUpperCaseEVMTransactions) {
        // Act
        const result = service.sanitize(
          validUpperCaseTx,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(EVMTransaction);
        if (result != null) {
          expect(result.to).toEqual(expectedAddress);
          expect(result.from).toEqual(expectedAddress);
        } else {
          fail();
        }
      }
    });
  });

  describe("invalid transaction", () => {
    test("should return null for invalid transaction", () => {
      // Arrange
      const mocks = new EVMTransactionSanitizerMocks();
      const service = mocks.factory();

      for (const invalidTransaction of invalidEVMTransactions) {
        // Act
        const result = service.sanitize(
          invalidTransaction,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).toBeNull();
      }
    });

    test("should return valid EVM transaction from normalizable invalid transaction", () => {
      // Arrange
      const mocks = new EVMTransactionSanitizerMocks();
      const service = mocks.factory();

      for (const invalidTransaction of invalidButCanBeNormalizedTransactions) {
        // Act
        const result = service.sanitize(
          invalidTransaction,
          EDataProvider.Alchemy,
          EChain.EthereumMainnet,
        );
        // Assert
        expect(result).not.toBeNull();
        expect(result).toBeInstanceOf(EVMTransaction);
      }
    });
  });
});
