import { AST_NetworkQuery, AST_PropertyQuery, AST_Query, AST_Return, AST_ReturnExpr, ConditionGE, SDQLParser } from "businessObjects";
import { AST_Compensation } from "businessObjects/SDQL/AST_Compensation";
import { SDQLSchema } from "businessObjects/SDQL/SDQLSchema";
import { IpfsCID, SDQL_Name } from "primitives";
// import { AST_Factories } from "businessObjects/SDQL/AST_Factories";
import { avalance1SchemaStr } from "./avalanche1.data";

describe("SDQLParser on avalanche", () => {
    
    const schema = SDQLSchema.fromString(avalance1SchemaStr);
    const parser = new SDQLParser(IpfsCID("0"), schema);

    parser.parse();

    describe("Checking queries", () => {

        test("q1 is a network query on AVAX", () => {
            const q1 = parser.context.get("q1");
            // console.log(q1.contract);
            expect(q1 instanceof AST_NetworkQuery).toBeTruthy();
            expect(q1.returnType).toBe("boolean");
            expect(q1.chain).toBe("AVAX");
            expect(q1.contract.networkId).toBe(43114);
            expect(q1.contract.address).toBe("0x9366d30feba284e62900f6295bc28c9906f33172");
            expect(q1.contract.func).toBe("Transfer");
            expect(q1.contract.direction).toBe("from");
            expect(q1.contract.token).toBe("ERC20");
            expect(q1.contract.blockrange.start).toBe(13001519);
            expect(q1.contract.blockrange.end).toBe(14910334);
        });
    
        test("q2 is a conditional age query", () => {
            const q2 = parser.context.get("q2");
            expect(q2 instanceof AST_PropertyQuery).toBeTruthy();
            expect(q2.property).toBe("age");
            expect(q2.returnType).toBe("boolean");
            expect(q2.conditions.length == 1);
    
            const c1 = q2.conditions[0];
            expect(c1 instanceof ConditionGE).toBeTruthy();
            expect(c1.lval).toBeNull();
            expect(c1.rval).toBe(15);
        });
    
        test("q3 is a location query", () => {
            const q3 = parser.context.get("q3");
            expect(q3 instanceof AST_PropertyQuery).toBeTruthy();
            expect(q3.property).toBe("location");
            expect(q3.returnType).toBe("integer");
        });
    });

    describe("Checking return queries", () => {
        test("r1 is a return qualified message", () => {
            const r = parser.context.get("r1");
            expect(r instanceof AST_ReturnExpr).toBeTruthy();
            expect(r.source instanceof AST_Return).toBeTruthy();
            expect(r.source.name).toBe("callback")
            expect(r.source.message).toBe("qualified")
        });
        test("r2 is a return not qualified message", () => {
            const r = parser.context.get("r2");
            expect(r instanceof AST_ReturnExpr).toBeTruthy();
            expect(r.source instanceof AST_Return).toBeTruthy();
            expect(r.source.name).toBe("callback")
            expect(r.source.message).toBe("not qualified")
        });
    
        test("r3 is a query_response", () => {
            const r = parser.context.get("r3");
            expect(r instanceof AST_ReturnExpr).toBeTruthy();
            expect(r.source instanceof AST_Query).toBeTruthy();
            expect(r.source.name).toBe("q3")
        });
    });

    describe("Checking compensations", () => {
        test("it has 3 compensations (c1, c2, c3) with descriptions and callback", () => {
            const c1 = parser.context.get("c1");
            const c2 = parser.context.get("c2");
            const c3 = parser.context.get("c3");
            expect(c1 instanceof AST_Compensation).toBeTruthy();
            expect(c2 instanceof AST_Compensation).toBeTruthy();
            expect(c3 instanceof AST_Compensation).toBeTruthy();

            expect(c1.name).toBe(SDQL_Name("c1"));
            expect(c2.name).toBe(SDQL_Name("c2"));
            expect(c3.name).toBe(SDQL_Name("c3"));

            expect(c1.description).toBe("10% discount code for Starbucks");
            expect(c2.description).toBe("participate in the draw to win a CryptoPunk NFT");
            expect(c3.description).toBe("a free CrazyApesClub NFT");

            
            expect(c1.callback).toBe("https://418e-64-85-231-39.ngrok.io/starbucks");
            expect(c2.callback).toBe("https://418e-64-85-231-39.ngrok.io/cryptopunk");
            expect(c3.callback).toBe("https://418e-64-85-231-39.ngrok.io/crazyapesclub");

        });
    });

    describe.only("Checking Logic returns", () => {
        test("avalance 1 has 2 returns", () => {
            expect(parser.logicReturns.size).toBe(2);
        });
    });

});