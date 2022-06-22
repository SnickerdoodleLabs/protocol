import { ChainId, URLString } from "@snickerdoodlelabs/objects";

export class CoreConfig {
  public constructor(
    public controlChainId: ChainId,
    public providerAddress: URLString,
  ) { }
}
