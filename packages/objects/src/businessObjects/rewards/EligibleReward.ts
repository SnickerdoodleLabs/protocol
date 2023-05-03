import { ERewardType } from "@objects/enum";
import { ChainId, CompensationKey, IpfsCID } from "@objects/primitives";

export class EligibleReward {
  public constructor(
    public compensationKey: CompensationKey, // c3
    public name: string,
    public image: IpfsCID | null,
    public description: string,
    public chainId: ChainId,
    public callback: string, // stringify the callback object
    public type: ERewardType,
  ) {}
}
