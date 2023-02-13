import { ISDQLQueryReturnEnum, SDQL_Name } from "@snickerdoodlelabs/objects";

export abstract class AST_Query {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ISDQLQueryReturnEnum,
  ) {
    // super(name);
  }

  // abstract serialize (): JSON;
}
