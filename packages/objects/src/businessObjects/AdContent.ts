import { EAdContentType } from "@objects/enum";
import { IpfsCID } from "@objects/primitives";

export class AdContent {
  public constructor(public type: EAdContentType, public src: IpfsCID) {}
}
