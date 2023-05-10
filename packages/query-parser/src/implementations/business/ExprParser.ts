import {
  InvalidRegularExpression,
  MissingTokenConstructorError,
  ParserError,
  SDQL_Name,
  SDQL_OperatorName,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  AST_Ad,
  AST_BoolExpr,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_SubQuery,
  Command,
  Command_IF,
  Condition,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
  ConditionOperandTypes,
  ConditionOr,
  IfOperandTypes,
  ParserContextDataTypes,
  Token,
  TokenType,
  Tokenizer,
} from "@query-parser/index.js";

export class ExprParser {
  protected precedence: Map<TokenType, Array<TokenType>> = new Map();
  protected tokenToExpMap: Map<TokenType, Function> = new Map();
  protected id = 0;

  constructor(readonly context: Map<string, ParserContextDataTypes>) {
    const logicOps = [TokenType.and, TokenType.or];
    const compOps = [
      TokenType.gt,
      TokenType.gte,
      TokenType.lt,
      TokenType.lte,
      TokenType.eq,
    ];

    this.precedence.set(TokenType.parenthesisClose, [
      ...compOps,
      ...logicOps,
      TokenType.if,
      TokenType.then,
      TokenType.else,
    ]);

    logicOps.forEach((cond) =>
      this.precedence.set(cond, [...compOps, ...logicOps]),
    );
    compOps.forEach((cond) => this.precedence.set(cond, compOps));

    this.tokenToExpMap.set(TokenType.gt, this.createG);
    this.tokenToExpMap.set(TokenType.gte, this.createGE);
    this.tokenToExpMap.set(TokenType.lt, this.createL);
    this.tokenToExpMap.set(TokenType.lte, this.createLE);
    this.tokenToExpMap.set(TokenType.eq, this.createE);
    this.tokenToExpMap.set(TokenType.and, this.createAnd);
    this.tokenToExpMap.set(TokenType.or, this.createOr);
    this.tokenToExpMap.set(TokenType.if, this.createIf);

    // this.tokenToExpMap.set(TokenType.in, this.createIn);

    if (!this.context.has("dependencies")) {
      this.context.set("dependencies", new Map<string, Set<AST_SubQuery>>());
    }
  }

  // #region building ast
  public parse(
    exprStr: string,
  ): ResultAsync<AST_Expr | Command, ParserError | InvalidRegularExpression> {
    return new Tokenizer(exprStr).all().map((tokens) => {
      return this.tokensToAst(tokens); // TODO this to be result async, too.
    });
  }

  public tokensToAst(tokens: Token[]): AST_Expr | Command {
    const postFix = this.infixToPostFix(tokens);
    return this.buildAstFromPostfix(postFix);
  }

  // #region infix to postfix, $q1and$q2 -> $q1$q2and
  public infixToPostFix(infix: Token[]): Array<Token> {
    const stack: Array<Token> = [];
    const postFix: Array<Token> = [];

    for (const token of infix) {
      let popped: Array<Token> = [];
      switch (token.type) {
        case TokenType.number:
        case TokenType.string:
        case TokenType.boolean:
        case TokenType.ad:
        case TokenType.query:
        case TokenType.insight:
        case TokenType.compensation:
          postFix.push(token);
          break;

        case TokenType.if:
          stack.push(token);
          break;

        case TokenType.lt:
        case TokenType.lte:
        case TokenType.gt:
        case TokenType.gte:
        case TokenType.eq:
        case TokenType.and:
        case TokenType.or:
          // pop everything that has higher or equal precedence
          popped = this.popHigherEqTypes(stack, token);
          stack.push(token);
          postFix.push(...popped);
          break;

        case TokenType.parenthesisOpen:
          stack.push(token);
          break;
        case TokenType.parenthesisClose:
          popped = this.popHigherEqTypes(stack, token);
          postFix.push(...popped);
          const parenthesisOpen = stack.pop();
          if (parenthesisOpen?.type != TokenType.parenthesisOpen) {
            const e = new ParserError(
              token.position,
              "No matching opening parenthesis for this",
            );
            console.log(e);
            throw e;
          }
          break;

        case TokenType.then:
        case TokenType.else:
          popped = this.popBefore(stack, token, TokenType.if); // condition output
          postFix.push(...popped);

          break;
      }
    }

    postFix.push(...stack.reverse());
    return postFix;
  }

  public popHigherEqTypes(stack: Array<Token>, token: Token): Array<Token> {
    const popped = new Array<Token>();
    while (
      stack.length > 0 &&
      this.precedence.has(token.type) &&
      this.precedence.get(token.type)!.includes(stack[stack.length - 1].type)
    ) {
      popped.push(stack.pop() as Token);
    }
    return popped;
  }

