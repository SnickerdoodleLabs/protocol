import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
  Insight,
  ISDQLClause,
  ISDQLQueryObject,
  QueryFormatError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import _ from "underscore";
import { URLString } from "@snickerdoodlelabs/objects";

@injectable()
export class QueryParsingEngine implements IQueryParsingEngine {
  protected insightsMap: Insight[] = [];

  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
  ) {
    this.insightsMap = [];
  }

  public handleQuery(obj: ISDQLQueryObject, cid: IpfsCID): ResultAsync<Insight[], never | QueryFormatError> {
    /*
      get number of queries
      for each (1 through 3), create an insight
      each insight is stored in an array of insights
      return the array of insights
    */

    if (obj == null) {
      return okAsync([]);
    }

    if ((_.size(obj.queries) != _.size(obj.returns)) || (_.size(obj.returns) != _.size(obj.compensations))) {
      return errAsync(new QueryFormatError());
    }

    // First two needed to create an insight
    const queryId = cid;
    const url = (obj.returns.url) as URLString;

    //let key: keyof typeof obj.returns;
    let queriesPrefix = "q", returnedPrefix = "r", compensationsPrefix = "c";
    let queriesIndex, returnedIndex, compensationsIndex;

    for (let index = 1; index <= _.size(obj["queries"]); index++) {
      // key should be q1, q2 etc.
      console.log("inside for loop");
      queriesIndex = queriesPrefix + index, returnedIndex = returnedPrefix + index, compensationsIndex = compensationsPrefix + index;
      let query_data = obj.queries[queriesIndex];
      let return_data = obj.returns[returnedIndex];
      let comp_data = obj.compensations[compensationsIndex];

      const insight = new Insight(
        queryId,
        url,
        JSON.stringify(
          {
            "query": query_data,
            "return": return_data,
            "compensation": comp_data
          })
      );

      this.insightsMap.push(insight);
    }

    //console.log("ENDING HANDLE QUERY OBJECT");

    return okAsync(this.insightsMap);
  }
  /*
    protected async parseFormatting(
      cid: IpfsCID,
      obj: ISDQLClause): Promise<Insight | null> {
  
      if (obj == null) { return null; }
      const insight = new Insight(cid, obj["url"], 0);
  
      return insight;
    }
  */

}
