import {
  PersistenceError,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_BlockchainTransactionQuery,
  AST_Web3Query,
  AST_NftQuery,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import {  ResultAsync } from "neverthrow";

import {
  IBlockchainTransactionQueryEvaluatorType,
  IBlockchainTransactionQueryEvaluator,
  INftQueryEvaluatorType,
  INftQueryEvaluator,
  IWeb3QueryEvaluator
} from "@core/interfaces/business/utilities/index.js";

@injectable()
export class Web3QueryEvaluator implements IWeb3QueryEvaluator {
  constructor(
    @inject(IBlockchainTransactionQueryEvaluatorType)
    protected blockchainTransactionQueryEvaluator: IBlockchainTransactionQueryEvaluator,
    @inject(INftQueryEvaluatorType)
    protected nftEvaluator: INftQueryEvaluator,
  ) {}

  public eval(
    query: AST_Web3Query,
  ): ResultAsync<SDQL_Return, PersistenceError> {
    const { name, schema, type } = query;
    switch (type) {
      case "nft":
        return this.nftEvaluator.eval(AST_NftQuery.fromWeb3Query(query));

      case "blockchain_transactions":
        return this.blockchainTransactionQueryEvaluator.eval(
          AST_BlockchainTransactionQuery.fromSchema(name, schema),
        );
    }
    
  }
}
