import {
    IpfsCID,
} from "@objects/primitives";
import { EAdContentType } from "@objects/enum";


export class AdContent {
    public constructor(
        public type: EAdContentType,
        public src: IpfsCID
    ) {}
}
