import { EthereumContractAddress } from "@snickerdoodlelabs/objects";

export class ConsentToken {
    public constructor(public contractAddress: EthereumContractAddress, 
        public tokenId: number, 
        public content: string) {}
}