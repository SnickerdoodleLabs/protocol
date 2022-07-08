import { IpfsCID, URLString } from "@objects/primitives";

export class EligibleReward {
    public constructor(
        public description: string,
        public callback: URLString,
    ) { }
}
