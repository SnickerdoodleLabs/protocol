import { IpfsCID, AdKey, SHA256Hash, Signature } from "@objects/primitives";


export class AdSignatureWrapper {
    public constructor(
        public queryCID: IpfsCID,
        public adKey: AdKey,
        public contentHash: SHA256Hash,
        public signature: Signature
    ) {}
}
