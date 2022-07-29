import { IPFSError } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { IPFSHTTPClient, create } from "ipfs-http-client";
import { ResultAsync, fromThrowable } from "neverthrow";

import {
  IConfigProvider,
  IConfigProviderType,
  IIPFSProvider,
} from "@core/interfaces/utilities";

@injectable()
export class IPFSProvider implements IIPFSProvider {
  protected IPFSResult: ResultAsync<IPFSHTTPClient, IPFSError> | undefined;

  constructor(
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

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
