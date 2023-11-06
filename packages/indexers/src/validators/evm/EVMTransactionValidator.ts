import {
  ILogUtilsType,
  ILogUtils,
  ValidationUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  BigNumberString,
  EChain,
  EDataProvider,
  EVMAccountAddress,
  EVMContractAddress,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";

import { IEVMTransactionValidator } from "@indexers/interfaces";

@injectable()
export class EVMTransactionValidator implements IEVMTransactionValidator {
  constructor(
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {}

  public validate(
    transaction: EVMTransaction,
    indexerName: EDataProvider,
    chainId: EChain,
  ): boolean {
    const irregularData: {
      value: unknown;
      propertyName: string;
    }[] = [];

    //can not be null
    this.checkProperty(
      transaction.hash,
      "hash",
      this.isValidEVMTxHash,
      irregularData,
      false,
    );
    this.checkProperty(
      transaction.timestamp,
      "timestamp",
      this.isValidEthereumTimestamp,
      irregularData,
      false,
    );
    //Can be null, but if exists should match our format
    this.checkProperty(
      transaction.blockHeight,
      "blockHeight",
      this.isValidBlockNumber,
      irregularData,
    );

    this.checkProperty(
      transaction.to,
      "to",
      this.isValidEthereumAddress,
      irregularData,
    );

    this.checkProperty(
      transaction.from,
      "from",
      this.isValidEthereumAddress,
      irregularData,
    );

    this.checkProperty(
      transaction.value,
      "value",
      this.isValidBigNumberString,
      irregularData,
    );

    this.checkProperty(
      transaction.gasPrice,
      "gasPrice",
      this.isValidBigNumberString,
      irregularData,
    );

    this.checkProperty(
      transaction.contractAddress,
      "contractAddress",
      this.isValidEthereumAddress,
      irregularData,
    );

    this.checkProperty(
      transaction.input,
      "input",
      ValidationUtils.isString,
      irregularData,
    );

    this.checkProperty(
      transaction.methodId,
      "methodId",
      ValidationUtils.isString,
      irregularData,
    );

    this.checkProperty(
      transaction.functionName,
      "functionName",
      ValidationUtils.isString,
      irregularData,
    );

    if (irregularData.length > 0) {
      this.irregularDataLog(indexerName, chainId, irregularData);
      return false;
    }

    return true;
  }

  private checkProperty<T>(
    propValue: T | null,
    propertyName: string,
    method: (value: T) => boolean,
    irregularData: {
      value: unknown;
      propertyName: string;
    }[],
    valueCanBeNull = true,
  ): void {
    if (propValue !== null) {
      const result = method(propValue);
      if (result === false) {
        irregularData.push({
          value: propValue,
          propertyName,
        });
        return;
      }
    }
    if (!valueCanBeNull && propValue == null) {
      irregularData.push({
        value: propValue,
        propertyName,
      });
      return;
    }
  }
  protected isValidBigNumberString(value: BigNumberString): boolean {
    if (
      ValidationUtils.isNonNegativeNumberString(value) ||
      ValidationUtils.isHexString(value)
    ) {
      return true;
    }
    return false;
  }

  protected isValidEVMTxHash(hash: EVMTransactionHash): boolean {
    if (typeof hash === "string") {
      const hashRegex = /^0x([A-Fa-f0-9]{64})$/;
      return hashRegex.test(hash);
    }
    return false;
  }

  protected isValidBlockNumber(value: number): boolean {
    if (ValidationUtils.isNumber(value)) {
      if (value === 0) {
        this.logUtils.log("Genesis block number encountered, most impressive");
        return true;
      }
      return value > 0;
    }
    return false;
  }

  // The Ethereum blockchain's genesis block is marked with a timestamp of 0
  // Which corresponds to the Unix epoch in 1970.
  // However, Ethereum was officially launched in 2015, making this timestamp, funny.
  // To consider valid Ethereum timestamps, we will accept from 2015, but we will also accept genesis
  protected isValidEthereumTimestamp(value: UnixTimestamp): boolean {
    const ethereumLaunchYear = 1420070400; //Jan 1st 2015
    if (typeof value === "number") {
      if (value === 0) {
        this.logUtils.log("Genesis block time encountered, most impressive");
        return true;
      }
      return value >= ethereumLaunchYear;
    }
    return false;
  }

  protected isValidEthereumAddress(
    value: EVMContractAddress | EVMAccountAddress,
  ): boolean {
    if (typeof value === "string") {
      if (value === "") {
        return true;
      }
      try {
        ethers.utils.getAddress(value);
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  protected irregularDataLog(
    indexer: EDataProvider,
    chain: EChain,
    irregularData: {
      value: unknown;
      propertyName: string;
    }[],
  ) {
    let errorMessage = `Received irregular value while fetching EVM transactions from indexer "${indexer}" for Chain: "${chain}".\n`;

    for (const { value, propertyName } of irregularData) {
      errorMessage += `Property: "${propertyName}", Value: ${value}, Type: ${typeof value}.\n`;
    }

    errorMessage += `The transaction is rejected.`;

    this.logUtils.warning(errorMessage);
  }
}
