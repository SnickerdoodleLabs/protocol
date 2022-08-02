import "reflect-metadata";

import { ParserError } from "@snickerdoodlelabs/objects";

import {
  Tokenizer,
  TokenType,
} from "@core/implementations/business/utilities/query";

describe("Tokenizer", () => {

  test("12 is a number", function () {
    const tokenizer = new Tokenizer("12");

    expect(tokenizer.hasNext()).toBe(true);
    while (tokenizer.hasNext()) {
      const token = tokenizer.next();
      expect(token.val).toBe(12);
      expect(token.type).toBe(TokenType.number);
      // console.log("token value", token.val)

      expect(tokenizer.position).toBe(0);
      expect(tokenizer.hasNext()).toBe(false);
    }

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("12 25 are two numbers", function () {
    const tokenizer = new Tokenizer("12 25");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues: Array<number> = [12, 25];
    const gotValues = new Array<number>();

    while (tokenizer.hasNext()) {
      const token = tokenizer.next();
      if (token.type === TokenType.number) {
        gotValues.push(token.val);
      }

      // console.log("token value", token.val)
    }
    // console.log("gotValues", gotValues);

    expect(gotValues).toEqual(expectedValues);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test.only("if($q1and$q2)then$r1else$r2", function () {
    const tokenizer = new Tokenizer("if($q1and$q2)then$r1else$r2");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues: Array<any> = [
      "if",
      "(",
      "$q1",
      "and",
      "$q2",
      ")",
      "then",
      "$r1",
      "else",
      "$r2",
    ];
    const expectedTypes: Array<any> = [
      TokenType.if,
      TokenType.parenthesisOpen,
      TokenType.query,
      TokenType.and,
      TokenType.query,
      TokenType.parenthesisClose,
      TokenType.then,
      TokenType.return,
      TokenType.else,
      TokenType.return,
    ];
    const gotValues = new Array<any>();
    const gotTypes = new Array<any>();

    while (tokenizer.hasNext()) {
      const token = tokenizer.next();
      gotValues.push(token.val);
      gotTypes.push(token.type);

      // console.log("token value", token.val)
    }
    // console.log("gotValues", gotValues);
    // console.log("gotTypes", gotTypes);

    expect(gotValues).toEqual(expectedValues);
    expect(gotTypes).toEqual(expectedTypes);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });
});
