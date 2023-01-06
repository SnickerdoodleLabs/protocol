
import { QueryObjectFactory, SDQLQueryUtils, SDQLQueryWrapperFactory } from "@query-parser/implementations";
import { SDQLParserFactory } from "@query-parser/implementations/utilities/SDQLParserFactory";
import { ISDQLParserFactory, ISDQLQueryWrapperFactory } from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { CompensationKey, DataPermissions, EWalletDataType, QueryIdentifier, SDQLString } from "@snickerdoodlelabs/objects";
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

describe("SDQLQueryUtils query to compensation tests", () => {
    test("avalanche 1: ['q1'] -> ['c1']", async () => {

        // input-output
        const schemaString = SDQLString(avalanche1SchemaStr);
        const queryIds = [QueryIdentifier('q1')];
        const expected = [CompensationKey('c1')];

        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getEligibleCompensations(schemaString, queryIds);

        expect(result.isOk()).toBeTruthy();

        expect(result._unsafeUnwrap()).toEqual(expected);

    })

    test("avalanche 1: ['q2'] -> ['c2', 'c3']", async () => {

        // input-output
        const schemaString = SDQLString(avalanche1SchemaStr);
        const queryIds = [QueryIdentifier('q2')];
        const expected = [CompensationKey('c2'), CompensationKey('c3')];

        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getEligibleCompensations(schemaString, queryIds);

        expect(result.isOk()).toBeTruthy();

        expect(result._unsafeUnwrap()).toEqual(expected);

    })
    test("avalanche 1: ['q3'] -> ['c2', 'c3']", async () => {

        // input-output
        const schemaString = SDQLString(avalanche1SchemaStr);
        const queryIds = [QueryIdentifier('q3')];
        const expected = [CompensationKey("c3"), CompensationKey("c2")];

        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getEligibleCompensations(schemaString, queryIds);

        expect(result.isOk()).toBeTruthy();

        expect(result._unsafeUnwrap()).toEqual(expected);

    })
    test("avalanche 1: ['q1', 'q2'] -> ['c1', 'c2', 'c3']", async () => {

        // input-output
        const schemaString = SDQLString(avalanche1SchemaStr);
        const queryIds = [QueryIdentifier('q1'), QueryIdentifier('q2')] ;
        const expected = [
            CompensationKey('c1'), 
            CompensationKey('c2'), 
            CompensationKey('c3')
        ];

        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getEligibleCompensations(schemaString, queryIds);

        expect(result.isOk()).toBeTruthy();

        expect(result._unsafeUnwrap()).toEqual(expected);

    })
});


describe("SDQLQueryUtils permission to query tests", () => {

    test("avalance 1: permissions [EVMTransactions] -> ['q1']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.EVMTransactions
        ])
        const expected = ['q1'];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });

    test("avalance 1: permissions [Age] -> ['q2']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.Age
        ])
        const expected = [QueryIdentifier('q2')];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });
    test("avalance 1: permissions [Location] -> ['q3']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.Location
        ])
        const expected = [QueryIdentifier('q3')];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });

    test("avalance 1: permissions [AccountBalances] -> ['q4']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.AccountBalances
        ])
        const expected = [QueryIdentifier('q4')];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });

    test("avalance 1: permissions [Age, Location] -> ['q2', 'q3']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.Age,
            EWalletDataType.Location
        ])
        const expected = [QueryIdentifier('q2'), QueryIdentifier('q3')];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });

    test("avalance 1: permissions [EVMTransactions, Age, Location, AccountBalances] -> ['q1', 'q2', 'q3', 'q4']", async () => {

        const schemaString = SDQLString(avalanche1SchemaStr);
        const givenPermissions = DataPermissions.createWithPermissions([
            EWalletDataType.EVMTransactions,
            EWalletDataType.Age,
            EWalletDataType.Location,
            EWalletDataType.AccountBalances
        ])
        const expected = [
            QueryIdentifier('q1'), 
            QueryIdentifier('q2'), 
            QueryIdentifier('q3'), 
            QueryIdentifier('q4')
        ];
    
        const mocks = new SDQLQueryUtilsMocks();
        const result = await mocks.factory().getPermittedQueryIdsFromSchemaString(schemaString, givenPermissions);

        expect(result.isOk()).toBeTruthy();
        expect(result._unsafeUnwrap()).toEqual(expected);

    });
});