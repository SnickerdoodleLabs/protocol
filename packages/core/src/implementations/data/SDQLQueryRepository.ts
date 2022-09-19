import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IpfsCID,
  SDQLQuery,
  SDQLString,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { IPFSHTTPClient } from "ipfs-http-client";
import { ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { ISDQLQueryRepository } from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class SDQLQueryRepository implements ISDQLQueryRepository {
  protected queryCache: Map<IpfsCID, SDQLQuery>;

  public constructor(
    @inject(IConfigProviderType) public configProvider: IConfigProvider,
    @inject(IContextProviderType) public contextProvider: IContextProvider,
    @inject(IAxiosAjaxUtilsType) protected ajaxUtils: IAxiosAjaxUtils,
  ) {
    // Singelton - eager initialization
    // can use as a cache; this.cache - return map
    this.queryCache = new Map();
  }

  // if you have cache, good idea to duplicate objects before returned - business objects are immutable
  // list of ipfs results can be done in parallel
  // check the cache and do the results
  // multiple calls of ipfs in parallel with multiple pieces of content
  // easier in parallel than proper for loop
  // resultutils.combine is how you combine resultasyncs - usually functional notation of cids, uses .map for each value of cids, return copy cache value
  public getByCID(cid: IpfsCID): ResultAsync<SDQLQuery | null, AjaxError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const ipfsUrl = urlJoin(config.ipfsFetchBaseUrl, cid);
        return this.ajaxUtils.get<SDQLString>(new URL(ipfsUrl));
      })
      .map((sdql: SDQLString) => {
        // If there is no data in IPFS for this CID, return null
        if (sdql.length == 0) {
          return null;
        }

        if (typeof sdql !== "string") {
          sdql = SDQLString(JSON.stringify(sdql));
        }

        // Create the query
        const query = new SDQLQuery(cid, sdql);

        // Cache the query
        this.queryCache.set(cid, query);

        // Return the query
        return query;
      });
  }
}

export const ISQLQueryRepository = Symbol.for("ISQLQueryRepository");
