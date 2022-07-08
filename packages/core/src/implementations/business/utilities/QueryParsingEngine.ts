import {
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
import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { parseTransaction } from "ethers/lib/utils";
import { listRegisteredBindingsForServiceIdentifier } from "inversify/lib/utils/serialization";

//import { SnickerdoodleCore } from "@snickerdoodlelabs/core";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  protected insightsMap: Insight[] = [];

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
  ) {
    this.insightsMap = [];
  }

  /*
    QUERY LOGIC:

    LIMITING IT TO: 

    IF / THEN STATEMENTS with AND / OR operators
  */

  public handleQuery(obj: ISDQLQueryObject, cid: IpfsCID): ResultAsync<Insight[], never | QueryFormatError> {

    const persistence = new LocalStoragePersistence();
    let data = [];
    //const core = new SnickerdoodleCore(undefined, persistence);

    if (obj == null) {
      return okAsync([]);
    }

    if ((_.size(obj.queries) != _.size(obj.returns)) || (_.size(obj.returns) != _.size(obj.compensations))) {
      return errAsync(new QueryFormatError());
    }

    for (let i = 0; i < _.size(obj.logic.returns); i++) {
      let result = (this.readLogicEntry(obj, obj.logic.returns[i]));
      if (typeof result == "undefined") {
        data.push();
      }
      else {
        //data.push(result);
      }
    }

    // LOGIC returns an array of numbers
    let insight = new Insight(
      cid,
      obj.returns.url as (URLString),
      data
    );

    this.insightsMap.push(insight);

    for (let i = 0; i < _.size(obj.logic.returns); i++) {
      // "if$q1then$c1"
      this.readCompEntry(obj, obj.logic.returns[i])
      // this.insightsMap.push();
    }

    return okAsync(this.insightsMap);
  }



  public readLogicEntry(obj: ISDQLQueryObject, input: string): ResultAsync<number[], never | PersistenceError> {
    // given an array of logic    "if($q1and$q2and$q3)then$r1else$r2"

    let totalTruth: number[] = [];
    let returnedData: number[] = [];
    let splitInput;

    if (
      input.includes('then') || input.includes('Then')
    ) {
      // query is required, no return is just given out
      if (input.includes('then')) {
        splitInput = input.split('then'); // if($q1and$q2and$q3)
      }
      else {
        splitInput = input.split('Then'); // $r1else$r2"
      }

      /* AND and OR operators */
      let queries = splitInput[0].replace('if', '').replace('(', '').replace(')', '');
      queries.split('and').forEach(element => {
        //totalTruth.push(this.readQueryEntry(obj, element.split('$')[1]));
      });

      let result = totalTruth.reduce((prev, next) => {
        return prev + next;
      }, 0);

      let reuslts = splitInput[1];
      queries.split('else').forEach(element => {
        //totalTruth.push(this.readQueryEntry(obj, element.split('$')[1]));
      });

      splitInput[1];
    }

    // If not empty, then check logic for which statements to call upon. 
    /*
    if (_.size(totalTruth) == result) {
      queries.split('and');
    }
    else {
      if (_.size(totalTruth) == result) {
      }
    }
    */

    returnedData.push();

    return okAsync(returnedData);
  }


  /* Always return True/False for the Query Return */
  public readQueryEntry(obj: ISDQLQueryObject, input: string): ResultAsync<boolean | number, PersistenceError> {
    let subQuery = obj.queries[input];
    subQuery = (subQuery) as ISDQLClause;

    // PART 1: looking for the location of the object
    switch (subQuery.name) {
      // LOCATION QUERY 
      case 'location':
        switch (subQuery.return) {
          case 'boolean':
            let conditions = subQuery.conditions;
            if (conditions.includes["in"]) {
              let CountryCodes = conditions.includes["in"];
              // access the person's country code - 
              // Look inside persistence layer


              // If location exists within country code array, return true
              /*
              CountryCodes.forEach(element => {
                if (element == this.persistenceRepo.getLocation()) {
                  return okAsync(true);
                };
              });
              */

            }
            return okAsync(false);
          case 'integer':
            return this.persistenceRepo.getLocation();
          default:
            return okAsync(false);
        }
      // NETWORK QUERY
      case 'network':
        // MAJOR TODO: COMPLETE THE INSIGHT SERVICE OF LOOKING FOR CONTRACTS ASSOCIATED WITH THE NETWORK
        // CHOOSE NETWORK BY CHAIN
        switch (subQuery.chain) {
          case 'ETH':
            return okAsync(true);
          case 'SOL':
            return okAsync(true);
          case 'AVA':
            return okAsync(true);
        }
        return okAsync(true);

      // AGE QUERY
      case 'age':
        switch (subQuery.return) {
          case 'boolean':
            if (subQuery.includes["conditions"]) {
              let conditions = subQuery.conditions;
              if (conditions.includes["ge"] && conditions.includes["l"]) {
                if ((this.persistenceRepo.getAge() >= conditions["ge"]) && (this.persistenceRepo.getAge() <= conditions["l"])) {
                  return okAsync(true);
                }
                return okAsync(false);
              }
            }
            // If all else fails
            return okAsync(false);
          case 'integer':
            return this.persistenceRepo.getAge();
        }
    }
    return okAsync(false);
  }



  public readReturnEntry(obj: ISDQLQueryObject, input: string): ResultAsync<boolean | number, PersistenceError> {
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
        return this.readQueryEntry(obj, subQuery.query);

    }
    return okAsync(false);
  }



  public readCompEntry(obj: ISDQLQueryObject, input: string): ResultAsync<boolean | number, PersistenceError> {
    let subQuery = obj.compensations[input];
    subQuery = (subQuery) as ISDQLClause;

    // PART 1: looking for the location of the object
    switch (subQuery.description) {
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
        return this.readQueryEntry(obj, subQuery.query);

    }
    return okAsync(false);
  }
}