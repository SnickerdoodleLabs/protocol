import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdContent,
  ChainId,
  EAdContentType,
  EAdDisplayType,
  ESDQLQueryReturn,
  IpfsCID,
  ISDQLConditionString,
  ISDQLExpressionString,
  SDQL_Name,
  SDQLQuery,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";
import * as td from "testdouble";

import {
  ExprParser,
  QueryObjectFactory,
  SDQLParser,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations";
import {
  AST_Ad,
  AST_Compensation,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_RequireExpr,
  ParserContextDataTypes,
} from "@query-parser/interfaces";
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

  public createContext(): ResultAsync<
    Map<string, ParserContextDataTypes>,
    Error
  > {
    return this.parser.buildAST().andThen((ast) => {
      return okAsync(this.parser.context);
    });
  }

  public createAd(name: string): AST_Ad {
    return new AST_Ad(
      SDQL_Name(name),
      SDQL_Name(name),
      new AdContent(EAdContentType.IMAGE, IpfsCID("")),
      "e",
      EAdDisplayType.BANNER,
      3,
      UnixTimestamp(0),
      ["a"],
      new AST_ConditionExpr(SDQL_Name(name), true),
      ISDQLConditionString("true"),
    );
  }

  public createInsight(name: string): AST_Insight {
    return new AST_Insight(
      SDQL_Name(name),
      new AST_ConditionExpr(SDQL_Name(name), true),
      ISDQLConditionString("true"),
      new AST_Expr(SDQL_Name(name), "e"),
      ISDQLExpressionString("e"),
    );
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
    td.when(fakeContext.get(td.matchers.contains("i1"))).thenReturn(
      this.createInsight("i1"),
    );
    td.when(fakeContext.get(td.matchers.contains("a1"))).thenReturn(
      this.createAd("a1"),
    );
    td.when(fakeContext.get(td.matchers.contains("a2"))).thenReturn(
      this.createAd("a2"),
    );
    td.when(fakeContext.get(td.matchers.contains("a3"))).thenReturn(
      this.createAd("a3"),
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
