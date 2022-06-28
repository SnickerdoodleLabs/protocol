import { Insight, IpfsCID, Reward, SDQLQuery, SDQLString } from "@snickerdoodlelabs/objects";
import { AsyncContainerModule, inject, injectable } from "inversify";
import { ISDQLQueryRepository } from "@core/interfaces/data";
import { IConfigProvider, IConfigProviderType, IContextProvider, IContextProviderType, } from "@core/interfaces/utilities";
import createClient from "ipfs-http-client";
// need version 55 for ipfs-http-client to work
import { okAsync, ResultAsync, errAsync } from "neverthrow";
import { IPFSFile } from "@browser-extension/interfaces/objects/IPFSFile";
import errorCodes from "@browser-extension/../../objects/src/errors/errorCodes";
import { IPFSError } from "../../../../objects/src/errors/IPFSError";
import { fromThrowable } from "neverthrow";
import { IPFSHTTPClient } from "ipfs-http-client";
import { IIPFSProvider, IIPFSProviderType } from "@browser-extension/interfaces/data/IIPFSProvider";
import { ResultUtils } from "neverthrow-result-utils";


@injectable()
export class SDQLQueryRepository implements ISDQLQueryRepository {
    protected QueryRepository;
    protected cacheRepository;
    protected SDQLstring;
    protected query;

    public constructor(
        @inject(IConfigProviderType) public configProvider: IConfigProvider,
        @inject(IContextProviderType) public contextProvider: IContextProvider,
        @inject(IIPFSProviderType) protected ipfsProvider: IIPFSProvider,
    ) {
        // Singelton - eager initialization
        // can use as a cache; this.cache - return map
        this.QueryRepository = new Map<IpfsCID, SDQLQuery>();
    }

    // if you have cache, good idea to duplicate objects before returned - business objects are immutable
    // list of ipfs results can be done in parallel
    // check the cache and do the results
    // multiple calls of ipfs in parallel with multiple pieces of content
    // easier in parallel than proper for loop
    // resultutils.combine is how you combine resultasyncs - usually functional notation of cids, uses .map for each value of cids, return copy cache value
    public getByCID(cid: IpfsCID): ResultAsync<Map<IpfsCID, SDQLQuery>, IPFSError | null> {

        return (this.ipfsProvider.getIFPSClient().andThen((client) => {
            return ResultAsync.fromPromise(
                this.getFileByCIDInternal(client, cid),
                (e) => {
                    return new IPFSError((e as Error).message, e);
                },
            )
        })
        )
        /*

        return ResultUtils.combine(this.ipfsProvider.getIFPSClient().andThen((client) => {
            this.IpfsCID,
            SDQLQuery,
        }).map((this.IpfsCID, SDQLQuery) => new Map())
        )

        return ResultUtils.combine(
          consentContractAddresses.map((consentContractAddress) => {
            return okAsync(
              new ConsentContract(provider, consentContractAddress),
            );
          }),
        );
      })
      .map((val) => val);
            */
    }

    protected async getFileByCIDInternal(
        client: IPFSHTTPClient,
        cid: IpfsCID,
    ): Promise<Map<IpfsCID, SDQLQuery>> {

        // calling cat command based on JS HTTP client API docs
        // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
        const result = await client.cat(cid);
        let content = new Array<number>();
        for await (const chunk of result) {
            content = [...content, ...chunk];
        }
        // conversion of U8s to readable content
        const raw = Buffer.from(content).toString("utf8");
        // query is not found yet in IPFS
        /*
        if (this.query == null) {
            return okAsync(new Map<IpfsCID, SDQLQuery>());
        }
        */
        this.cacheRepository = new Map<IpfsCID, SDQLQuery>();
        this.SDQLstring = SDQLString(raw);
        let query_data = new SDQLQuery(cid, this.SDQLstring);

        // good for caching but not return
        this.QueryRepository.set(cid, query_data);
        this.cacheRepository.set(cid, query_data);
        return this.cacheRepository;
    }

}

export const ISQLQueryRepository = Symbol.for(
    "ISQLQueryRepository",
);