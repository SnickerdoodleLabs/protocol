import "reflect-metadata";

import { ParserError } from "@snickerdoodlelabs/objects";

import {
  Tokenizer,
  TokenType,
} from "@query-parser/implementations/business/Tokenizer";

function testExpectedValues(expr: string, expectedValues: Array<unknown>) {
  const tokenizer = new Tokenizer(expr);
  expect(tokenizer.hasNext()).toBe(true);
  const gotValues = new Array<number>();

  while (tokenizer.hasNext()) {
    const token = tokenizer.next();
    gotValues.push(token.val);
  }

  console.log(gotValues);
  expect(gotValues).toEqual(expectedValues);

  expect(tokenizer.hasNext()).toBe(false);

  expect(() => tokenizer.next()).toThrow(new ParserError(0, "no more tokens"));
}

function testExpectedValuesAndTypes(
  expr: string,
  expectedValues: Array<unknown>,
  expectedTypes: Array<TokenType>,
) {
  const tokenizer = new Tokenizer(expr);
  expect(tokenizer.hasNext()).toBe(true);

  const gotValues = new Array<unknown>();
  const gotTypes = new Array<TokenType>();

  while (tokenizer.hasNext()) {
    const token = tokenizer.next();
    gotValues.push(token.val);
    gotTypes.push(token.type);
  }

  expect(gotValues).toEqual(expectedValues);
  expect(gotTypes).toEqual(expectedTypes);

  expect(tokenizer.hasNext()).toBe(false);

  expect(() => tokenizer.next()).toThrow(new ParserError(0, "no more tokens"));
}

describe("Tokenizer type tests", () => {
  test("12 is a number", function () {
    const expr = "12";
    const expectedValues = [12];
    const expectedTypes = [TokenType.number];
    testExpectedValues(expr, expectedValues);
  });

  test("12 25 are two numbers", function () {
    const expr = "12 25";
    const expectedValues: Array<unknown> = [12, " ", 25];
    testExpectedValues(expr, expectedValues);
  });

  test("> can be identified.", function () {
    const expr = "12>25";
    const expectedValues = [12, ">", 25];
    testExpectedValues(expr, expectedValues);
  });

  test(">, >=, and == do not interfere", function () {
    const expr = ">>===";
    const expectedValues = [">", ">=", "=="];
    testExpectedValues(expr, expectedValues);
  });

  test("'s' 'is' 'string'", function () {
    const expr = "'s' 'is' 'string'";
    const expectedValues = ["s", " ", "is", " ", "string"];
    const expectedTypes = [
      TokenType.string,
      TokenType.whitespace,
      TokenType.string,
      TokenType.whitespace,
      TokenType.string,
    ];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });

  test("true or False", function () {
    const expr = "true or False";
    const expectedValues = [true, " ", "or", " ", false];
    const expectedTypes = [
      TokenType.boolean,
      TokenType.whitespace,
      TokenType.or,
      TokenType.whitespace,
      TokenType.boolean,
    ];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });
});

describe("Tokenizer expression tests", () => {
  test("if($q1>30)then$r1", function () {
    const expr = "if$q1>30then$r1";

    const expectedValues = ["if", "$q1", ">", 30, "then", "$r1"];
    const expectedTypes = [
      TokenType.if,
      TokenType.query,
      TokenType.gt,
      TokenType.number,
      TokenType.then,
      TokenType.return,
    ];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });

  test("if$q1>=30then$r1", function () {
    const expr = "if$q1>=30then$r1";

    const expectedValues = ["if", "$q1", ">=", 30, "then", "$r1"];
    const expectedTypes = [
      TokenType.if,
      TokenType.query,
      TokenType.gte,
      TokenType.number,
      TokenType.then,
      TokenType.return,
    ];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });

  test("if($q1>30)==($q1<35)then$r1", function () {
    const expr = "if($q1>30)==($q1<35)then$r1";

    const expectedValues: Array<unknown> = [
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

    testExpectedValues(expr, expectedValues);
  });

  test("if($q1and$q2)then$r1else$r2", function () {
    const expr = "if($q1and$q2)then$r1else$r2";

    const expectedValues: Array<unknown> = [
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
    const expectedTypes: Array<TokenType> = [
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
    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });

  test("if($q1>35and$q2<40)then$r1else$r2", function () {
    const expr = "if($q1>35and$q2<40)then$r1else$r2";

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
    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });

  test("$q3=='US'", function () {
    const expr = "$q3=='US'";
    const expectedValues = ["$q3", "==", "US"];
    const expectedTypes = [TokenType.query, TokenType.eq, TokenType.string];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });
});
