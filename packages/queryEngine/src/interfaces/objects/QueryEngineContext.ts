// This is basically global variables

import { EthereumAccountAddress, SDQLQuery } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class QueryEngineContext {
  public constructor(
    public dataWalletAddress: EthereumAccountAddress | null,
    public onQueryPosted: Subject<SDQLQuery>,
  ) {}
}
