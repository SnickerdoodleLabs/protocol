import {
  IpfsCID,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { AST, SDQLParser } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

import { IAST_Evaluator } from "@core/interfaces/business/utilities/query/IAST_Evaluator.js";
import { IQueryRepository } from "@core/interfaces/business/utilities/query/IQueryRepository.js";

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
  ): IAST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
