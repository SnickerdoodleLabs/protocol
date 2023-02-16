import {
  EWalletDataType,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";
import { Result } from "neverthrow";

export abstract class AST_Query {
  constructor(readonly name: SDQL_Name, readonly returnType: ESDQLQueryReturn) {
    // super(name);
  }

  abstract getPermission(): Result<EWalletDataType, MissingWalletDataTypeError>;
  // abstract serialize (): JSON;
}
