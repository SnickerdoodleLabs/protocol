import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IpfsCID,
  SDQLQuery,
  SDQLString,
  AjaxError,
  PersistenceError,
  QueryStatus,
  EVMContractAddress,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import { ISDQLQueryRepository } from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

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

  public getQueryStatusByConsentContract(
    consentContractAddress: EVMContractAddress,
    queryHorizon: number,
  ): ResultAsync<QueryStatus[], PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public upsertQueryStatus(
    queryStatus: QueryStatus,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  // if you have cache, good idea to duplicate objects before returned - business objects are immutable
  // list of ipfs results can be done in parallel
  // check the cache and do the results
  // multiple calls of ipfs in parallel with multiple pieces of content
  // easier in parallel than proper for loop
  // resultutils.combine is how you combine resultasyncs - usually functional notation of cids, uses .map for each value of cids, return copy cache value
  public getSDQLQueryByCID(
    cid: IpfsCID,
    timeoutMs?: number,
  ): ResultAsync<SDQLQuery | null, AjaxError> {
    if (this.queryCache.has(cid)) {
      return okAsync(this.queryCache.get(cid) as SDQLQuery);
    }

    return this._buildIpfsUrl(cid).andThen((ipfsUrl) => {
      return this._ajaxGetQuery(ipfsUrl, timeoutMs).map(
        (sdql: SDQLString | null) => {
          if (!sdql || sdql.length == 0) {
            return null;
          }

          if (typeof sdql !== "string") {
            sdql = SDQLString(JSON.stringify(sdql));
          }

          const query = new SDQLQuery(cid, sdql);

          // Cache the query
          this.queryCache.set(cid, query);

          // Return the query
          return query;
        },
      );
    });
  }

  private _buildIpfsUrl(cid: IpfsCID): ResultAsync<URL, never> {
    return this.configProvider.getConfig().map((config) => {
      return new URL(urlJoin(config.ipfsFetchBaseUrl, cid));
    });
  }

  private _ajaxGetQuery(
    ipfsUrl: URL,
    timeoutMs?: number,
  ): ResultAsync<SDQLString | null, AjaxError> {
    if (timeoutMs) {
      return this._ajaxGetQueryWithTimeout(ipfsUrl, timeoutMs);
    }

    return this.ajaxUtils.get<SDQLString>(ipfsUrl);
  }

  private _ajaxGetQueryWithTimeout(
    ipfsUrl: URL,
    timeoutMs: number,
  ): ResultAsync<SDQLString | null, AjaxError> {
    return ResultUtils.race([
      ResultAsync.fromSafePromise(
        new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
      ),
      this.ajaxUtils.get<SDQLString>(ipfsUrl),
    ]);
  }
}

export const ISQLQueryRepository = Symbol.for("ISQLQueryRepository");
