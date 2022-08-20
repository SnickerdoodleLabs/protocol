import "reflect-metadata";

import {
  Age,
  ChainId,
  EVMAccountAddress,
  EVMContractAddress,
  Gender,
  SDQL_Name,
  SDQL_OperatorName,
  URLString,
  TickerSymbol,
  BigNumberString,
} from "@objects/primitives";
import {
  IDataWalletPersistence,
  IEVMBalance,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import {
  ConditionGE,
  ConditionL,
} from "@core/interfaces/objects";
import { AST_BalanceQuery } from "@core/interfaces/objects/SDQL/AST_BalanceQuery";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";

const conditionsGEandL = [
  new ConditionGE(SDQL_OperatorName("ge"), null, 20),
  new ConditionL(SDQL_OperatorName("l"), null, 30),
];

const conditionsGE = [
    new ConditionGE(SDQL_OperatorName("ge"), null, 10),
];

class BalanceQueryEvaluatorMocks {
    public dataWalletPersistence = td.object<IDataWalletPersistence>();
    public balanceQueryEvaluator = td.object<IBalanceQueryEvaluator>();


    public URLmap = new Map<URLString, number>([
        [URLString("www.snickerdoodlelabs.io"), 10],
    ]);

    public transactionsMap = new Map<ChainId, number>([
        [ChainId(1), 10]
    ]);

    public accountBalances = new Array<IEVMBalance>(
        {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD1"),
            balance: BigNumberString("9"),
            contractAddress: EVMContractAddress("Contract 1"),
        },
        {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("44"),
            contractAddress: EVMContractAddress("Contract 2"),
        },
        {
            ticker: TickerSymbol("ETH"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD2"),
            balance: BigNumberString("29"),
            contractAddress: EVMContractAddress("Contract 2"),
        },
        {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(4),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("11"),
            contractAddress: EVMContractAddress("Contract 4"),
        },
        {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("24"),
            contractAddress: EVMContractAddress("Contract 4"),
        },
        {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(1),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("51"),
            contractAddress: EVMContractAddress("Contract 4"),
        },
        {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(8),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("1002"),
            contractAddress: EVMContractAddress("Contract 5"),
        },
        {
            ticker: TickerSymbol("AVAX"),
            chainId: ChainId(9),
            accountAddress: EVMAccountAddress("GOOD3"),
            balance: BigNumberString("23"),
            contractAddress: EVMContractAddress("Contract 5"),
        },

    );
    

  public constructor() {
    this.dataWalletPersistence.setAge(Age(25));
    //this.dataWalletPersistence.setLocation(CountryCode("US"));
    td.when(this.dataWalletPersistence.getAge()).thenReturn(okAsync(Age(25)));
    

    td.when(this.dataWalletPersistence.getGender()).thenReturn(
      okAsync(Gender("male")),
    );

    td.when(this.dataWalletPersistence.getSiteVisitsMap()).thenReturn(
      okAsync(this.URLmap),
    );
    td.when(this.dataWalletPersistence.getTransactionsMap()).thenReturn(
      okAsync(this.transactionsMap),
    );
    td.when(this.dataWalletPersistence.getAccountBalances())
    .thenReturn(
        okAsync(this.accountBalances),
    );
  }
    
    public factory() {
      return new BalanceQueryEvaluator(this.dataWalletPersistence);
    }
}

describe("BalanceQueryEvaluator", () => {
    test("Return Query Balance Array - 1 Chain ID, 20 <= x < 30", async () => {
        const balanceQuery = new AST_BalanceQuery(
            SDQL_Name("q7"),
            "array",
            ChainId(1),
            conditionsGE,
        )
        // >= 20 and < 30
        const mocks = new BalanceQueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(balanceQuery);

        console.log("Output is: ", result["value"]);
  
    })
    test("All Chains, no limits", async () => {
        const balanceQuery = new AST_BalanceQuery(
            SDQL_Name("q7"),
            "array",
            null,
            [],
        )
        // >= 20 and < 30
        const mocks = new BalanceQueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(balanceQuery);

        console.log("Output is: ", result["value"]);   
    })
})
