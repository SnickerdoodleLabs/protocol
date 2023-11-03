import {
  ILogUtilsType,
  ILogUtils,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  BigNumberString,
  ChainId,
  EDataProvider,
  EVMAccountAddress,
  EVMContractAddress,
  EVMEvent,
  EVMTransaction,
  EVMTransactionHash,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable, inject } from "inversify";

import {
  TEVMTransactionFactory,
  IndexerEvmResponseTypes,
} from "@indexers/interfaces";
import { IAnkrTransaction } from "@indexers/providers/index.js";

@injectable()
export class EVMTransactionFactory implements TEVMTransactionFactory {
  constructor(
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public build(
    indexerResponse: IndexerEvmResponseTypes,
    indexerName: EDataProvider,
    chainId: ChainId,
  ): EVMTransaction | null {
    const props = this.getEVMProps(indexerResponse, indexerName);
    const irregularData: {
      value: unknown;
      propertyName: string;
      indexer: EDataProvider;
    }[] = [];

    //can not be null
    const hash = this.hash(props.hash) as EVMTransactionHash;
    const timestamp = this.timestamp(props.timestamp) as UnixTimestamp;

    //Can be null, but if exists should match our format
    const blockHeight = this.getPropertyWithIrregularCheck<number>(
      props.blockHeight,
      "blockHeight",
      indexerName,
      irregularData,
    ) as number | null;
    const to = this.getPropertyWithIrregularCheck<EVMAccountAddress | null>(
      props.to,
      "to",
      indexerName,
      irregularData,
    );
    const from = this.getPropertyWithIrregularCheck<EVMAccountAddress | null>(
      props.from,
      "from",
      indexerName,
      irregularData,
    );
    const value = this.getPropertyWithIrregularCheck<BigNumberString | null>(
      props.value,
      "value",
      indexerName,
      irregularData,
    );
    const gasPrice = this.getPropertyWithIrregularCheck<BigNumberString | null>(
      props.gasPrice,
      "gasPrice",
      indexerName,
      irregularData,
    );
    const contractAddress =
      this.getPropertyWithIrregularCheck<EVMContractAddress | null>(
        props.contractAddress,
        "contractAddress",
        indexerName,
        irregularData,
      );
    const input = this.getPropertyWithIrregularCheck<string | null>(
      props.input,
      "input",
      indexerName,
      irregularData,
    );
    const methodId = this.getPropertyWithIrregularCheck<string | null>(
      props.methodId,
      "methodId",
      indexerName,
      irregularData,
    );
    const functionName = this.getPropertyWithIrregularCheck<string | null>(
      props.functionName,
      "functionName",
      indexerName,
      irregularData,
    );

    if (hash === null) {
      irregularData.push({
        value: props.hash,
        propertyName: "hash",
        indexer: indexerName,
      });
    }

    if (timestamp === null) {
      irregularData.push({
        value: props.timestamp,
        propertyName: "timestamp",
        indexer: indexerName,
      });
    }
    if (irregularData.length > 0) {
      this.irregularDataLog(indexerName, chainId, irregularData);
      return null;
    }

    const events = props.events;
    const chain = chainId;
    const measurementDate = this.timeUtils.getUnixNow();

    return this.createEVMTransaction(
      chain,
      hash,
      timestamp,
      blockHeight,
      to,
      from,
      value,
      gasPrice,
      contractAddress,
      input,
      methodId,
      functionName,
      events,
      measurementDate,
    );
  }

  private getPropertyWithIrregularCheck<T>(
    propValue: T | unknown,
    propertyName: string,
    indexerName: EDataProvider,
    irregularData: {
      value: unknown;
      propertyName: string;
      indexer: EDataProvider;
    }[],
  ): T | null {
    if (propValue != null) {
      const result = this[propertyName](indexerName, propValue);
      if (result === null) {
        irregularData.push({
          value: propValue,
          propertyName,
          indexer: indexerName,
        });
      }
      return result;
    }
    return null;
  }

  private createEVMTransaction(
    chain: ChainId,
    hash: EVMTransactionHash,
    timestamp: UnixTimestamp,
    blockHeight: number | null,
    to: EVMAccountAddress | null,
    from: EVMAccountAddress | null,
    value: BigNumberString | null,
    gasPrice: BigNumberString | null,
    contractAddress: EVMContractAddress | null,
    input: string | null,
    methodId: string | null,
    functionName: string | null,
    events: EVMEvent[] | null,
    measurementDate: UnixTimestamp,
  ): EVMTransaction {
    return new EVMTransaction(
      chain,
      hash,
      timestamp,
      blockHeight,
      to,
      from,
      value,
      gasPrice,
      contractAddress,
      input,
      methodId,
      functionName,
      events,
      measurementDate,
    );
  }

  public hash(value: unknown): EVMTransactionHash | null {
    if (typeof value === "string") {
      return EVMTransactionHash(value);
    }

    return null;
  }

  public timestamp(value: unknown): UnixTimestamp | null {
    if (typeof value === "number") {
      return value >= 0 ? UnixTimestamp(value) : null;
    }
    if (typeof value === "string") {
      const timestamp = this.stringToUnixTimestamp(value);
      return timestamp !== null ? UnixTimestamp(timestamp) : null;
    }

    return null;
  }

  public blockHeight(value: unknown): number | null {
    if (typeof value === "number") {
      return value;
    }

    return null;
  }

  public to(value: unknown): EVMAccountAddress | null {
    if (typeof value === "string") {
      const lowercaseAddress = value.toLowerCase();
      if (this.isEthereumAddress(lowercaseAddress)) {
        return EVMAccountAddress(value);
      }
    }

    return null;
  }

  public from(value: unknown): EVMAccountAddress | null {
    if (typeof value === "string") {
      const lowercaseAddress = value.toLowerCase();
      if (this.isEthereumAddress(lowercaseAddress)) {
        return EVMAccountAddress(value);
      }
    }

    return null;
  }

  public value(value: unknown): BigNumberString | null {
    if (typeof value === "string") {
      return BigNumberString(value);
    }

    return null;
  }

  public gasPrice(value: unknown): BigNumberString | null {
    if (typeof value === "string") {
      return BigNumberString(value);
    }

    return null;
  }

  public contractAddress(value: unknown): EVMContractAddress | null {
    if (typeof value === "string") {
      const lowercaseAddress = value.toLowerCase();
      if (this.isEthereumAddress(lowercaseAddress)) {
        return EVMContractAddress(value);
      }
    }

    return null;
  }

  public input(value: unknown): string | null {
    if (typeof value === "string") {
      return value;
    }

    return null;
  }

  public methodId(value: unknown): string | null {
    if (typeof value === "string") {
      return value;
    }

    return null;
  }

  public functionName(value: unknown): string | null {
    if (typeof value === "string") {
      return value;
    }

    return null;
  }

  protected isNumber(value: string): boolean {
    return /^\d+$/.test(value);
  }

  protected isHex32String(value: string): boolean {
    return /^[0-9a-fA-F]{32}$/.test(value);
  }

  protected stringToUnixTimestamp(value: string): number | null {
    if (this.isNumber(value)) {
      try {
        const timestamp = parseInt(value, 10);
        return timestamp >= 0 ? timestamp : null;
      } catch (error) {
        return null;
      }
    } else if (this.isHex32String(value)) {
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

  protected irregularDataLog(
    indexer: EDataProvider,
    chain: ChainId,
    irregularData: {
      value: unknown;
      propertyName: string;
    }[],
  ) {
    let errorMessage = `Received irregular value while fetching EVM transactions from indexer "${indexer}" from Chain: "${chain}".\n`;

    for (const { value, propertyName } of irregularData) {
      errorMessage +=
        `Property: "${propertyName}", Value: ${value}, Type: ${typeof value}.\n` +
        `The transaction will be rejected.`;
    }

    this.logUtils.warning(errorMessage);
  }

  protected isEthereumAddress(value: string): boolean {
    try {
      ethers.utils.getAddress(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  //Only gets the expected data
  protected getEVMProps(
    indexerResponse: IndexerEvmResponseTypes,
    indexerType: EDataProvider,
  ): EVMTransactionProps & { events: EVMEvent[] | null } {
    const props: EVMTransactionProps & { events: EVMEvent[] | null } = {
      hash: null,
      timestamp: null,
      blockHeight: null,
      to: null,
      from: null,
      value: null,
      gasPrice: null,
      contractAddress: null,
      input: null,
      methodId: null,
      functionName: null,
      events: null,
    };
    switch (indexerType) {
      case EDataProvider.Ankr:
        const transaction = indexerResponse as IAnkrTransaction;
        props.hash = transaction.hash;
        props.timestamp = transaction.timestamp;
        props.blockHeight = transaction.blockNumber;
        props.to = transaction.to;
        props.from = transaction.from;
        props.value = transaction.value;
        props.gasPrice = transaction.gasPrice;
        props.input = transaction.input;
        props.methodId = transaction.type;
        break;

      default:
        break;
    }

    return props;
  }
}

type EVMTransactionProps = {
  [K in keyof Omit<
    EVMTransaction,
    | "accountAddresses"
    | "functionSignature"
    | "getVersion"
    | "chain"
    | "measurementDate"
  >]: unknown | null;
};
