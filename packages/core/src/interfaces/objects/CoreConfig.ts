import {
  ChainId,
  ChainInformation,
  ControlChainInformation,
  URLString,
} from "@snickerdoodlelabs/objects";

export class CoreConfig {
  public constructor(
    public controlChainId: ChainId,
    public providerAddress: URLString,
    public chainInformation: Map<ChainId, ChainInformation>,
    public controlChainInformation: ControlChainInformation,
    public ipfsNodeAddress: URLString,
  ) {}
}
