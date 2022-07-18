import { AST_NetworkQuery, AST_PropertyQuery, ConditionGE } from "businessObjects";
import { AST_Factories } from "businessObjects/SDQL/AST_Factories";
import { IpfsCID } from "primitives";
import { avalanceSchemaStr } from "./avalanche.data";

describe("SDQLParser on avalanche", () => {
    const parser = AST_Factories.makeParser(IpfsCID("test-avalance"), avalanceSchemaStr);

    parser.parse();


    test.only("q1 is a network query on AVAX", () => {
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

    test.only("q2 is a conditional age query", () => {
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
});