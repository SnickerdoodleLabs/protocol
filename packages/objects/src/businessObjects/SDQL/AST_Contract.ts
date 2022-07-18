import { ChainId, EVMBlockNumber, EVMBlockRange, EVMContractAddress, EVMContractFunction, EVMToken } from "@objects/primitives";
import { EVMContractDirection } from "@objects/primitives/EVMContractDirection";

export class AST_Contract {
    constructor(
        
        readonly networkId: ChainId,
        readonly address: EVMContractAddress,
        readonly func: EVMContractFunction,
        readonly direction: EVMContractDirection,
        readonly token: EVMToken,
        readonly blockrange: EVMBlockRange

    ) {}

    
    static fromSchema(schema: any): AST_Contract {
        
        // console.log("Contract schema", schema);

        let direction = EVMContractDirection.To;
        if (schema.direction == "from") {
            direction = EVMContractDirection.From;
        }
        return new AST_Contract(
            ChainId(Number(schema.networkid)),
            EVMContractAddress(schema.address),
            EVMContractFunction(schema.function),
            direction,
            EVMToken(schema.token),
            EVMBlockRange.fromString(schema.blockrange)

        );

    }
}