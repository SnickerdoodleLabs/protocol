import { IpfsCID } from "@snickerdoodlelabs/objects";

import { AST_Evaluator, SDQLParser } from "@core/implementations/business";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { AST } from "@core/interfaces/objects";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: string): SDQLParser;
  makeAstEvaluator(
    cid: IpfsCID,
    ast: AST | null,
    queryRepository: IQueryRepository,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
