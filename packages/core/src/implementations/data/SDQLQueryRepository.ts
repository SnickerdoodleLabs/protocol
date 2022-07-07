import {
  IpfsCID,
  SDQLQuery,
  SDQLString,
  IPFSError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { IPFSHTTPClient } from "ipfs-http-client";
import { ResultAsync } from "neverthrow";

import {
  IIPFSProvider,
  IIPFSProviderType,
  ISDQLQueryRepository,
} from "@core/interfaces/data";
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
    @inject(IIPFSProviderType) protected ipfsProvider: IIPFSProvider,
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
  public getByCID(cid: IpfsCID): ResultAsync<SDQLQuery | null, IPFSError> {
    return this.ipfsProvider.getIFPSClient().andThen((client) => {
      return ResultAsync.fromPromise(
        this.getFileByCIDInternal(client, cid),
        (e) => {
          return new IPFSError((e as Error).message, e);
        },
      );
    });
  }

  // public getByCIDs(
  //     cids: IpfsCID[],
  // ): ResultAsync<Map<IpfsCID, SDQLQuery>, IPFSError> {
  //     return this.ipfsProvider.getIFPSClient().andThen((client) => {
  //         return ResultAsync.fromPromise(
  //             this.getFileByCIDInternal(client, cid),
  //             (e) => {
  //                 return new IPFSError((e as Error).message, e);
  //             },
  //         );
  //     });
  // }

  protected async getFileByCIDInternal(
    client: IPFSHTTPClient,
    cid: IpfsCID,
  ): Promise<SDQLQuery | null> {
    // calling cat command based on JS HTTP client API docs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
    const result = await client.cat(cid);
    let content = new Array<number>();
    for await (const chunk of result) {
      content = [...content, ...chunk];
    }
    // conversion of U8s to readable content
    const raw = SDQLString(Buffer.from(content).toString("utf8"));

    // If there is no data in IPFS for this CID, return null
    if (raw.length == 0) {
      return null;
    }

    // Create the query
    const query = new SDQLQuery(cid, raw);

    // Cache the query
    this.queryCache.set(cid, query);

    // Return the query
    return query;
  }
}

export const ISQLQueryRepository = Symbol.for("ISQLQueryRepository");
