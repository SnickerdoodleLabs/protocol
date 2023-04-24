import { ERewardType } from "@objects/enum";
import { ChainId, CompensationId, IpfsCID } from "@objects/primitives";

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
