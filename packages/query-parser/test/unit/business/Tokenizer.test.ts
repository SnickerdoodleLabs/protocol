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
  test("($q1>30)==($q1<35)", function () {
    const expr = "($q1>30)==($q1<35)";

    const expectedValues: Array<unknown> = [
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
    ];

    testExpectedValues(expr, expectedValues);
  });

  test("$q3=='United States'", function () {
    const expr = "$q3=='United States'";
    const expectedValues = ["$q3", "==", "United States"];
    const expectedTypes = [TokenType.query, TokenType.eq, TokenType.string];

    testExpectedValuesAndTypes(expr, expectedValues, expectedTypes);
  });
});
