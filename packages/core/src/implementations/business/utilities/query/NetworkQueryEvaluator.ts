import { INetworkQueryEvaluator } from "@core/interfaces/business/utilities/query/INetworkQueryEvaluator";
import {
  EVMAccountAddress,
  EVMTransactionFilter,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import { AST_NetworkQuery } from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

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
    // TODO: Start and end should be timestamps not specific block number
    const startTime = query.contract.blockrange.start;
    const endTime = query.contract.blockrange.end;

    const filter = new EVMTransactionFilter(
      [chainId],
      [address],
      undefined,
      undefined,
      undefined,
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
          // console.log("Network Query Result: ", transactions);
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
