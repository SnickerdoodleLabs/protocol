import { SDQL_Name } from "@snickerdoodlelabs/objects";

export abstract class Command {
  constructor(readonly name: SDQL_Name) {}
}
