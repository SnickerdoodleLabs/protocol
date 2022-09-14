
import { IpfsCID, SDQLString } from "@objects/primitives";
import "reflect-metadata";
  
  
import { QueryObjectFactory, SDQLParser } from "@query-parser/implementations";
import {
  SDQLQueryWrapper
} from "@query-parser/interfaces/objects";
import { QueryFormatError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLQueryWrapperMocks } from "../../mocks";
import { testData1 } from "./test_data_1.data";
  
  const cid = IpfsCID("0");
  const timeUtils = new TimeUtils();
  
  describe.only("Schema validation", () => {
    test("fixing return", async () => {
      
      const mocks = new SDQLQueryWrapperMocks();
      const schema = mocks.makeQueryWrapper(testData1);
      const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

      await parser.buildAST()
        .andThen((ast) => {
          // fail("didn't return error")
          console.log(ast.returns)
          okAsync(undefined);
          
        })
        .mapErr((err) => {
          console.log(err);
          // expect(err.constructor).toBe(QueryFormatError)
          fail();
        });

    });

  });