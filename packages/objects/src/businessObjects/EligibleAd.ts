import {
    IpfsCID,
    ISO8601DateString,
} from "@objects/primitives";


export class EligibleAd {
    public constructor(
        public id: string, // IpfsCID + Ad key
        public key: string,
        public name: string,
        public content: {
            type: "image" | "video",
            src: IpfsCID
        },
        public text: string | null,
        public type: "banner" | "popup",
        public weight: number,
        public expiry: ISO8601DateString,
        public keywords: string[]
    ) {}
}
