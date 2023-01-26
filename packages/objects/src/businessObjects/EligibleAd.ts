import { AdContent } from "@objects/businessObjects";
import {
  AdKey,
  EVMContractAddress,
  IpfsCID,
  UnixTimestamp,
  EAdDisplayType,
} from "@objects/primitives";

export class EligibleAd {
  public constructor(
    public consentContractAddress: EVMContractAddress,
    public queryCID: IpfsCID,
    public key: AdKey, // 'a1'
    public name: string,
    public content: AdContent,
    public text: string | null,
    public displayType: EAdDisplayType,
    public weight: number,
    public expiry: UnixTimestamp,
    public keywords: string[],
  ) {}

  public getUniqueId(): string {
    return this.queryCID + this.key;
  }
}
