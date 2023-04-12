import {
  InvalidRegularExpression,
  ParserError,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

export enum TokenType {
  if = "if",
  else = "else",
  then = "then",
  and = "and",
  or = "or",
  query = "query",
  gt = ">",
  gte = ">=",
  lt = "<",
  lte = "<=",
  eq = "==",
  insight = "insight",
  compensation = "compensation",
  ad = "ad",
  parenthesisOpen = "parenthesisOpen",
  parenthesisClose = "parenthesisClose",
  number = "number",
  url = "url",
  string = "string",
  whitespace = "whitespace",
  boolean = "boolean",
}

export class Token {
  constructor(
    readonly type: TokenType,
    readonly val: any,
    readonly position: number,
  ) {}
}

const rules = new Array<[RegExp, TokenType]>();
// Order matters. The string rule should be the last one for unambiguous parsing.
rules.push(
  [/if/y, TokenType.if],
  [/else/y, TokenType.else],
  [/then/y, TokenType.then],
  [/\(/y, TokenType.parenthesisOpen],
  [/\)/y, TokenType.parenthesisClose],
  [/and/y, TokenType.and],
  [/or/y, TokenType.or],
  [/\d+/y, TokenType.number],
  [/true|false/iy, TokenType.boolean],
  [/\$q[0-9]+/y, TokenType.query],
  [/\>(?!=)/y, TokenType.gt],
  [/\>=/y, TokenType.gte],
  [/\<(?!=)/y, TokenType.lt],
  [/\<=/y, TokenType.lte],
  [/==/y, TokenType.eq],
  [/\$i[0-9]+/y, TokenType.insight],
  [/\$c[0-9]+/y, TokenType.compensation],
  [/\$a[0-9]+/y, TokenType.ad],
  [/\s+/y, TokenType.whitespace],
  // [/["']{1}.*["']{1}/y, TokenType.string],
  // [/'{1}.*(?<=\\)'{1}/y, TokenType.string], //match unescaped character.
  // [/["']{1}[A-Za-z0-9_ ]*["']{1}/y, TokenType.string],
  [/'{1}[A-Za-z0-9_ ]*'{1}/y, TokenType.string],
  [/"{1}[A-Za-z0-9_ ]*"{1}/y, TokenType.string],
);
export class Tokenizer {
  /**
   * @remarks regex.lastIndex is reset to 0 when there is no match. So, we need to set it before any test. Also, regex can output a lastIndex which is out of range. So, first rule may invalidly fail
   */
  position = 0;
  private _hasNext = true;
  constructor(readonly exprStr: string, readonly debug: boolean = false) {
    // if (this.exprStr.length == 0) {
    //   const err = new ParserError(
    //     this.position,
    //     "cannot parse empty expressions",
    //   );
    //   // console.error(err);
    //   throw err;
    // }
    // this.validateRules(); it went to all method.
  }

  reset() {
    this.position = 0;
    if (this.exprStr.length == 0) {
      this._hasNext = false;
    } else {
      this._hasNext = true;
    }
  }

  hasNext(): boolean {
    return this._hasNext;
  }

  next(): Token {
    if (!this.hasNext()) {
      const err = new ParserError(this.position, "no more tokens");
      // console.error(err);
      throw err;
    }
    for (const rule of rules) {
      const rexp = rule[0];
      const tokenType = rule[1];
      rexp.lastIndex = this.position; // search from this position
      if (this.debug) {
        console.log("searching at", rexp.lastIndex);
        console.log("testing regex", rexp);
      }
      // if test True, extract from stream, set position to lastIndex if lastIndex is < len, finish otherwise

      const token = this.getTokenByRule(rexp, tokenType);
      if (token != null) {
        return token;
      }
      // if false, do nothing
    }

    const err = new ParserError(
      this.position,
      `No matching tokens found at ${this.exprStr.slice(this.position)} of ${
        this.exprStr
      }`,
    );
    // console.error(err);
    throw err;
  }

  public getTokenByRule(rexp: RegExp, tokenType: TokenType): Token | null {
    if (rexp.test(this.exprStr)) {
      if (this.debug) {
        console.log(`found token at ${this.position}, ${rexp.lastIndex}`);
      }
      const rawVal = this.exprStr.slice(this.position, rexp.lastIndex);
      const tokenVal = this.convertVal(tokenType, rawVal);
      const token = new Token(tokenType, tokenVal, this.position);
      if (rexp.lastIndex >= this.exprStr.length) {
        this._hasNext = false;
        this.position = 0;
      } else {
        this.position = rexp.lastIndex;
      }

      return token;
    }

    return null;
  }

  public all(): ResultAsync<
    Array<Token>,
    ParserError | InvalidRegularExpression
  > {
    return this.validateRules().andThen(() => {
      try {
        const tokens = new Array<Token>();
        while (this.hasNext()) {
          tokens.push(this.next());
        }
        return okAsync(tokens);
      } catch (err) {
        return errAsync(err as ParserError);
      }
    });
  }

  validateRules(): ResultAsync<void, InvalidRegularExpression> {
    for (const rule of rules) {
      const rexp = rule[0];
      if (rexp.sticky != true) {
        const err = new InvalidRegularExpression(`${rexp} is not sticky`);
        // console.error(err);
        return errAsync(err);
      }
    }
    return okAsync(undefined);
  }

  convertVal(type: TokenType, rawVal: string): unknown {
    switch (type) {
      case TokenType.number:
        return +rawVal;
      case TokenType.boolean:
        return Boolean(rawVal.toLowerCase() == "true");
      case TokenType.string:
        const rawStrippedQuotes = rawVal.slice(1, rawVal.length - 1);
        return rawStrippedQuotes;
      default:
        return rawVal;
    }
  }
}
