import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { IpfsCID, SDQLQuery } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ExprParser,
  QueryObjectFactory,
  SDQLParser,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations";
import { ParserContextDataTypes } from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData/avalanche1.data";

const cid = IpfsCID("0");
export class ExprParserMocks {
  public timeUtils = new TimeUtils();
  public sdqlQueryWrapperFactory = new SDQLQueryWrapperFactory(this.timeUtils);
  public schema = this.sdqlQueryWrapperFactory.makeWrapper(
    new SDQLQuery(cid, avalanche1SchemaStr),
  );
  readonly parser = new SDQLParser(cid, this.schema, new QueryObjectFactory());

  public context: Map<string, ParserContextDataTypes> | null = null;

  public createContext(): ResultAsync<void, Error> {
    return this.parser.buildAST().andThen((ast) => {
      this.context = this.parser.context;
      return okAsync(undefined);
    });
  }

  public createExprParser(): ResultAsync<ExprParser, Error> {
    return this.createContext().andThen(() => {
      return okAsync(new ExprParser(this.context!));
    });
  }
}
