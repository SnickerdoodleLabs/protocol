import {
  IpfsCID, QueryFormatError, SDQLString
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/AST_Evaluator";
import { IQueryRepository } from "@core/interfaces/business/utilities";
import { AST, SDQLParser } from "@snickerdoodlelabs/query-parser";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser;
  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
  makeAstEvaluator(
    cid: IpfsCID,
    ast: AST | null,
    queryRepository: IQueryRepository,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
