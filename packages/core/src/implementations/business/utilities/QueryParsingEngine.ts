import {
  EligibleReward,
  EVMTransaction,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  Insight,
  ISDQLClause,
  ISDQLQueryObject,
  PersistenceError,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import _ from "underscore";
import { URLString } from "@snickerdoodlelabs/objects";
import { ConsentConditions } from "@snickerdoodlelabs/objects";
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

  public handleQuery(obj: ISDQLQueryObject, cid: IpfsCID): ResultAsync<[Insight[], EligibleReward[]], never | QueryFormatError> {

    /* Still an empty return */
    if (obj == null) {
      return okAsync([this.insightsMap, this.rewardsMap]);
    }

    /* Missing Key Error */
    let required = ["version", "description", "business", "queries", "returns", "compensations", "logic"];
    for (let i = 0; i < _.size(required); i++){
      if (!(required[i] in obj)){
        return errAsync(new QueryFormatError("Missing Required Key"));
      }
    }

    /* READ ALL LOGIC RETURNS FIRST */
    for (let i = 0; i < _.size(obj.logic.returns); i++) {
      this.readLogicEntry(obj, obj.logic.returns[i], false).andThen(
        (result) =>
          okAsync(new Insight(cid, obj.returns.url as (URLString), result))
      ).andThen((safeInsight) =>
        okAsync(this.insightsMap.push(safeInsight))
      )
    }

    /* READ ALL COMPENSATION RETURNS */
    for (let i = 0; i < _.size(obj.logic.compensations); i++) {
      this.readLogicCompEntry(obj, obj.logic.returns[i], true).andThen(
        (safeReward) =>
          okAsync(this.rewardsMap.push(safeReward))
      )
    }

    return okAsync([this.insightsMap, this.rewardsMap]);
  }

  /*
  public recursiveQueryReader(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean, ): ResultAsync<number[] | boolean, never | PersistenceError> {
    input.split('and')
    return okAsync(true);
  }
  */
  
  /* Break up the QUERY LOGIC */
  public readLogicEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number | number[] | boolean, never | PersistenceError> {
    // given an array of logic    "if($q1and$q2and$q3)then$r1else$r2"
    let totalTruth: number[] = [];
    let returnedData: number[] = [];
    let splitInput; let returnedNum: number;
    let conditionsSatisfied: boolean = false;

    // No If/Then part, just $r1
    if (!input.includes('then') && !input.includes('Then')) {
      let query = input.split('$')[1]; // r2
      return this.readReturnEntry(obj, query, returnOnPermission);
    }

    // TODO: Implement recursive Query Reader for more complicated, nested queries ones
    // track AND/OR occurences
    let andCounter = (input.match(/and/g) || []).length;
    let orCounter = (input.match(/and/g) || []).length;
    if (input.includes('then')) {
      splitInput = input.split('then');
    }
    else {
      splitInput = input.split('Then');
    }

    // splitInput[0] if($q1and$q2and$q3)
    // splitInput[1] $r1else$r2"
    // if($q1and$q2and$q3) OR $q1and($q2or$q3) // $q1or($q2and$q3)     $q4 or ($q1and($q2or$q3))
    // recursion with inner brackets
    // then $r1else$r2"
    let queries = splitInput[0].replace('if', '').replace('(', '').replace(')', '');
    queries.split('and').forEach(element => {
      (this.readQueryEntry(obj, element.split('$')[1], returnOnPermission)).andThen((queryResult) =>
        okAsync(totalTruth.push(queryResult))
      )
    });

    let result = totalTruth.reduce((prev, next) => {
      return prev + next;
    }, 0);

    if (result == andCounter) {
      conditionsSatisfied = true;
    }

    /* Which result do you choose */
    let results = splitInput[1]; //$r1else$r2"
    results = results.split('else') //$r1 and $r2
    if (conditionsSatisfied) {
      return this.readReturnEntry(obj, results[0].split('$')[1], returnOnPermission);
    }
    else {
      return this.readReturnEntry(obj, results[1].split('$')[1], returnOnPermission);
    }
  }

  /* Returns 1/0 or True/False for Query */
  public readQueryEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<number, PersistenceError> {
    let subQuery = obj.queries[input];
    subQuery = (subQuery) as ISDQLClause;
    // PART 1: looking for the location of the object
    switch (subQuery.name) {
      // NETWORK QUERY
      case 'network':
        if (this.consentConditions.checkNetwork() && returnOnPermission) {
          return okAsync(1);
        }
        if (subQuery.includes('contract')) {
          this.persistenceRepo.getEVMTransactions(
            subQuery.contract.address,
            subQuery.contract.blockrange.start,
            subQuery.contract.blockrange.end
          ).andThen((EVMTransactions) =>
            okAsync(EVMTransactions.forEach(element => {
              if (element.from != "undefined" && subQuery.contract.direction == "from") {
                if (element.from == subQuery.contract.address) {
                  return okAsync(true);
                }
              }
              else if (element.to != "undefined" && subQuery.contract.direction == "to") {
                if (element.to == subQuery.contract.address) {
                  return okAsync(true);
                }
              }
              return okAsync(false);
            }))
          )
        }
        // default, return false
        return okAsync(0);

      // LOCATION QUERY 
      case 'location':
        if (this.consentConditions.checkLocation() && returnOnPermission) {
          return okAsync(1);
        }
        switch (subQuery.return) {
          case 'boolean':
            let conditions = subQuery.conditions;
            if (conditions.includes["in"]) {
              let CountryCodes = conditions.includes["in"];
              /*
                                    CountryCodes.forEach(element => {
                                      element.andThen(okAsync(element)).andThen(
                                        if (okAsync(element) == == this.persistenceRepo.getLocation()) {
                                        return okAsync(true);
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
        switch (subQuery.return) {
          case 'boolean':
            if (subQuery.includes["conditions"]) {
              let conditions = subQuery.conditions;
              if (conditions.includes["ge"] && conditions.includes["l"]) {
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
    let subQuery = obj.returns[input];
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
            return okAsync(false);
        }

      // NETWORK QUERY
      case 'query_response':
        return this.readQueryEntry(obj, subQuery.query, returnOnPermission);
    }
    return okAsync(false);
  }


  /* Break up the QUERY LOGIC */
  public readLogicCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, never | PersistenceError> {
    // given an array of logic    "if($q1and$q2and$q3)then$r1else$r2"
    let totalTruth: number[] = [];
    let returnedData: number[] = [];
    let splitInput; let returnedNum: number;
    let conditionsSatisfied: boolean = false;

    // No If/Then part, just $r1
    if (!input.includes('then') && !input.includes('Then')) {
      let query = input.split('$')[1]; // r2
      return this.readCompEntry(obj, query, returnOnPermission);
    }

    // TODO: Implement recursive Query Reader for more complicated ones
    // this.recursiveQueryReader()

    // track AND/OR occurences
    let andCounter = (input.match(/and/g) || []).length;
    let orCounter = (input.match(/and/g) || []).length;
    if (input.includes('then')) {
      splitInput = input.split('then');
    }
    else {
      splitInput = input.split('Then');
    }

    // splitInput[0] if($q1and$q2and$q3)
    // splitInput[1] $r1else$r2"
    // if($q1and$q2and$q3) OR $q1and($q2or$q3) // $q1or($q2and$q3)     $q4 or ($q1and($q2or$q3))
    // recursion with inner brackets
    // then $r1else$r2"
    let queries = splitInput[0].replace('if', '').replace('(', '').replace(')', '');
    queries.split('and').forEach(element => {
      this.readQueryEntry(obj, element.split('$')[1], returnOnPermission).andThen((returnedNum) =>
        okAsync(returnedNum)
      ).andThen((returnedNum) =>
        okAsync(totalTruth.push(returnedNum)))
    });

    let result = totalTruth.reduce((prev, next) => {
      return prev + next;
    }, 0);

    if (result == andCounter) {
      conditionsSatisfied = true;
    }

    /* Which result do you choose */
    let results = splitInput[1]; //$r1else$r2"
    results = results.split('else') //$r1 and $r2
    if (conditionsSatisfied) {
      return this.readCompEntry(obj, results[0].split('$')[1], returnOnPermission);
    }
    else {
      return this.readCompEntry(obj, results[1].split('$')[1], returnOnPermission);
    }
  }

  /* Returns 1/0 or True/False for Query */
  public readCompEntry(obj: ISDQLQueryObject, input: string, returnOnPermission: boolean): ResultAsync<EligibleReward, PersistenceError> {
    let subQuery = obj.compensations[input];
    subQuery = (subQuery) as ISDQLClause;
    return okAsync(new EligibleReward(subQuery.description, subQuery.callback));
  }
}