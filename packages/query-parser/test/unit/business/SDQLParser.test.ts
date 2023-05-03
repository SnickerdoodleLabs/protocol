import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { IpfsCID, SDQLQuery, SDQL_Name } from "@snickerdoodlelabs/objects";

import {
  QueryObjectFactory,
  SDQLParser,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations";
import {
  AST,
  AST_Ad,
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_Compensation,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_SubQuery,
  ConditionG,
} from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData";

const cid = IpfsCID("0");

describe("SDQLParser on avalanche", () => {
  const timeUtils = new TimeUtils();
  const sdqlQueryWrapperFactory = new SDQLQueryWrapperFactory(timeUtils);
  const schema = sdqlQueryWrapperFactory.makeWrapper(
    new SDQLQuery(cid, avalanche1SchemaStr),
  );
  const parser = new SDQLParser(IpfsCID("0"), schema, new QueryObjectFactory());
  let ast: null | AST = null;

  beforeAll(async () => {
    const astRes = await parser.buildAST();
    if (astRes.isOk()) {
      ast = astRes.value;
    } else {
      console.error(`Build AST failed with message: ${astRes.error.message}`);
      expect(1).toBe(2);
    }
  });

  describe("Checking subqueries", () => {
    test("q1 is a network query on AVAX", () => {
      const q1 = parser.context.get("q1") as AST_BlockchainTransactionQuery;
      expect(q1 instanceof AST_BlockchainTransactionQuery).toBeTruthy();
      expect(q1.returnType).toBe("boolean");
      expect(q1.chain).toBe("AVAX");
      expect(q1.contract.networkId).toBe(43114);
      expect(q1.contract.address).toBe(
        "0x9366d30feba284e62900f6295bc28c9906f33172",
      );
      expect(q1.contract.func).toBe("Transfer");
      expect(q1.contract.direction).toBe("from");
      expect(q1.contract.token).toBe("ERC20");
      expect(q1.contract.timestampRange.start).toBe(13001519);
      expect(q1.contract.timestampRange.end).toBe(14910334);
    });

    test("q2 is an age query", () => {
      const q2 = parser.context.get("q2") as AST_PropertyQuery;
      expect(q2 instanceof AST_PropertyQuery).toBeTruthy();
      expect(q2.property).toBe("age");
      expect(q2.returnType).toBe("number");
    });

    test("q3 is a location query", () => {
      const q3 = parser.context.get("q3") as AST_PropertyQuery;
      expect(q3 instanceof AST_PropertyQuery).toBeTruthy();
      expect(q3.property).toBe("location");
      expect(q3.returnType).toBe("string");
    });

    test("q4 is a balance query", () => {
      const q4 = parser.context.get("q4");
      expect(q4 instanceof AST_BalanceQuery).toBeTruthy();
    });
  });

  describe("Checking insights", () => {
    test("it has 3 insights (i1, i2, i3)", () => {
      const i1 = parser.context.get("i1") as AST_Insight;
      const i2 = parser.context.get("i2") as AST_Insight;
      const i3 = parser.context.get("i3") as AST_Insight;

      expect(i1 instanceof AST_Insight).toBeTruthy();
      expect(i2 instanceof AST_Insight).toBeTruthy();
      expect(i3 instanceof AST_Insight).toBeTruthy();

      expect(i1.name).toBe(SDQL_Name("i1"));
      expect(i2.name).toBe(SDQL_Name("i2"));
      expect(i3.name).toBe(SDQL_Name("i3"));

      expect(i1.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(i1.target.source instanceof ConditionG).toBeTruthy();
      expect(i1.returns instanceof AST_Expr).toBeTruthy();
      expect(typeof i1.returns.source === "string").toBeTruthy();

      expect(i2.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(i2.target.source instanceof AST_SubQuery).toBeTruthy();
      expect(i2.returns instanceof AST_Expr).toBeTruthy();
      expect(typeof i2.returns.source === "string").toBeTruthy();

      expect(i3.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(typeof i3.target.source == "boolean").toBeTruthy();
      expect(i3.returns instanceof AST_Expr).toBeTruthy();
      expect(i3.returns.source instanceof AST_SubQuery).toBeTruthy();
    });
  });

  describe("Checking ads", () => {
    test("it has 3 ads (a1, a2, ia)", () => {
      const a1 = parser.context.get("a1") as AST_Ad;
      const a2 = parser.context.get("a2") as AST_Ad;
      const a3 = parser.context.get("a3") as AST_Ad;

      expect(a1 instanceof AST_Ad).toBeTruthy();
      expect(a2 instanceof AST_Ad).toBeTruthy();
      expect(a3 instanceof AST_Ad).toBeTruthy();

      expect(a1.name).toBe(SDQL_Name("a1"));
      expect(a2.name).toBe(SDQL_Name("a2"));
      expect(a3.name).toBe(SDQL_Name("a3"));

      expect(a1.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(typeof a1.target.source == "boolean").toBeTruthy();

      expect(a2.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(a2.target.source instanceof AST_SubQuery).toBeTruthy();

      expect(a3.target instanceof AST_ConditionExpr).toBeTruthy();
      expect(a3.target.source instanceof ConditionG).toBeTruthy();
    });
  });

  describe("Checking compensations", () => {
    test("avalance 1 has 3 compensation parameters (recipientAddress, productId, and shippingAddress", () => {
      expect(parser.compensationParameters).toBeDefined();
      expect(parser.compensationParameters!.recipientAddress).toBeDefined();
      expect(parser.compensationParameters!.productId).toBeDefined();
      expect(parser.compensationParameters!.shippingAddress).toBeDefined();
      expect(parser.compensationParameters!).toEqual({
        recipientAddress: {
          type: "address",
          required: true,
        },
        productId: {
          type: "string",
          required: false,
          values: ["https://product1", "https://product2"],
        },
        shippingAddress: {
          type: "string",
          required: false,
        },
      });
    });

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

      expect(c1.callback).toEqual({
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      });
      expect(c2.callback).toEqual({
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      });
      expect(c3.callback).toEqual({
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      });
    });

    test("Checking requires expressions", () => {
      const c1 = parser.context.get("c1") as AST_Compensation;
      const c2 = parser.context.get("c2") as AST_Compensation;
      const c3 = parser.context.get("c3") as AST_Compensation;

      expect(c1.requires instanceof AST_Expr).toBeTruthy();
      expect(c1.requires.source instanceof AST_Insight).toBeTruthy();
      expect(c1.requires.source).toEqual(parser.context.get("i1"));

      expect(c2.requires instanceof AST_ConditionExpr).toBeTruthy();
      expect(c2.requires.source instanceof ConditionG).toBeTruthy();
      expect((c2.requires.source as ConditionG).lval! instanceof AST_Insight).toBeTruthy();
      expect((c2.requires.source as ConditionG).lval!).toEqual(parser.context.get("i2"));
      expect((c2.requires.source as ConditionG).rval).toBe(10);

      expect(c3.requires instanceof AST_Expr).toBeTruthy();
      expect(c3.requires.source instanceof AST_Insight).toBeTruthy();
      expect(c3.requires.source).toEqual(parser.context.get("i3"));
    });
  });
});
