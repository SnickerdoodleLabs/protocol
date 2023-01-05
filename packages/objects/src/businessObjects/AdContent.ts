import {
    IpfsCID,
} from "@objects/primitives";
import { AdContentType } from "@objects/primitives";


export class AdContent {
    public constructor(
        public type: AdContentType,
        public src: IpfsCID
    ) {}
}
