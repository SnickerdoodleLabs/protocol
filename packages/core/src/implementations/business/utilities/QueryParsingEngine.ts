import {
  EVMTransaction,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  Insight,
  ISDQLClause,
  ISDQLQueryObject,
  PersistenceError,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";

import { EligibleReward } from "@snickerdoodlelabs/objects";

import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import _ from "underscore";
import { URLString } from "@snickerdoodlelabs/objects";
import { ConsentConditions } from "@snickerdoodlelabs/objects";
import { AST } from "@snickerdoodlelabs/objects";
import { Version } from "@snickerdoodlelabs/objects";
import { AST_Factories } from "./query/AST_Factories";
import { SDQLQuery } from "@snickerdoodlelabs/objects";
import { SDQLSchema } from "@snickerdoodlelabs/objects";
//import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  protected insightsMap: Insight[] = [];
  protected rewardsMap: EligibleReward[] = [];

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    protected consentConditions: ConsentConditions
  ) {
    this.insightsMap = [];
    this.rewardsMap = [];
  }

  /**
   * public handleQuery(cid, schemaString): {"returns": 
   *                                                {"orignalExp": value, "$r3": vallue}, 
   *                                         "compensations":{}...
   *                                        } 
   * {
   * 1. create the SDQLParser and ast
   * 2. iterate over ast.logic.returns and evaluate every returnAST (astEvaluator.evalAny(returnAST))
   * 3. iterate over ast.logic.compensations and evaluate every compensationAST.
   * }
   */

  public handleQuery(query: SDQLQuery): ResultAsync<[Insight[], EligibleReward[]], never | QueryFormatError> {

    const schema = new SDQLSchema(query.query);
    const queryId: IpfsCID = query.cid;

    

    /* Create New AST Tree */
    /*
    const ast = new AST(
      Version(obj.version), 
      obj.description,
      obj.business
    );
    const astEvaluator = AST_Factories.makeAST_Evaluator(IpfsCID("000"), ast)
      */

    return okAsync([this.insightsMap, this.rewardsMap]);
    /*
    
    let result: boolean | number | number[] = 100;

    if (obj == null) {
      return okAsync([this.insightsMap, this.rewardsMap]);
    }

    
    let required = ["version", "description", "business", "queries", "returns", "compensations", "logic"];
    for (let i = 0; i < required.length; i++){
      if ((obj[required[i]] === undefined)){
        return errAsync(new QueryFormatError("Missing Required Key"));
      }
    }

    let returnVal: number | boolean | number[];
    console.log("First Logic Value should be: ", (this.readLogicEntry(obj, obj["logic"]["returns"][0]))["_promise"]  );
    console.log("Second Logic Value should be: ", this.readLogicEntry(obj, obj["logic"]["returns"][1])["_promise"]);


    // READ ALL LOGIC RETURNS FIRST 
    for (let i = 0; i < obj["logic"]["returns"].length; i++) {

      this.readLogicEntry(obj, obj["logic"]["returns"][i]).map((returnVal) => result);

      this.insightsMap.push(new Insight(cid, obj["returns"]["url"] as URLString, result["_promise"]));
    }
    
    // READ ALL COMPENSATION RETURNS 
    for (let i = 0; i < obj["logic"]["compensations"].length; i++) {
      this.readLogicCompEntry(obj, obj["logic"]["compensations"][i], true).andThen(
        (safeReward) =>
          okAsync(this.rewardsMap.push(safeReward))
      )
    }
    return okAsync([this.insightsMap, this.rewardsMap]);
    */
  }


  
  public recursiveQueryReader(obj: ISDQLQueryObject, if_statement: string, returnOnPermission: boolean, ): ResultAsync<number, never | PersistenceError> {
    
    let new_string = '';
    let innerResult = 0;
    let andCounter = 1;
    let orCounter = 0;

    if ((if_statement.includes("(") || if_statement.includes(")"))){
      let start = if_statement.indexOf("(");
      let end = if_statement.lastIndexOf(")");
      new_string = if_statement.slice(start + 1, end)
      this.recursiveQueryReader(obj, new_string, returnOnPermission).map(() => (innerResult));
      if (if_statement.includes("and") || if_statement.includes("AND")){
        andCounter = andCounter * innerResult;
      }
      else{
        orCounter = orCounter + innerResult;
      }
    }

    // innerResult - value of new_string, which is already a part of if_statement
    if_statement = if_statement.replace(new_string, '')

    if (if_statement.includes("and") || if_statement.includes("AND")){
      if_statement.split('and' || 'AND').forEach(element => {

        (this.readQueryEntry(obj, element.split('$')[1], false)).andThen((queryResult) =>
          okAsync(andCounter = andCounter * queryResult)
        )        //andCounter = andCounter + returnVal

      });
    }

    //console.log("andCounter: ", andCounter);
    if (if_statement.includes("or") || if_statement.includes("OR")){
      if_statement.split('or').forEach(element => {
        (this.readQueryEntry(obj, element.split('$')[1], false)).andThen((queryResult) =>
          okAsync(orCounter = orCounter + queryResult)
        )
      });
    }
    //console.log("orCounter: ", orCounter)


    /* One query inside AND is false - RETURN FALSE */
    if (andCounter == 0){
      return okAsync(0);
    }

    /* Not a single OR query is true - RETURN FALSE */
    if ((orCounter > 0)){
      return okAsync(1);
    }
    
    return okAsync(1);
  }
  
  
  /* Break up the QUERY LOGIC */
  public readLogicEntry(obj: ISDQLQueryObject, input: string): ResultAsync<number | number[] | boolean, never | PersistenceError> {
    // given an array of logic    "if$q2then$c2"
    let splitInput; 
    let conditionsSatisfied: number = 0;
    let if_statement = input;

    // No If/Then part, just $r1
    if (!input.includes('then') && !input.includes('Then')) {
      let query = input.split('$')[1]; // r2
      //console.log("Return an Insight with this data please: ", query)
      return this.readReturnEntry(obj, query, false);
    }
    // TODO: Implement recursive Query Reader for more complicated, nested queries ones
    // track AND/OR occurences
    if (input.includes('then')) {
      splitInput = input.split('then');
      if_statement = splitInput[0];
    }
    else {
      splitInput = input.split('Then');
      if_statement = splitInput[0];
    }

    if_statement = (if_statement.replace('if', '')) as string;
    let start = if_statement.charAt(0)
    let end = if_statement.charAt(if_statement.length - 1);

    if ((start == "(") && (end == ")")){
      if_statement = if_statement.slice(0, if_statement.length - 1);
      if_statement = if_statement.slice(1, if_statement.length);
    }

    this.recursiveQueryReader(obj, if_statement, true).map( () => conditionsSatisfied )
    //console.log("ConditionsSatisfied?: ", conditionsSatisfied)
    /* Which result do you choose */
    let results = splitInput[1]; //$r1else$r2"
    results = results.split('else') //$r1 and $r2

    if (conditionsSatisfied == 1) {
      return this.readReturnEntry(obj, results[0].split('$')[1], false);
    }
    else {
      return this.readReturnEntry(obj, results[1].split('$')[1], false);
    }
  }


  /* Break up the QUERY LOGIC */
  public readLogicCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError> {
    // given an array of logic    "if$q2then$c2"
    let splitInput; 
    let conditionsSatisfied: number = 0;
    let if_statement = input;

    // No If/Then part, just $r1
    if (!input.includes('then') && !input.includes('Then')) {
      let query = input.split('$')[1]; // r2
      return this.readCompEntry(obj, query, returnOnPermission);
    }

    // TODO: Implement recursive Query Reader for more complicated ones
    // this.recursiveQueryReader()
    // track AND/OR occurences
    if (input.includes('then')) {
      splitInput = input.split('then');
      if_statement = splitInput[0];
    }
    else {
      splitInput = input.split('Then');
      if_statement = splitInput[0];
    }

    if_statement = (if_statement.replace('if', '')) as string;
    let start = if_statement.charAt(0)
    let end = if_statement.charAt(if_statement.length - 1);

    if ((start == "(") && (end == ")")){
      if_statement = if_statement.slice(0, if_statement.length - 1);
      if_statement = if_statement.slice(1, if_statement.length);
    }

    this.recursiveQueryReader(obj, if_statement, true).map( () => conditionsSatisfied )
    //console.log("ConditionsSatisfied?: ", conditionsSatisfied)
    /* Which result do you choose */
    let results = (splitInput[1]) as string; //$r1else$r2" // $c2

    if (!results.includes("else")){
      return this.readCompEntry(obj, results.split('$')[1], returnOnPermission);
    }

    let SplitElse = results.split('else') //$r1 and $r2
    if (conditionsSatisfied) {
      return this.readCompEntry(obj, SplitElse[0].split('$')[1], returnOnPermission);
    }
    else {
      return this.readCompEntry(obj, SplitElse[1].split('$')[1], returnOnPermission);
    }
  }


  /* Returns 1/0 or True/False for Query */
  public readQueryEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number, PersistenceError> {
    // let subQuery = obj.queries[input];

    let subQuery = obj["queries"][input]

    // PART 1: looking for the location of the object
    switch (subQuery["name"]) {
      // NETWORK QUERY
      case "network":
        if (this.consentConditions.checkNetwork() && returnOnPermission) {
          return okAsync(1);
        }
        if ("contract" in subQuery) {
          /*
          this.persistenceRepo.getEVMTransactions(
            subQuery["contract"]["address"],
            subQuery["contract"]["blockrange"]["start"],
            subQuery["contract"]["blockrange"]["end"]
          ).andThen((transactionList) =>
          
            okAsync(transactionList.forEach  (element => {
              if (element.from != "undefined" && subQuery["contract"]["direction"] == "from") {
                if (element.from == subQuery["contract"]["address"]) {
                  return okAsync(1);
                }
              }
              else if (element.to != "undefined" && subQuery["contract"]["direction"] == "to") {
                if (element.to == subQuery["contract"]["address"]) {
                  return okAsync(1);
                }
              }
              return okAsync(0);
            })
            ) 
          )
          */
          return okAsync(0);
        }
        // default, return false
        return okAsync(1);

      // LOCATION QUERY 
      case 'location':
        if (this.consentConditions.checkLocation() && returnOnPermission) {
          return okAsync(1);
        }
        switch (subQuery["return"]) {
          case 'boolean':
            let conditions = subQuery["conditions"];
            if (conditions.hasOwnProperty("in")) {
              let CountryCodes = conditions["in"];
              /*
                                    CountryCodes.forEach(element => {
                                      element.andThen(okAsync(element)).andThen(
                                        if (okAsync(element) == == this.persistenceRepo.getLocation()) {
                                        return okAsync(1);
                                      }
                                      )
                                  });
                                  */
              let x = 0;
            }
            return okAsync(1);
          case 'integer':
            return this.persistenceRepo.getLocation();
          default:
            return okAsync(0);

        }
      // AGE QUERY
      case 'age':
        if (this.consentConditions.checkAge() && returnOnPermission) {
          return okAsync(1);
        }
        switch (subQuery["return"]) {
          case 'boolean':
            if (subQuery.hasOwnProperty("conditions")) {
              let conditions = subQuery["conditions"];
              if (conditions.hasOwnProperty("ge") && conditions.hasOwnProperty("l")) {
                if ((this.persistenceRepo.getAge() >= conditions["ge"]) && (this.persistenceRepo.getAge() <= conditions["l"])) {
                  return okAsync(1);
                }
                return okAsync(0);
              }
            }
            // If all else fails
            return okAsync(0);
          case 'integer':
            return this.persistenceRepo.getAge();
        }
        return okAsync(0);
      default:
        return okAsync(0);

    }
  }

  /* Returns 1/0 or True/False for Return */
  public readReturnEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number | boolean, PersistenceError> {
    let subQuery = obj["returns"][input];
    subQuery = (subQuery) as ISDQLClause;
    // PART 1: looking for the location of the object
    switch (subQuery.name) {
      // LOCATION QUERY 
      case 'callback':
        switch (subQuery.message) {
          case 'qualified':
            return okAsync(1);
          case 'not qualified':
            return okAsync(0);
          default:
            return okAsync(0);
        }

      // NETWORK QUERY
      case 'query_response':
        return this.readQueryEntry(obj, subQuery.query, returnOnPermission);
    }
    return okAsync(0);
  }

  /* Returns 1/0 or True/False for Query */
  public readCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError> {
    let subQuery = obj["compensations"][input];
    //subQuery = (subQuery) as ISDQLClause;
    return okAsync(new EligibleReward(subQuery["description"], subQuery["callback"]));
  }
}