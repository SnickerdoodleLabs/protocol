import { 
    IpfsCID, 
    AdKey, 
    SHA256Hash, 
    Signature, 
    EVMContractAddress, 
    JsonWebToken
} from "@objects/primitives";


export class AdSignature {
    public constructor(
        public consentContractAddress: EVMContractAddress,
        public queryCID: IpfsCID,
        public adKey: AdKey,
        public contentHash: SHA256Hash,
        public signature: Signature | JsonWebToken
    ) {}
}
