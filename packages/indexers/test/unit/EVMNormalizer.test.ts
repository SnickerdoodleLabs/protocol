import "reflect-metadata";

import { IBigNumberUtils } from "@snickerdoodlelabs/common-utils";
import {
  BigNumberString,
  EChain,
  EDataProvider,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

import { IEVMTransactionNormalizer } from "@indexers/interfaces/index.js";
import { EVMTransactionNormalizer } from "@indexers/normalizers";
import {
  validEVMTransactions,
  invalidEVMTransactions,
} from "@indexers-test/mock/EthereumTransactions.js";

describe("EVMNormalizer", () => {
  let evmTransactionNormalizer: IEVMTransactionNormalizer;
  const bigNumberUtils = td.object<IBigNumberUtils>();
  const convertableTimestampTxs = invalidEVMTransactions.slice(0, 2);
  const validTx = validEVMTransactions[0];
  const expectedLowerCaseAddress = validTx.from;
  validTx.to = EVMAccountAddress(validTx.to!.toUpperCase());
  validTx.from = EVMAccountAddress(validTx.from!.toUpperCase());
  beforeEach(() => {
    // Arrange
    evmTransactionNormalizer = new EVMTransactionNormalizer(bigNumberUtils);
  });

  describe("normalize timestamps", () => {
    test("should convert string timestamps to unixtimestamp", () => {
      for (const [index, value] of convertableTimestampTxs.entries()) {
        evmTransactionNormalizer.normalize(value);
        expect(convertableTimestampTxs[index].timestamp).toBe(1659609391);
      }
    });
  });

  describe("normalize blockheight", () => {
    test("should convert string to number", () => {
      const invalidBlockHeightTx = invalidEVMTransactions[2];
      evmTransactionNormalizer.normalize(invalidBlockHeightTx);
      expect(invalidBlockHeightTx.blockHeight).toBe(1);
    });
  });

  describe("normalize account address", () => {
    test("should convert uppercase to lowercase", () => {
      evmTransactionNormalizer.normalize(validTx);
      expect(validTx.to).toBe(expectedLowerCaseAddress);
      expect(validTx.from).toBe(expectedLowerCaseAddress);
    });
  });

  describe("normalize value field ", () => {
    test("should convert number to string", () => {
      evmTransactionNormalizer.normalize(invalidEVMTransactions[3]);
      expect(validTx.value).toBe(BigNumberString("0"));
    });
  });
});
