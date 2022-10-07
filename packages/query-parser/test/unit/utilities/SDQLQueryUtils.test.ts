
import { QueryObjectFactory, SDQLQueryUtils, SDQLQueryWrapperFactory } from "@query-parser/implementations";
import { SDQLParserFactory } from "@query-parser/implementations/utilities/SDQLParserFactory";
import { ISDQLParserFactory, ISDQLQueryWrapperFactory } from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLString } from "@snickerdoodlelabs/objects";
import * as td from "testdouble";

class SDQLQueryUtilsMocks {
    
    protected parserFactory:ISDQLParserFactory;
    readonly queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
    readonly queryObjectFactory = new QueryObjectFactory();

    constructor() {
        this.parserFactory = new SDQLParserFactory(this.queryObjectFactory, this.queryWrapperFactory);
    }

    public factory(): SDQLQueryUtils {
        return new SDQLQueryUtils(
            this.parserFactory,
            this.queryWrapperFactory
        );
    }

}

describe("SDQLQueryUtils tests", () => {
    test("avalanche 1: ['q1'] -> ['c1']", async () => {

        // input-output
        const schemaString = SDQLString(avalanche1SchemaStr);
        const queryIds = ['q1'];
        const expected = ['c1'];

        const mocks = new SDQLQueryUtilsMocks();
        const got = await mocks.factory().getEligibleCompensations(schemaString, queryIds);

        expect(got).toEqual(expected);

    })
});