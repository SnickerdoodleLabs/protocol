import "reflect-metadata";

import {
  ChainId,
  ESDQLQueryReturn,
  IpfsCID,
  ISDQLConditionString,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import {
  ExprParser,
  QueryObjectFactory,
  SDQLParser,
} from "@query-parser/implementations";
import {
  AST_Compensation,
  AST_PropertyQuery,
  AST_Return,
  AST_ReturnExpr,
  ParserContextDataTypes,
} from "@query-parser/interfaces";
import { AST_RequireExpr } from "@query-parser/interfaces/objects/AST_RequireExpr";
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

  public createPropQuery(queryName: string): AST_PropertyQuery {
    return new AST_PropertyQuery(
      SDQL_Name(queryName),
      ESDQLQueryReturn.String,
      "age",
      [],
      [],
    );
  }

  public createReturnQuery(queryName: string): AST_Return {
    return new AST_Return(SDQL_Name(queryName), "hello");
  }

  public createCompensation(name: string): AST_Compensation {
    return new AST_Compensation(
      SDQL_Name(name),
      "",
      new AST_RequireExpr(SDQL_Name(name), true),
      ISDQLConditionString("True"),
      ChainId(1),
      {
        parameters: [],
        data: {},
      },
      [],
    );
  }

  public createFakeContext(): Map<string, ParserContextDataTypes> {
    const fakeContext = td.object<Map<string, ParserContextDataTypes>>();

    td.when(fakeContext.get(td.matchers.contains("q1"))).thenReturn(
      this.createPropQuery("q1"),
    );
    td.when(fakeContext.get(td.matchers.contains("q2"))).thenReturn(
      this.createPropQuery("q2"),
    );
    td.when(fakeContext.get(td.matchers.contains("q3"))).thenReturn(
      this.createPropQuery("q3"),
    );
    td.when(fakeContext.get(td.matchers.contains("q4"))).thenReturn(
      this.createPropQuery("q4"),
    );
    td.when(fakeContext.get(td.matchers.contains("c1"))).thenReturn(
      this.createCompensation("c1"),
    );
    td.when(fakeContext.get(td.matchers.contains("c2"))).thenReturn(
      this.createCompensation("c2"),
    );
    this.context = fakeContext;
    return fakeContext;
  }

  public createExprParser(
    context: Map<string, ParserContextDataTypes> | null,
  ): ResultAsync<ExprParser, Error> {
    if (context != null) {
      this.context = context;
      return okAsync(new ExprParser(context));
    } else {
      return okAsync(new ExprParser(this.createFakeContext()));
    }
    // return this.createContext().andThen((context) => {
    //   this.context = context;
    //   return okAsync(new ExprParser(context));
    // });
  }
}
