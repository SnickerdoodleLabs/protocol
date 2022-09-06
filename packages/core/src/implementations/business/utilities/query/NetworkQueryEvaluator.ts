import {
ChainId,
EvalNotImplementedError,
EVMAccountAddress,
EVMContractAddress,
EVMTransactionFilter,
IDataWalletPersistence,
IDataWalletPersistenceType,
ITokenBalance,
PersistenceError,
SDQL_Return,
TickerSymbol,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
AST_BalanceQuery,
AST_NetworkQuery,
ConditionE,
ConditionG,
ConditionGE,
ConditionL,
ConditionLE,
} from "@core/interfaces/objects";
import { INetworkQueryEvaluator } from "@core/interfaces/business/utilities/query/INetworkQueryEvaluator";
  
@injectable()
export class NetworkQueryEvaluator implements INetworkQueryEvaluator {
constructor(
    @inject(IDataWalletPersistenceType)
    protected dataWalletPersistence: IDataWalletPersistence,
) {}

public eval(
    query: AST_NetworkQuery,
): ResultAsync<SDQL_Return, PersistenceError> {

    const result = SDQL_Return(false);
    const chainId = query.contract.networkId;
    const address = query.contract.address as EVMAccountAddress;
    const hash = "";
    const startTime = query.contract.blockrange.start;
    const endTime = query.contract.blockrange.end;

    const filter = new EVMTransactionFilter(
        [chainId],
        [address],
        [hash],
        startTime,
        endTime,
    );

    if (query.returnType == "object") {
        return this.dataWalletPersistence
        .getEVMTransactions(filter)
        .andThen((transactions) => {
            // console.log("Network Query Result: ", transactions)
            if (transactions == null) {
            return okAsync(
                SDQL_Return({
                networkId: chainId,
                address: address,
                return: false,
                }),
            );
            }
            if (transactions.length == 0) {
            return okAsync(
                SDQL_Return({
                networkId: chainId,
                address: address,
                return: false,
                }),
            );
            }

            return okAsync(
            SDQL_Return({
                networkId: chainId,
                address: address,
                return: true,
            }),
            );
        });
    } else if (query.returnType == "boolean") {
        return this.dataWalletPersistence
        .getEVMTransactions(filter)
        .andThen((transactions) => {
            // console.log("Network Query Result: ", transactions)
            if (transactions == null) {
            return okAsync(SDQL_Return(false));
            }
            if (transactions.length == 0) {
            return okAsync(SDQL_Return(false));
            }

            return okAsync(SDQL_Return(true));
        });
    }

    return okAsync(SDQL_Return(false));
}
}
