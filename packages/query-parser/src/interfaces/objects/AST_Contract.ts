import {
  ChainId,
  EVMAccountAddress,
  EVMTimestampRange,
  EVMContractDirection,
  EVMContractFunction,
  EVMToken,
} from "@snickerdoodlelabs/objects";

export class AST_Contract {
  constructor(
    readonly networkId: ChainId,
    readonly address: EVMAccountAddress,
    readonly func: EVMContractFunction,
    readonly direction: EVMContractDirection,
    readonly token: EVMToken,
    readonly timestampRange: EVMTimestampRange,
  ) {}

  static fromSchema(schema: any): AST_Contract {
    // console.log("Contract schema", schema);

    let direction = EVMContractDirection.To;
    if (schema.direction == "from") {
      direction = EVMContractDirection.From;
    }
    return new AST_Contract(
      ChainId(Number(schema.networkid)),
      EVMAccountAddress(schema.address),
      EVMContractFunction(schema.function),
      direction,
      EVMToken(schema.token),
      EVMTimestampRange.fromString(schema.timestampRange),
    );
  }
}
