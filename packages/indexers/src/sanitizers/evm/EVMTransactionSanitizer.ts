import {
  ILogUtilsType,
  ILogUtils,
  ValidationUtils,
  IBigNumberUtils,
  IBigNumberUtilsType,
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

import { IEVMTransactionSanitizer } from "@indexers/interfaces";

@injectable()
export class EVMTransactionSanitizer implements IEVMTransactionSanitizer {
  constructor(
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
  ) {}
  // EVM  or null
  public sanitize(
    transaction: EVMTransaction,
    indexerName: EDataProvider,
    chainId: EChain,
  ): EVMTransaction | null {
    const irregularData: {
      value: unknown;
      propertyName: string;
    }[] = [];
    //can not be null
    const hash = this.checkProperty(
      transaction.hash,
      "hash",
      this.sanitizeEVMTxHash,
      irregularData,
      false,
    );

    const timestamp = this.checkProperty(
      transaction.timestamp,
      "timestamp",
      this.sanitizeEthereumTimestamp,
      irregularData,
      false,
    );

    //Can be null, but if exists should match our format
    const blockHeight = this.checkProperty(
      transaction.blockHeight,
      "blockHeight",
      this.sanitizeBlockNumber,
      irregularData,
    );

    const to = this.checkProperty(
      transaction.to,
      "to",
      this.sanitizeEthereumAddress,
      irregularData,
    );

    const from = this.checkProperty(
      transaction.from,
      "from",
      this.sanitizeEthereumAddress,
      irregularData,
    );

    const value = this.checkProperty(
      transaction.value,
      "value",
      this.sanitizeBigNumberString,
      irregularData,
    );

    const gasPrice = this.checkProperty(
      transaction.gasPrice,
      "gasPrice",
      this.sanitizeBigNumberString,
      irregularData,
    );

    const contractAddress = this.checkProperty(
      transaction.contractAddress,
      "contractAddress",
      this.sanitizeEthereumAddress,
      irregularData,
    );

    const input = this.checkProperty(
      transaction.input,
      "input",
      this.checkString,
      irregularData,
    );

    const methodId = this.checkProperty(
      transaction.methodId,
      "methodId",
      this.checkString,
      irregularData,
    );

    const functionName = this.checkProperty(
      transaction.functionName,
      "functionName",
      this.checkString,
      irregularData,
    );
    if (irregularData.length > 0) {
      this.irregularDataLog(indexerName, chainId, irregularData);
      return null;
    }

    //making typescript happy,
    if (hash != null && timestamp != null) {
      return new EVMTransaction(
        transaction.chain,
        hash,
        timestamp,
        blockHeight,
        to as EVMAccountAddress,
        from as EVMAccountAddress,
        value,
        gasPrice,
        contractAddress as EVMContractAddress,
        input,
        methodId,
        functionName,
        transaction.events,
        transaction.measurementDate,
      );
    }
    return null;
  }

  private checkProperty<T>(
    propValue: T | null,
    propertyName: string,
    method: (value: T) => T | null,
    irregularData: {
      value: unknown;
      propertyName: string;
    }[],
    valueCanBeNull = true,
  ): T | null {
    if (propValue !== null) {
      const result = method.call(this, propValue);
      if (result === null) {
        irregularData.push({
          value: propValue,
          propertyName,
        });
      }
      return result;
    }
    if (!valueCanBeNull && propValue == null) {
      irregularData.push({
        value: propValue,
        propertyName,
      });
    }

    return propValue;
  }

  protected checkString(value: string): string | null {
    if (ValidationUtils.isString(value)) {
      return value;
    }
    return null;
  }

  protected sanitizeBigNumberString(
    value: BigNumberString,
  ): BigNumberString | null {
    if (ValidationUtils.isNumber(value)) {
      if (value < 0) {
        return null;
      }
      const stringVal: string = (value as number).toString();
      return BigNumberString(stringVal);
    } else if (ValidationUtils.isString(value)) {
      if (!this.bigNumberUtils.validateBNS(value)) {
        return BigNumberString("0");
      }
      if (!ValidationUtils.isNonNegativeHexOrNumberString(value)) {
        return null;
      }
      return BigNumberString(value);
    }
    return null;
  }

  protected sanitizeEVMTxHash(
    hash: EVMTransactionHash,
  ): EVMTransactionHash | null {
    if (
      ValidationUtils.isString(hash) &&
      ValidationUtils.isValidHex(hash, 64)
    ) {
      return EVMTransactionHash(hash);
    }
    return null;
  }

  protected sanitizeBlockNumber(value: number): number | null {
    if (ValidationUtils.isString(value)) {
      const numberVal = ValidationUtils.hexOrNumberStringToNumber(value);
      if (numberVal === 0) {
        this.logUtils.debug(
          "Genesis block number encountered, most impressive",
        );
      }
      return numberVal;
    } else if (ValidationUtils.isNumber(value)) {
      if (value === 0) {
        this.logUtils.debug(
          "Genesis block number encountered, most impressive",
        );
      }
      return value >= 0 ? value : null;
    }
    return null;
  }
  protected sanitizeEthereumTimestamp(
    value: UnixTimestamp,
  ): UnixTimestamp | null {
    if (ValidationUtils.isString(value) || ValidationUtils.isNumber(value)) {
      const transformedTransaction = ValidationUtils.checkValidEVMTimestamp(
        typeof value === "string"
          ? ValidationUtils.hexOrNumberStringToNumber(value)
          : value,
      );
      if (transformedTransaction === 0) {
        this.logUtils.debug("Genesis block time encountered, most impressive");
      }
      return transformedTransaction !== null
        ? UnixTimestamp(transformedTransaction)
        : null;
    }
    return null;
  }

  protected sanitizeEthereumAddress(
    value: EVMContractAddress | EVMAccountAddress,
  ): EVMContractAddress | EVMAccountAddress | null {
    if (ValidationUtils.isString(value)) {
      if (value === "") {
        //Could be contract creation
        return EVMContractAddress("");
      }
      try {
        ethers.utils.getAddress(value);
        return EVMContractAddress(value.toLowerCase());
      } catch (error) {
        return null;
      }
    }
    return null;
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
