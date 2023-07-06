import { EAdContentType } from "@objects/enum/index.js";
import { IpfsCID } from "@objects/primitives/index.js";

export class AdContent {
  public constructor(public type: EAdContentType, public src: IpfsCID) {}
}
