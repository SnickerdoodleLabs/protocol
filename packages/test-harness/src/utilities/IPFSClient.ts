import { IpfsCID } from "@snickerdoodlelabs/objects";
import { IPFSHTTPClient, create } from "ipfs-http-client";
import { ResultAsync } from "neverthrow";

export class IPFSClient {
  protected ipfsClient: IPFSHTTPClient;

  public constructor() {
    this.ipfsClient = create({ url: "http://localhost:5001/api/v0" });
  }

  public postToIPFS(text: string): ResultAsync<IpfsCID, Error> {
    return ResultAsync.fromPromise(
      this.ipfsClient.add(text, { pin: true }),
      (e) => {
        return e as Error;
      },
    ).map((result) => {
      return IpfsCID(result.cid.toString());
    });
  }
}
