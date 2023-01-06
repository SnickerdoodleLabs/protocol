import {
    IpfsCID,
    UnixTimestamp,
} from "@objects/primitives";
import { AdContent } from "@objects/businessObjects";
import { AdDisplayType } from "@objects/primitives/AdDisplayType";


export class EligibleAd {
    public constructor(
        public queryCID: IpfsCID,
        public key: string, // 'a1'
        public name: string,
        public content: AdContent,
        public text: string | null,
        public displayType: AdDisplayType,
        public weight: number,
        public expiry: UnixTimestamp,
        public keywords: string[]
    ) {}

    public getUniqueId(): string {
        return this.queryCID + this.key;
    }
}
