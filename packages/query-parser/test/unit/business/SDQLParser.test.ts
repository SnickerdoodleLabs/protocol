import "reflect-metadata";

import {
  EWalletDataType,
  IpfsCID,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { SDQLQueryWrapperMocks } from "../../mocks";


import { QueryObjectFactory, SDQLParser } from "@query-parser/implementations";
import {
  AST,
  AST_BalanceQuery,
  AST_Compensation,
  AST_ConditionExpr,
  AST_NetworkQuery,
  AST_PropertyQuery,
  AST_Query,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionGE,
} from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData";

describe("SDQLParser on avalanche", () => {
  const wrapperMocks = new SDQLQueryWrapperMocks();
  const schema = wrapperMocks.makeQueryWrapper(avalanche1SchemaStr);
  const parser = new SDQLParser(IpfsCID("0"), schema, new QueryObjectFactory());
  let ast: null | AST = null;

  beforeAll(async () => {
    // console.log("schema", schema);
    const astRes = await parser.buildAST();
    if (astRes.isOk()) {
      ast = astRes.value;
    } else {
      fail(astRes.error.message);
    }
  });

  describe("Checking queries", () => {
    test("q1 is a network query on AVAX", () => {
      const q1 = parser.context.get("q1") as AST_NetworkQuery;
      // console.log(q1.contract);
      expect(q1 instanceof AST_NetworkQuery).toBeTruthy();
      expect(q1.returnType).toBe("boolean");
      expect(q1.chain).toBe("AVAX");
      expect(q1.contract.networkId).toBe(43114);
      expect(q1.contract.address).toBe(
        "0x9366d30feba284e62900f6295bc28c9906f33172",
      );
      expect(q1.contract.func).toBe("Transfer");
      expect(q1.contract.direction).toBe("from");
      expect(q1.contract.token).toBe("ERC20");
      expect(q1.contract.timestamp.start).toBe(13001519);
      expect(q1.contract.timestamp.end).toBe(14910334);
    });

    test("q2 is a conditional age query", () => {
      const q2 = parser.context.get("q2") as AST_PropertyQuery;
      expect(q2 instanceof AST_PropertyQuery).toBeTruthy();
      expect(q2.property).toBe("age");
      expect(q2.returnType).toBe("boolean");
      expect(q2.conditions.length == 1);

      const c1 = q2.conditions[0] as ConditionGE;
      expect(c1 instanceof ConditionGE).toBeTruthy();
      expect(c1.lval).toBeNull();
      expect(c1.rval).toBe(15);
    });

    test("q3 is a location query", () => {
      const q3 = parser.context.get("q3") as AST_PropertyQuery;
      expect(q3 instanceof AST_PropertyQuery).toBeTruthy();
      expect(q3.property).toBe("location");
      expect(q3.returnType).toBe("string");
    });

    test("q4 is a balance query", () => {
      const q4 = parser.context.get("q4");
      // console.log(q4);
      expect(q4 instanceof AST_BalanceQuery).toBeTruthy();
    });

    test("q4 is a balance query", () => {
      const q4 = parser.context.get("q4");
      // console.log(q4);
      expect(q4 instanceof AST_BalanceQuery).toBeTruthy();
    });
  });

  describe("Checking return queries", () => {
    test("r1 is a return qualified message", () => {
      const r = parser.context.get("r1") as AST_ReturnExpr;
      expect(r instanceof AST_ReturnExpr).toBeTruthy();
      expect(r.source instanceof AST_Return).toBeTruthy();
      expect(r.source.name).toBe("callback");
      expect((r.source as AST_Return).message).toBe("qualified");
    });
    test("r2 is a return not qualified message", () => {
      const r = parser.context.get("r2") as AST_ReturnExpr;
      expect(r instanceof AST_ReturnExpr).toBeTruthy();
      expect(r.source instanceof AST_Return).toBeTruthy();
      expect(r.source.name).toBe("callback");
      expect((r.source as AST_Return).message).toBe("not qualified");
    });

    test("r3 is a query_response", () => {
      const r = parser.context.get("r3") as AST_ReturnExpr;
      expect(r instanceof AST_ReturnExpr).toBeTruthy();
      expect(r.source instanceof AST_Query).toBeTruthy();
      expect(r.source.name).toBe("q3");
    });
  });

  describe("Checking compensations", () => {
    test("it has 3 compensations (c1, c2, c3) with descriptions and callback", () => {
      const c1 = parser.context.get("c1") as AST_Compensation;
      const c2 = parser.context.get("c2") as AST_Compensation;
      const c3 = parser.context.get("c3") as AST_Compensation;
      expect(c1 instanceof AST_Compensation).toBeTruthy();
      expect(c2 instanceof AST_Compensation).toBeTruthy();
      expect(c3 instanceof AST_Compensation).toBeTruthy();

      expect(c1.name).toBe(SDQL_Name("c1"));
      expect(c2.name).toBe(SDQL_Name("c2"));
      expect(c3.name).toBe(SDQL_Name("c3"));

      expect(c1.description).toBe("10% discount code for Starbucks");
      expect(c2.description).toBe(
        "participate in the draw to win a CryptoPunk NFT",
      );
      expect(c3.description).toBe("a free CrazyApesClub NFT");

      expect(c1.callback).toEqual(
        {
          parameters: [
            "recipientAddress"
          ],
          data: {
            trackingId: "982JJDSLAcx",
          }
        }
      )
      expect(c2.callback).toEqual(
        {
          parameters: [
            "recipientAddress",
            "productId"
          ],
          data: {
            trackingId: "982JJDSLAcx",
          }
        }
      )
      expect(c3.callback).toEqual(
        {
          parameters: [
            "recipientAddress",
            "productId"
          ],
          data: {
            trackingId: "982JJDSLAcx",
          }
        }
      )


    });

    test("avalance 1 has 3 compensation parameters (recipientAddress, productId, and shippingAddress", () => {
      expect(parser.compensationParameters).toBeDefined();
      expect(parser.compensationParameters!.recipientAddress).toBeDefined();
      expect(parser.compensationParameters!.productId).toBeDefined();
      expect(parser.compensationParameters!.shippingAddress).toBeDefined();
      expect(parser.compensationParameters!).toEqual(
        {
            recipientAddress: {
                type: "address",
                required: true
            },
            productId: {
                type: "string",
                required: false,
                values: [
                  "https://product1",
                  "https://product2",
                ]
            },
            shippingAddress: {
                type: "string",
                required: false,
            },
        }
      );
    })
  });

  describe("Checking Logic return ASTs", () => {
    test("avalanche 1 has 2 return ASTs", () => {
      expect(parser.logicReturns.size).toBe(2);
    });

    test("First return is a valid if($q1and$q2)then$r1else$r2 AST", () => {
      const eef = parser.logicReturns.get(
        "if($q1and$q2)then$r1else$r2",
      ) as Command_IF;
      expect(eef.constructor).toBe(Command_IF);
      expect(eef.conditionExpr.constructor).toBe(AST_ConditionExpr);
      const and = eef.conditionExpr.source as ConditionAnd;
      expect(and.constructor).toBe(ConditionAnd);
      expect(and.lval).toEqual(parser.context.get("q1"));
      expect(and.rval).toEqual(parser.context.get("q2"));

      expect(eef.trueExpr.constructor).toBe(AST_ReturnExpr);
      expect(eef.falseExpr?.constructor).toBe(AST_ReturnExpr);

      expect(eef.trueExpr).toEqual(parser.context.get("r1"));
      expect(eef.falseExpr).toEqual(parser.context.get("r2"));
    });

    test("Second return is $r3", () => {
      const r3 = parser.logicReturns.get("$r3");
      expect(r3).toEqual(parser.context.get("r3"));
    });
  });

  describe("Checking Logic compenstation ASTs", () => {
    test("avalanche 1 has 3 compenstation ASTs", () => {
      expect(parser.logicCompensations.size).toBe(3);
    });
    test("First compenstation is a valid if$q1then$c1 AST", () => {
      const eef = parser.logicCompensations.get("if$q1then$c1") as Command_IF;
      expect(eef.constructor).toBe(Command_IF);
      expect(eef.conditionExpr.constructor).toBe(AST_ConditionExpr);
      const q1 = eef.conditionExpr.source as AST_Query;
      expect(q1.constructor).toBe(AST_NetworkQuery);
      expect(q1).toEqual(parser.context.get("q1"));

      expect(eef.trueExpr.constructor).toBe(AST_Compensation);
      expect(eef.falseExpr).toBeNull();

      expect(eef.trueExpr).toEqual(parser.context.get("c1"));
    });
  });

  describe("AST validation", () => {
    test("meta check", () => {
      expect(ast!.version).toBe("0.1");
      expect(ast!.description).toBe(
        "Interactions with the Avalanche blockchain for 15-year and older individuals",
      );
      expect(ast!.business).toBe("Shrapnel");
    });
  });

  describe("Dependency validation", () => {
    test("if($q1and$q2)then$r1else$r2 -> q1, q2", () => {
      // console.log(parser.returnPermissions);
      const permissions = parser.returnPermissions.get(
        "if($q1and$q2)then$r1else$r2",
      );
      expect(permissions?.EVMTransactions).toBeTruthy();
      expect(permissions?.Age).toBeTruthy();
    });

    test("$r3 -> q3", () => {
      // console.log(parser.returnPermissions);
      const permissions = parser.returnPermissions.get("$r3");
      const expectedFlags = EWalletDataType.Location;
      expect(permissions?.Location).toBeTruthy();
    });
  });
});
