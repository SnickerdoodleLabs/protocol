import { ERewardType } from "@objects/enum";
import { ChainId, IpfsCID, URLString } from "@objects/primitives";

export class EligibleReward {
  public constructor(
    public compensationKey: string, // c3
    public name: string,
    public image: IpfsCID | URLString | null,
    public description: string,
    public chainId: ChainId,
    public callback: string, // stringify the callback object
    public type: ERewardType,
  ) {}
}
