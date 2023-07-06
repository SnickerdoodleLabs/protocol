import { ERewardType } from "@objects/enum/index.js";
import { ChainId, CompensationId, IpfsCID } from "@objects/primitives/index.js";

export class EligibleReward {
  public constructor(
    public compensationKey: CompensationId, // c3
    public name: string,
    public image: IpfsCID | null,
    public description: string,
    public chainId: ChainId,
    public callback: string, // stringify the callback object
    public type: ERewardType,
  ) {}
}
