import {
  InvalidRegularExpression,
  ParserError,
} from "@snickerdoodlelabs/objects";

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
  return = "return",
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
  [/\$r[0-9]+/y, TokenType.return],
  [/\$c[0-9]+/y, TokenType.compensation],
  [/\$a[0-9]+/y, TokenType.ad],
  [/\s+/y, TokenType.whitespace],
  [/\w+/y, TokenType.string],
);
export class Tokenizer {
  /**
   * @remarks regex.lastIndex is reset to 0 when there is no match. So, we need to set it before any test. Also, regex can output a lastIndex which is out of range. So, first rule may invalidly fail
   */
  position = 0;
  private _hasNext = true;
  constructor(readonly exprStr: string, readonly debug: boolean = false) {
    if (this.exprStr.length == 0) {
      const err = new ParserError(
        this.position,
        "cannot parse empty expressions",
      );
      // console.error(err);
      throw err;
    }
    this.validateRules();
  }

  reset() {
    this.position = 0;
    this._hasNext = true;
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
      // if false, do nothing
    }

    const err = new ParserError(this.position, "No matching tokens found");
    // console.error(err);
    throw err;
  }

  all(): Array<Token> {
    const tokens = new Array<Token>();
    while (this.hasNext()) {
      tokens.push(this.next());
    }
    return tokens;
  }

  validateRules() {
    for (const rule of rules) {
      const rexp = rule[0];
      if (rexp.sticky != true) {
        const err = new InvalidRegularExpression(`${rexp} is not sticky`);
        // console.error(err);
        throw err;
      }
    }
  }

  convertVal(type: TokenType, rawVal: string) {
    switch (type) {
      case TokenType.number:
        return Number(rawVal);
      case TokenType.boolean:
        return Boolean(rawVal.toLowerCase());
      case TokenType.string:
        return String(rawVal);
      default:
        return rawVal;
    }
  }
}
