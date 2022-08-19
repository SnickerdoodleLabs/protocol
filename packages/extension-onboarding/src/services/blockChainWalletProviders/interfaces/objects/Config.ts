import { ControlChainInformation } from "@snickerdoodlelabs/objects";

export class Config {
  constructor(
    public infuraId: string,
    public controlChain: ControlChainInformation,
  ) {}
}
