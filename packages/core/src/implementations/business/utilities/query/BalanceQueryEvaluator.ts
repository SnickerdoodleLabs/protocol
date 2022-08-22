import { BigNumberString, ChainId, EvalNotImplementedError, EVMContractAddress, IDataWalletPersistence, IDataWalletPersistenceType, IEVMBalance, ITokenBalance, PersistenceError, SDQL_Return } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import {
    AST_BalanceQuery,
    ConditionE,
    ConditionG,
    ConditionGE, ConditionL,
    ConditionLE
} from "@core/interfaces/objects";
import { BigNumber } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import { networkStatus } from "webextension-polyfill";

@injectable()
export class BalanceQueryEvaluator implements IBalanceQueryEvaluator {
    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {}

    public eval(
        query: AST_BalanceQuery
    ): ResultAsync<SDQL_Return, PersistenceError> {
        console.log("INSIDE AST_BalanceQuery!!!!!");


        return this.dataWalletPersistence.getAccountBalances().andThen( (balances) => {
            if (query.networkId == null){
                return okAsync((balances));
            }
            return okAsync((balances.filter((balance) => balance.chainId == query.networkId)));
          }
        ).andThen( (excessValues) => {
            console.log("excessValues: ", excessValues)
            let tokenBalances : ITokenBalance[] = []; 
            let newToken : ITokenBalance = {
                networkId: ChainId(1),
                address: EVMContractAddress(""),
                balance: BigNumber.from("0"),
            };
            excessValues.forEach(object => {
                newToken['networkId'] = object['chainId'];
                newToken['address'] = object['contractAddress'];
                newToken['balance'] = BigNumber.from(object['balance']);
                tokenBalances.push(newToken);

                // refresh newToken so new info can be pushed in
                newToken = {
                    networkId: ChainId(1),
                    address: EVMContractAddress(""),
                    balance: BigNumber.from("0"),
                };
            })
            console.log("TokenBalances: ", tokenBalances)
            return okAsync(tokenBalances);
        }
        ).andThen( (balanceArray) => {
            return ((this.evalConditions(query, balanceArray)));
        }).andThen( (balanceArray) => {
            balanceArray.forEach(element => {
                console.log("balanceArray element: ", element);
                console.log("balanceArray element.balance: ", element.balance.toNumber());
            });
            return (this.combineContractValues(query, balanceArray));
        }).andThen( (balanceArray) => {
            return okAsync(SDQL_Return(balanceArray));
        })
    }

    public evalConditions(query: AST_BalanceQuery, balanceArray: ITokenBalance[]): ResultAsync<ITokenBalance[], never>{

        
        for (let condition of query.conditions) {
            //console.log("Condition: ", condition);
            //console.log("balanceArray: ", balanceArray);
            let val: BigNumber = BigNumber.from(0);
            console.log("Val: ", val.toNumber());
            switch (condition.constructor) {
                case ConditionGE:
                    val = BigNumber.from((condition as ConditionGE).rval);
                    console.log("val: ", val.toNumber());
                    balanceArray = balanceArray.filter((balance) => BigNumber.from((balance.balance)).toNumber() >= val.toNumber());
                    console.log("BalanceArray: ", balanceArray);
                    break;
                case ConditionG:
                    val = BigNumber.from((condition as ConditionG).rval);
                    console.log("val: ", val.toNumber());
                    balanceArray = balanceArray.filter((balance) => BigNumber.from((balance.balance)).toNumber() > val.toNumber());
                    break;
                case ConditionL:
                    val = BigNumber.from((condition as ConditionL).rval);
                    console.log("val: ", val.toNumber());
                    balanceArray = balanceArray.filter((balance) => BigNumber.from((balance.balance)).toNumber() < val.toNumber());
                    break;
                case ConditionE:
                    val = BigNumber.from((condition as ConditionE).rval);
                    console.log("val: ", val.toNumber());
                    balanceArray = balanceArray.filter((balance) => BigNumber.from((balance.balance)).toNumber() == val.toNumber());
                    break;
                case ConditionLE:
                    val = BigNumber.from((condition as ConditionLE).rval);
                    console.log("val: ", val.toNumber());
                    balanceArray = balanceArray.filter((balance) => BigNumber.from((balance.balance)).toNumber() <= val.toNumber());
                    break;

                default:
                    throw new EvalNotImplementedError(condition.constructor.name);
            }
        }
        return okAsync(balanceArray);
        
    }

    public combineContractValues(query: AST_BalanceQuery, balanceArray: ITokenBalance[]): ResultAsync<ITokenBalance[], PersistenceError> {
            let obj: ITokenBalance =  {
                balance: BigNumber.from('0'),
                networkId: ChainId(0),
                address: EVMContractAddress("0")
            };
            let balanceMap = new Map<EVMContractAddress, ITokenBalance>();

            balanceArray.forEach( (d) => {
                if (balanceMap.has(d.address)){
                    console.log("Address: ", d.address);
                    let getObject = balanceMap.get(d.address);
                    if (getObject !== undefined){
                        obj = getObject;
                    }
                    obj.balance = BigNumber.from(obj.balance.toNumber() + d.balance.toNumber());
                    balanceMap.set(d.address, obj);
                    console.log("balanceMap: ", balanceMap);

                    console.log("CHECK VALUES");
                    balanceMap.forEach(element => {
                        console.log("elements values: ", element.balance.toNumber())
                    });
                }
                else
                {
                    console.log("Address: ", d.address);
                    // let obj = {
                    //     balance: d.balance,
                    //     networkId: d.networkId,
                    //     address: d.address
                    // }
                    balanceMap.set(d.address, {
                        balance: d.balance,
                        networkId: d.networkId,
                        address: d.address
                    });
                    console.log("balanceMap: ", balanceMap);
                    console.log("CHECK VALUES");
                    balanceMap.forEach(element => {
                        console.log("elements values: ", element.balance.toNumber())
                    });

                }
            })

            console.log("CHECK VALUES");
            let returnedArray: ITokenBalance[] = [];

            balanceMap.forEach((element, key) => {
                let tokenObject = obj;
                console.log("elements key: ", key)
                console.log("elements values: ", element.balance.toNumber())
                console.log(".get function values: ", (balanceMap.get(key))?.balance.toNumber())
                returnedArray.push({
                    address: key,
                    balance: element.balance,
                    networkId: element.networkId
                });
                console.log("Returned Array: ", returnedArray);
            });

            returnedArray.forEach(element => {
                console.log("element: ", element);
                console.log("element.balance: ", element.balance.toNumber());

            });
            console.log("returnedArray: ", returnedArray);
            //const itemsIndex = balanceArray.findIndex(item => item.address === )
            return okAsync(returnedArray);

    }
    // public evalConditions()
}
