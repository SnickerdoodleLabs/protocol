import { ChainId, CompensationId, ISDQLCallback, SDQL_Name, URLString } from "@snickerdoodlelabs/objects";

export class AST_Compensation {
  constructor(
    readonly name: SDQL_Name,
    readonly description: string, // TODO
    readonly chainId: ChainId,
    readonly callback: ISDQLCallback,
    readonly alternatives: CompensationId[]
    // readonly name?: string
    // readonly image?: string
  ) {}
}
