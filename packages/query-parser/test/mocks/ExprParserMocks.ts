import "reflect-metadata";

import { IpfsCID } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ExprParser,
  QueryObjectFactory,
  SDQLParser,
} from "@query-parser/implementations";
import { ParserContextDataTypes } from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData/avalanche1.data";
import { SDQLQueryWrapperMocks } from "@query-parser-test/mocks";

export class ExprParserMocks {
  public wrapperMocks = new SDQLQueryWrapperMocks();
  public schema = this.wrapperMocks.makeQueryWrapper(avalanche1SchemaStr);
  readonly parser = new SDQLParser(
    IpfsCID("0"),
    this.schema,
    new QueryObjectFactory(),
  );

  public context: Map<string, ParserContextDataTypes> | null = null;

  public createContext(): ResultAsync<
    Map<string, ParserContextDataTypes>,
    Error
  > {
    return this.parser.buildAST().andThen((ast) => {
      return okAsync(this.parser.context);
    });
  }

  public createExprParser(
    context: Map<string, ParserContextDataTypes> | null,
  ): ResultAsync<ExprParser, Error> {
    if (context != null) {
      this.context = context;
      return okAsync(new ExprParser(context));
    }
    return this.createContext().andThen((context) => {
      this.context = context;
      return okAsync(new ExprParser(context));
    });
  }
}
