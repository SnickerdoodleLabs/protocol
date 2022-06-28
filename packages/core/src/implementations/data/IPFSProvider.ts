//import { IIPFSProvider, IIPFSProviderType } from "@ipfs/interfaces/data";
// import { IPFSError } from "@snickerdoodlelabs/insight-platform-objects";
import { inject, injectable } from "inversify";
import { IPFSHTTPClient, create } from "ipfs-http-client";
import { LoggerInstance } from "moleculer";
import { LoggerType } from "moleculer-ioc";
import { Result, ResultAsync, fromThrowable } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { IIPFSProvider, IIPFSProviderType } from "@browser-extension/interfaces/data/IIPFSProvider";
import { IPFSError } from "@browser-extension/../../objects/src/errors/IPFSError";

import {
    IConfigProvider,
    IConfigProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class IPFSProvider implements IIPFSProvider {
    protected IPFSResult: ResultAsync<IPFSHTTPClient, IPFSError> | undefined;

    constructor(
        @inject(IConfigProviderType) protected configProvider: IConfigProvider,
        @inject(LoggerType) protected logger: LoggerInstance,
    ) { }

    public getIFPSClient(): ResultAsync<IPFSHTTPClient, IPFSError> {
        if (this.IPFSResult == null) {
            this.IPFSResult = this.initalizeIPFSClient();
        }
        return this.IPFSResult;
    }

    protected initalizeIPFSClient(): ResultAsync<IPFSHTTPClient, IPFSError> {
        const safeCreate = fromThrowable(create, (e) => {
            return new IPFSError("Issue connecting to IPFS node", e);
        });

        return this.configProvider.getConfig().andThen((config) => {
            const nodeUrl = config.ipfsNodeAddress;
            const client = safeCreate({ url: nodeUrl });
            return client;
        });
    }
}
