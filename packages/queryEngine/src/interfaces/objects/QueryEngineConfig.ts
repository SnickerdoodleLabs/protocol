import { ChainId, URLString } from "@snickerdoodlelabs/objects";

export class QueryEngineConfig {
  public constructor(
    public controlChainId: ChainId,
    public providerAddress: URLString,
  ) {}
}
