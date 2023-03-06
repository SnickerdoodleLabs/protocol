import "reflect-metadata";

import { ParserError } from "@snickerdoodlelabs/objects";

import {
  Tokenizer,
  TokenType,
} from "@query-parser/implementations/business/Tokenizer";

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
    }

    expect(gotValues).toEqual(expectedValues);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("> can be identified.", function () {
    const tokenizer = new Tokenizer("12>25");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues = [12, ">", 25];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gotValues: any[] = [];
    while (tokenizer.hasNext()) gotValues.push(tokenizer.next().val);

    expect(gotValues).toEqual(expectedValues);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test(">, >=, and == do not interfere", function () {
    const tokenizer = new Tokenizer(">>===");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues = [">", ">=", "=="];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gotValues: any[] = [];
    while (tokenizer.hasNext()) gotValues.push(tokenizer.next().val);

    expect(gotValues).toEqual(expectedValues);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("if($q1>30)then$r1", function () {
    const tokenizer = new Tokenizer("if$q1>30then$r1");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues = ["if", "$q1", ">", 30, "then", "$r1"];
    const expectedTypes = [
      TokenType.if,
      TokenType.query,
      TokenType.gt,
      TokenType.number,
      TokenType.then,
      TokenType.return,
    ];

    const gotValues = new Array<any>();
    const gotTypes = new Array<any>();

    while (tokenizer.hasNext()) {
      const token = tokenizer.next();
      gotValues.push(token.val);
      gotTypes.push(token.type);
    }

    expect(gotValues).toEqual(expectedValues);
    expect(gotTypes).toEqual(expectedTypes);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("if$q1>=30then$r1", function () {
    const tokenizer = new Tokenizer("if$q1>=30then$r1");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues = ["if", "$q1", ">=", 30, "then", "$r1"];
    const expectedTypes = [
      TokenType.if,
      TokenType.query,
      TokenType.gte,
      TokenType.number,
      TokenType.then,
      TokenType.return,
    ];

    const gotValues = new Array<any>();
    const gotTypes = new Array<any>();
    while (tokenizer.hasNext()) {
      const token = tokenizer.next();
      gotValues.push(token.val);
      gotTypes.push(token.type);
    }

    expect(gotValues).toEqual(expectedValues);
    expect(gotTypes).toEqual(expectedTypes);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("if($q1>30)==($q1<35)then$r1", function () {
    const tokenizer = new Tokenizer("if($q1>30)==($q1<35)then$r1");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues: Array<any> = [
      "if",
      "(",
      "$q1",
      ">",
      30,
      ")",
      "==",
      "(",
      "$q1",
      "<",
      35,
      ")",
      "then",
      "$r1",
    ];

    const gotValues = new Array<any>();

    while (tokenizer.hasNext()) gotValues.push(tokenizer.next().val);

    expect(gotValues).toEqual(expectedValues);
    expect(tokenizer.hasNext()).toBe(false);

    expect(() => tokenizer.next()).toThrow(
      new ParserError(0, "no more tokens"),
    );
  });

  test("if($q1and$q2)then$r1else$r2", function () {
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

  test.only("if($q1>35and$q2<40)then$r1else$r2", function () {
    const tokenizer = new Tokenizer("if($q1>35and$q2<40)then$r1else$r2");
    expect(tokenizer.hasNext()).toBe(true);

    const expectedValues: Array<string | number> = [
      "if",
      "(",
      "$q1",
      ">",
      35,
      "and",
      "$q2",
      "<",
      40,
      ")",
      "then",
      "$r1",
      "else",
      "$r2",
    ];
    const expectedTypes: Array<TokenType> = [
      TokenType.if,
      TokenType.parenthesisOpen,
      TokenType.query,
      TokenType.gt,
      TokenType.number,
      TokenType.and,
      TokenType.query,
      TokenType.lt,
      TokenType.number,
      TokenType.parenthesisClose,
      TokenType.then,
      TokenType.return,
      TokenType.else,
      TokenType.return,
    ];
    const gotValues = new Array<unknown>();
    const gotTypes = new Array<TokenType>();

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
