import {
  MissingTokenConstructorError,
  ParserError,
  SDQL_Name,
  SDQL_OperatorName,
} from "@snickerdoodlelabs/objects";

import {
  Token,
  Tokenizer,
  TokenType,
} from "@query-parser/implementations/business/Tokenizer.js";
import {
  AST_Ad,
  AST_ConditionExpr,
  AST_Expr,
  AST_Query,
  AST_ReturnExpr,
  Command,
  Command_IF,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionL,
  ConditionLE,
  ConditionOr,
  ParserContextDataTypes,
} from "@query-parser/interfaces/index.js";

export class ExprParser {
  /**
   * Grammar:
   * IF ::= "if" WS Condition "then" WS Expr
   * IF ::= "if" WS Condition "then" WS Expr "else" WS Expr
   */

  protected precedence: Map<TokenType, Array<TokenType>> = new Map();
  protected id = 0;
  protected tokenToExpMap: Map<TokenType, Function> = new Map();

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
    ]); // TODO everything up to a opening parenthesis

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

    if (!this.context.has("dependencies")) {
      this.context.set("dependencies", new Map<string, Set<AST_Query>>());
    }
  }

  private getNextId(name: string) {
    this.id++;
    const nextId = `${name}${this.id}`;
    return nextId;
  }

  // #region building ast
  parse(exprStr: string): AST_Expr | Command {
    /**
     * Builds a AST expression or a command from the input string
     */
    const tokenizer = new Tokenizer(exprStr);
    const tokens = tokenizer.all();
    const ast = this.tokensToAst(tokens);
    return ast;
  }

  tokensToAst(tokens: Token[]): AST_Expr | Command {
    const postFix: Array<Token> = this.infixToPostFix(tokens);
    const ast = this.buildAstFromPostfix(postFix);
    return ast;
  }

  // #region infix to postfix, $q1and$q2 -> $q1$q2and
  infixToPostFix(infix: Token[]): Array<Token> {
    const stack: Array<Token> = [];
    const postFix: Array<Token> = [];
    for (const token of infix) {
      /**
       * if token is
       */
      let popped: Array<Token> = [];

      // Conver to a Map later.

      switch (token.type) {
        // when token is a literal or a variable
        case TokenType.number:
        case TokenType.ad:
        case TokenType.query:
        case TokenType.return:
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
          // pop up to the last open
          // console.log("stack before", stack);
          popped = this.popHigherEqTypes(stack, token);
          postFix.push(...popped);
          // console.log("popped", popped);
          // assume next pop has a opening one
          // TODO raise error if
          // console.log("stack after", stack);
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

    // pop all and add to the postFix

    postFix.push(...stack.reverse());

    return postFix;
  }

  popHigherEqTypes(stack: Array<Token>, token: Token): Array<Token> {
    /**
     * it pops everything that has higher or equal precedence as the token
     */
    const popped: Array<Token> = new Array<Token>();

    const precedence = this.precedence.get(token.type);
    if (precedence) {
      // console.log("precedence", precedence);
      // let lastStackItem = stack[stack.length - 1];
      while (stack.length > 0) {
        // console.log("peeking", stack[stack.length - 1]);
        if (precedence.includes(stack[stack.length - 1].type)) {
          const lastStackItem = stack.pop();
          popped.push(lastStackItem as Token);
        } else {
          break;
        }
      }
    }

    return popped;
  }

  popToType(
    stack: Array<Token>,
    token: Token,
    toType: TokenType,
  ): Array<Token> {
    /**
     * it pops everything that has higher or equal precedence as the token
     */
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

  popBefore(
    stack: Array<Token>,
    token: Token,
    toType: TokenType,
  ): Array<Token> {
    /**
     * it pops everything that has higher or equal precedence as the token
     */
    const popped: Array<Token> = new Array<Token>();
    while (stack.length > 0) {
      const lastStackItem = stack.pop() as Token;

      if (lastStackItem.type === toType) {
        stack.push(lastStackItem);
        return popped;
      } else {
        popped.push(lastStackItem as Token);
      }
    }

    const err = new ParserError(
      token.position,
      `Missing matching ${toType} for ${token.type}`,
    );
    console.error(err);
    throw err;
  }
  // #endregion

  buildAstFromPostfix(postFix: Array<Token>): AST_Expr | Command {
    const exprTypes: Array<TokenType> = [
      TokenType.ad,
      TokenType.query,
      TokenType.return,
      TokenType.compensation,
      TokenType.number,
      TokenType.string,
    ];

    let expList: Array<ParserContextDataTypes> = [];

    for (const token of postFix) {
      if (exprTypes.includes(token.type)) {
        const executable = this.getExecutableFromContext(token);
        expList.push(executable);
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
          expList = [newExp];
        }
      }
    }

    // const expr = expList.pop() as AST_Expr | Command;

    return expList.pop() as AST_Expr | Command;
  }

  createExp(expList, token: Token): AST_Expr {
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

  getExecutableFromContext(token: Token): ParserContextDataTypes {
    let nameStr = "";
    switch (token.type) {
      case TokenType.ad:
      case TokenType.query:
      case TokenType.return:
      case TokenType.compensation:
        nameStr = token.val.substring(1);
        break;
      case TokenType.number:
      case TokenType.string:
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

  createG(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionG(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createGE(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionGE(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createL(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionL(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createLE(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionLE(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createE(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionE(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createAnd(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionAnd(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    const and = new AST_ConditionExpr(SDQL_Name(id), condition);
    // console.log('and constructed to', and);
    return and;
  }

  createOr(expList: Array<any>, token: Token): AST_ConditionExpr {
    const id = this.getNextId(token.val);
    const condition = new ConditionOr(
      SDQL_OperatorName(id),
      expList[0],
      expList[1],
    );
    return new AST_ConditionExpr(SDQL_Name(id), condition);
  }

  createIf(expList: Array<any>, token: Token): Command_IF {
    let conditionExpr = expList[0];
    const trueExpr = expList[1];
    const falseExpr = expList.length > 2 ? expList[2] : null;

    if (conditionExpr) {
      if (conditionExpr.constructor != AST_ConditionExpr) {
        conditionExpr = new AST_ConditionExpr(
          conditionExpr.name,
          conditionExpr,
        );
      }
    }

    const id = this.getNextId(token.val);
    return new Command_IF(SDQL_Name(id), trueExpr, falseExpr, conditionExpr);
  }
  // #endregion

  // #region parse dependencies only

  getQueryDependencies(exprStr: string): AST_Query[] {
    const tokenizer = new Tokenizer(exprStr);
    const tokens = tokenizer.all();

    const deps: AST_Query[] = [];

    tokens.reduce((deps, token) => {
      if (token.type == TokenType.query) {
        deps.push(this.getExecutableFromContext(token) as AST_Query);
      } else if (token.type == TokenType.return) {
        const r = this.getExecutableFromContext(token) as AST_ReturnExpr;
        if (r.source instanceof AST_Query) {
          deps.push(r.source);
        }
      }
      return deps;
    }, deps);

    return deps;
  }

  getAdDependencies(exprStr: string): AST_Ad[] {
    const tokenizer = new Tokenizer(exprStr);
    const tokens = tokenizer.all();

    const deps: AST_Ad[] = [];

    tokens.reduce((deps, token) => {
      if (token.type == TokenType.ad) {
        deps.push(this.getExecutableFromContext(token) as AST_Ad);
      }
      return deps;
    }, deps);

    return deps;
  }
  // #endregion
}
