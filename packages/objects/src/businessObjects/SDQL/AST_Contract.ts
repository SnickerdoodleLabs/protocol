import { ChainId, EVMBlockRange, EVMContractAddress, EVMContractFunction, EVMToken } from "@objects/primitives";
import { EVMContractDirection } from "@objects/primitives/EVMContractDirection";

export class AST_Contract {
    constructor(
        
        readonly networkId: ChainId,
        readonly address: EVMContractAddress,
        readonly _function: EVMContractFunction,
        readonly direction: EVMContractDirection,
        readonly token: EVMToken,
        readonly blockrange: EVMBlockRange

    ) {}
}