  public popToType(
    stack: Array<Token>,
    token: Token,
    toType: TokenType,
  ): Array<Token> {
    const popped: Array<Token> = new Array<Token>();
    while (stack.length > 0) {
      const lastStackItem = stack.pop() as Token;
      popped.push(lastStackItem as Token);
      if (lastStackItem.type === toType) {
        return popped;
      }
    }

    const err = new ParserError(
      token.position,
      `Missing matching ${toType} for ${token.type}`,
    );
    console.error(err);
    throw err;
  }

  public popBefore(
    stack: Array<Token>,
    token: Token,
    toType: TokenType,
  ): Array<Token> {
    const popped = new Array<Token>();
    while (stack.length > 0) {
      const lastStackItem = stack.pop() as Token;
      if (lastStackItem.type === toType) {
        stack.push(lastStackItem);
        return popped;
      }
      popped.push(lastStackItem);
    }

    const err = new ParserError(
      token.position,
      `Missing matching ${toType} for ${token.type}`,
    );
    console.error(err);
    throw err;
  }
  // #endregion

  public buildAstFromPostfix(postFix: Array<Token>): AST_Expr | Command {
    const exprTypes: Array<TokenType> = [
        TokenType.query,
        TokenType.ad,
        TokenType.insight,
        TokenType.compensation,
        TokenType.number,
        TokenType.string,
        TokenType.boolean,
      ],
      expList: Array<ParserContextDataTypes> = [];

    for (const token of postFix) {
      if (exprTypes.includes(token.type)) {
        expList.push(this.getExecutableFromContext(token));
      } else {
        // we have a operator type
        const newExp: any = this.createExp(expList, token);

        if (!newExp) {
          const err = new ParserError(
            token.position,
            `Could not convert to ast ${token.val}`,
          );
          console.error(err);
          throw err;
        } else {
          expList.push(newExp);
        }
      }
    }

    const expr = expList.pop();
    if (typeof expr === "number") {
      console.log("ExprParser buildAstFromPostfix expr is number");
      return new AST_Expr(SDQL_Name("number"), expr as number);
    }
    if (typeof expr === "string") {
      console.log("ExprParser buildAstFromPostfix expr is string");
      return new AST_Expr(SDQL_Name("string"), expr as string);
    }
    if (typeof expr === "boolean") {
      console.log("ExprParser buildAstFromPostfix expr is boolean");
      return new AST_BoolExpr(SDQL_Name("boolean"), expr as boolean);
    }
    if (
      expr instanceof AST_SubQuery ||
      expr instanceof AST_Ad ||
      expr instanceof AST_Insight
    ) {
      return new AST_Expr(expr.name, expr);
    }

    return expr as AST_Expr | Command;
  }

  private getExecutableFromContext(token: Token): ParserContextDataTypes {
    let nameStr = "";
    switch (token.type) {
      case TokenType.ad:
      case TokenType.query:
      case TokenType.insight:
      case TokenType.compensation:
        nameStr = token.val.substring(1);
        break;
      case TokenType.number:
      case TokenType.string:
      case TokenType.boolean:
        return token.val;
      default:
        const err = new ParserError(
          token.position,
          `invalid executable type for ${token.val}`,
        );
        console.error(err);
        throw err;
    }

    const executable = this.context.get(nameStr);
    if (!executable) {
      const err = new ParserError(
        token.position,
        `no executable for token ${token.val} in the context`,
      );
      console.error(err);
      throw err;
    }

    return executable;
  }
  // #endregion

  private createIf(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): Command_IF {
    const conditionExpr = expList[0] as Condition | AST_SubQuery;
    const trueExpr = expList[1] as IfOperandTypes;
    const falseExpr = (
      expList.length > 2 ? expList[2] : null
    ) as IfOperandTypes;
    const id = this.getNextId(token.val);

    if (conditionExpr.constructor != AST_BoolExpr) {
      return new Command_IF(
        SDQL_Name(id),
        trueExpr!,
        falseExpr,
        new AST_BoolExpr(
          SDQL_Name(conditionExpr.name as string),
          conditionExpr,
        ),
      );
    }
    return new Command_IF(SDQL_Name(id), trueExpr!, falseExpr, conditionExpr);
  }

  private createExp(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_Expr {
    const evaluator = this.tokenToExpMap.get(token.type);
    if (evaluator) {
      return evaluator.apply(this, [expList, token]);
    } else {
      const err = new MissingTokenConstructorError(
        "No Token type constructor defined for " + token.type,
      );
      console.error(err);
      throw err;
    }
  }

  private createG(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionG(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createGE(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionGE(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createL(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionL(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createLE(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionLE(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createE(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionE(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createAnd(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionAnd(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private createOr(
    expList: Array<ParserContextDataTypes>,
    token: Token,
  ): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const rval = expList.pop() as ConditionOperandTypes;
    const lval = expList.pop() as ConditionOperandTypes;
    const condition = new ConditionOr(SDQL_OperatorName(id), lval, rval);
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  private getNextId(name: string) {
    this.id++;
    return `${name}${this.id}`;
  }
}
