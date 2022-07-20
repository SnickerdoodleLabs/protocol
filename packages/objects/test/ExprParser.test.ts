import { Token, Tokenizer, TokenType } from "businessObjects/SDQL/Tokenizer";

describe("Conditional expressions", () => {

    test("$q1and$q2 -> $q1$q2and", () => {
        
        const tokenizer = new Tokenizer("$q1and$q2");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.query, "$q1"),
            new Token(TokenType.and, "and"),
            new Token(TokenType.query, "$q2")
        ]

        expect(tokens).toEqual(expectedTokens);
    });
});