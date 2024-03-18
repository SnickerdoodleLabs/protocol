import {
  ESDQLQueryReturn,
  EWalletDataType,
  MissingWalletDataTypeError,
  Permission,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { Result } from "neverthrow";

export abstract class AST_SubQuery {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn,
  ) {}
  abstract getPermission(): Result<Permission, MissingWalletDataTypeError>;
}
