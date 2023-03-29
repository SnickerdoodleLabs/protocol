import "reflect-metadata";

import {
  ExprParser,
  Token,
  Tokenizer,
  TokenType,
} from "@query-parser/implementations";
import { ParserContextDataTypes } from "@query-parser/interfaces";

describe("Expressions to Postfix", () => {
  // test("$r1 -> $r1", () => {
  //   const tokenizer = new Tokenizer("$r1");
  //   const tokens = tokenizer.all();
  //   const expectedTokens = [new Token(TokenType.return, "$r1", 0)];

  //   expect(tokens).toEqual(expectedTokens);

  //   const context: Map<string, ParserContextDataTypes> = new Map();

  //   const exprParser = new ExprParser(context);

  //   const postfixTokens = exprParser.infixToPostFix(tokens);
  //   const expectedPostfixTokens = [new Token(TokenType.return, "$r1", 0)];

  //   // console.log("tokens", tokens);
  //   // console.log("postfixTokens", postfixTokens);

  //   expect(postfixTokens).toEqual(expectedPostfixTokens);
  // });

  test("$q1and$q2 -> $q1$q2and", () => {
    const tokenizer = new Tokenizer("$q1and$q2");
    const tokens = tokenizer.all();
    const expectedTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.and, "and", 3),
      new Token(TokenType.query, "$q2", 6),
    ];

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 6),
      new Token(TokenType.and, "and", 3),
    ];

    // console.log("tokens", tokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("$q1>$q2 -> $q1$q2>", () => {
    const tokens = new Tokenizer("$q1>$q2").all();
    expect(tokens).toEqual([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.gt, ">", 3),
      new Token(TokenType.query, "$q2", 4),
    ]); // TODO, irfan needs to move it to the right place. This is the wrong place.

    const context: Map<string, ParserContextDataTypes> = new Map();
    const exprParser = new ExprParser(context);
    const postfixTokens = exprParser.infixToPostFix(tokens);

    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 4),
      new Token(TokenType.gt, ">", 3),
    ]);
  });

  test("$q1and$q2or$q3 -> $q1$q2andq3or", () => {
    const tokenizer = new Tokenizer("$q1and$q2or$q3");
    const tokens = tokenizer.all();
    const expectedTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.and, "and", 3),
      new Token(TokenType.query, "$q2", 6),
      new Token(TokenType.or, "or", 9),
      new Token(TokenType.query, "$q3", 11),
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 6),
      new Token(TokenType.and, "and", 3),
      new Token(TokenType.query, "$q3", 11),
      new Token(TokenType.or, "or", 9),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("$q2<=$q3and$q1 -> $q2$q3<=$q1and", () => {
    const tokens = new Tokenizer("$q2<=$q3and$q1").all();
    expect(tokens).toEqual([
      new Token(TokenType.query, "$q2", 0),
      new Token(TokenType.lte, "<=", 3),
      new Token(TokenType.query, "$q3", 5),
      new Token(TokenType.and, "and", 8),
      new Token(TokenType.query, "$q1", 11),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);

    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q2", 0),
      new Token(TokenType.query, "$q3", 5),
      new Token(TokenType.lte, "<=", 3),
      new Token(TokenType.query, "$q1", 11),
      new Token(TokenType.and, "and", 8),
    ]);
  });

  test("($q1and$q2or$q3) -> $q1$q2andq3or", () => {
    const tokenizer = new Tokenizer("($q1and$q2or$q3)");
    const tokens = tokenizer.all();
    const expectedTokens = [
      new Token(TokenType.parenthesisOpen, "(", 0),
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.query, "$q2", 7),
      new Token(TokenType.or, "or", 10),
      new Token(TokenType.query, "$q3", 12),
      new Token(TokenType.parenthesisClose, ")", 15),
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 7),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.query, "$q3", 12),
      new Token(TokenType.or, "or", 10),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("($q1and($q2or$q3)) -> $q1,$q2,q3,or,and", () => {
    const tokenizer = new Tokenizer("($q1and($q2or$q3))");
    const tokens = tokenizer.all();
    const expectedTokens = [
      new Token(TokenType.parenthesisOpen, "(", 0),
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.parenthesisOpen, "(", 7),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.or, "or", 11),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.parenthesisClose, ")", 16),
      new Token(TokenType.parenthesisClose, ")", 17),
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.or, "or", 11),
      new Token(TokenType.and, "and", 4),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("($q1and($q2==$q3)) -> $q1,$q2,q3,==,and", () => {
    const tokens = new Tokenizer("($q1and($q2==$q3))").all();
    expect(tokens).toEqual([
      new Token(TokenType.parenthesisOpen, "(", 0),
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.parenthesisOpen, "(", 7),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.eq, "==", 11),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.parenthesisClose, ")", 16),
      new Token(TokenType.parenthesisClose, ")", 17),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.eq, "==", 11),
      new Token(TokenType.and, "and", 4),
    ]);
  });

  // test("if$q1and$q2then$r1 -> $q1, $q2, and, r1, if", () => {
  //   const tokenizer = new Tokenizer("if$q1and$q2then$r1");
  //   const tokens = tokenizer.all();
  //   const expectedTokens = [
  //     new Token(TokenType.if, "if", 0),
  //     new Token(TokenType.query, "$q1", 2),
  //     new Token(TokenType.and, "and", 5),
  //     new Token(TokenType.query, "$q2", 8),
  //     new Token(TokenType.then, "then", 11),
  //     new Token(TokenType.return, "$r1", 15),
  //   ];

  //   // console.log("tokens", tokens);

  //   expect(tokens).toEqual(expectedTokens);

  //   const context: Map<string, ParserContextDataTypes> = new Map();

  //   const exprParser = new ExprParser(context);

  //   const postfixTokens = exprParser.infixToPostFix(tokens);
  //   const expectedPostfixTokens = [
  //     new Token(TokenType.query, "$q1", 2),
  //     new Token(TokenType.query, "$q2", 8),
  //     new Token(TokenType.and, "and", 5),
  //     new Token(TokenType.return, "$r1", 15),
  //     new Token(TokenType.if, "if", 0),
  //   ];

  //   // console.log("expectedPostfixTokens", expectedPostfixTokens);
  //   // console.log("postfixTokens", postfixTokens);

  //   expect(postfixTokens).toEqual(expectedPostfixTokens);
  // });

  // test("if$q1and$q2then$r1else$r2 -> $q1, $q2, and, $r1, $r2, if", () => {
  //   const tokenizer = new Tokenizer("if$q1and$q2then$r1else$r2");
  //   const tokens = tokenizer.all();
  //   const expectedTokens = [
  //     new Token(TokenType.if, "if", 0),
  //     new Token(TokenType.query, "$q1", 2),
  //     new Token(TokenType.and, "and", 5),
  //     new Token(TokenType.query, "$q2", 8),
  //     new Token(TokenType.then, "then", 11),
  //     new Token(TokenType.return, "$r1", 15),
  //     new Token(TokenType.else, "else", 18),
  //     new Token(TokenType.return, "$r2", 22),
  //   ];

  //   // console.log("tokens", tokens);

  //   expect(tokens).toEqual(expectedTokens);

  //   const context: Map<string, ParserContextDataTypes> = new Map();

  //   const exprParser = new ExprParser(context);

  //   const postfixTokens = exprParser.infixToPostFix(tokens);
  //   const expectedPostfixTokens = [
  //     new Token(TokenType.query, "$q1", 2),
  //     new Token(TokenType.query, "$q2", 8),
  //     new Token(TokenType.and, "and", 5),
  //     new Token(TokenType.return, "$r1", 15),
  //     new Token(TokenType.return, "$r2", 22),
  //     new Token(TokenType.if, "if", 0),
  //   ];

  //   // console.log("expectedPostfixTokens", expectedPostfixTokens);
  //   // console.log("postfixTokens", postfixTokens);

  //   expect(postfixTokens).toEqual(expectedPostfixTokens);
  // });

  test("if($q1>30)and($q2<35)then$a1 -> $q1 30 > $q2 35 < and $a1 if", () => {
    const tokens = new Tokenizer("if($q1>30)and($q1<35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.parenthesisClose, ")", 9),
      new Token(TokenType.and, "and", 10),
      new Token(TokenType.parenthesisOpen, "(", 13),
      new Token(TokenType.query, "$q1", 14),
      new Token(TokenType.lt, "<", 17),
      new Token(TokenType.number, 35, 18),
      new Token(TokenType.parenthesisClose, ")", 20),
      new Token(TokenType.then, "then", 21),
      new Token(TokenType.ad, "$a1", 25),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.query, "$q1", 14),
      new Token(TokenType.number, 35, 18),
      new Token(TokenType.lt, "<", 17),
      new Token(TokenType.and, "and", 10),
      new Token(TokenType.ad, "$a1", 25),
      new Token(TokenType.if, "if", 0),
    ]);
  });

  test("if($q1>=30)and($q2<=35)then$a1 -> $q1 30 > $q2 35 < and $a1 if", () => {
    const tokens = new Tokenizer("if($q1>=30)and($q1<=35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gte, ">=", 6),
      new Token(TokenType.number, 30, 8),
      new Token(TokenType.parenthesisClose, ")", 10),
      new Token(TokenType.and, "and", 11),
      new Token(TokenType.parenthesisOpen, "(", 14),
      new Token(TokenType.query, "$q1", 15),
      new Token(TokenType.lte, "<=", 18),
      new Token(TokenType.number, 35, 20),
      new Token(TokenType.parenthesisClose, ")", 22),
      new Token(TokenType.then, "then", 23),
      new Token(TokenType.ad, "$a1", 27),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 8),
      new Token(TokenType.gte, ">=", 6),
      new Token(TokenType.query, "$q1", 15),
      new Token(TokenType.number, 35, 20),
      new Token(TokenType.lte, "<=", 18),
      new Token(TokenType.and, "and", 11),
      new Token(TokenType.ad, "$a1", 27),
      new Token(TokenType.if, "if", 0),
    ]);
  });

  test("if($q1>30)==($q2<35)then$a1 -> $q1 30 > $q2 35 < == $a1 if", () => {
    const tokens = new Tokenizer("if($q1>30)==($q1<35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.parenthesisClose, ")", 9),
      new Token(TokenType.eq, "==", 10),
      new Token(TokenType.parenthesisOpen, "(", 12),
      new Token(TokenType.query, "$q1", 13),
      new Token(TokenType.lt, "<", 16),
      new Token(TokenType.number, 35, 17),
      new Token(TokenType.parenthesisClose, ")", 19),
      new Token(TokenType.then, "then", 20),
      new Token(TokenType.ad, "$a1", 24),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.query, "$q1", 13),
      new Token(TokenType.number, 35, 17),
      new Token(TokenType.lt, "<", 16),
      new Token(TokenType.eq, "==", 10),
      new Token(TokenType.ad, "$a1", 24),
      new Token(TokenType.if, "if", 0),
    ]);
  });
});
