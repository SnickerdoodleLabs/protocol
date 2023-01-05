import {
    IpfsCID,
} from "@objects/primitives";
import { EAdContentType } from "@objects/primitives";


export class AdContent {
    public constructor(
        public type: EAdContentType,
        public src: IpfsCID
    ) {}
}
