import {
  DataPermissions,
  IpfsCID,
  QueryFormatError,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { SDQLParser } from "@snickerdoodlelabs/query-parser";
import { ResultAsync } from "neverthrow";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/index.js";

export interface IQueryFactories {
  makeParser(cid: IpfsCID, schemaString: SDQLString): SDQLParser;
  makeParserAsync(
    cid: IpfsCID,
    schemaString: SDQLString,
  ): ResultAsync<SDQLParser, QueryFormatError>;
  makeAstEvaluator(
    cid: IpfsCID,
    dataPermissions: DataPermissions,
  ): AST_Evaluator;
}

export const IQueryFactoriesType = Symbol.for("IQueryFactories");
