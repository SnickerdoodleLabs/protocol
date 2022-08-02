import {
  DomainName,
  InvitationDomain,
  IpfsCID,
  IPFSError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { IPFSHTTPClient } from "ipfs-http-client";
import { okAsync, ResultAsync } from "neverthrow";

import { IInvitationRepository } from "@core/interfaces/data";
import { IIPFSProvider, IIPFSProviderType } from "@core/interfaces/utilities";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  protected cache = new Map<IpfsCID, InvitationDomain>();

  public constructor(
    @inject(IIPFSProviderType) protected ipfsProvider: IIPFSProvider,
  ) {}

  public getInvitationDomainByCID(
    cid: IpfsCID,
    domain: DomainName,
  ): ResultAsync<InvitationDomain | null, IPFSError> {
    const cached = this.cache.get(cid);

    if (cached != null) {
      return okAsync(cached);
    }

    return this.ipfsProvider.getIFPSClient().andThen((client) => {
      return ResultAsync.fromPromise(
        this.getFileByCIDInternal(client, cid, domain),
        (e) => {
          return new IPFSError((e as Error).message, e);
        },
      );
    });
  }

  protected async getFileByCIDInternal(
    client: IPFSHTTPClient,
    cid: IpfsCID,
    domain: DomainName,
  ): Promise<InvitationDomain | null> {
    // calling cat command based on JS HTTP client API docs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
    const result = await client.cat(cid);
    let content = new Array<number>();
    for await (const chunk of result) {
      content = [...content, ...chunk];
    }
    // conversion of U8s to readable content
    const raw = Buffer.from(content).toString("utf8");

    // If there is no data in IPFS for this CID, return null
    if (raw.length == 0) {
      return null;
    }

    const json = JSON.parse(raw) as IOpenSeaMetadata;

    // Image property in the first JSON detail is also an IPFS CID, 
    // make a second call to get the actual image URL before returning it in the InvitationDomain
    // eg. Image could be store on GCP/IPFS itself
    const imageURL = await this.getImageByCIDInternal(client, json.image);

    // Create the InvitationDomain
    const invitationDomain = new InvitationDomain(
      domain,
      json.title,
      json.description,
      imageURL,
      json.rewardName,
      json.nftClaimedImage,
    );

    // Cache the query
    this.cache.set(cid, invitationDomain);

    // Return the query
    return invitationDomain;
  }
  
  // Second IPFS fetch call to get the image's actual URL before storing it into invitation domain
  protected async getImageByCIDInternal(
    client: IPFSHTTPClient,
    cid: IpfsCID,
  ): Promise<InvitationDomain | null> {
    // calling cat command based on JS HTTP client API docs
    // https://github.com/ipfs/js-ipfs/tree/master/packages/ipfs-http-client
    const result = await client.cat(cid);
    let content = new Array<number>();
    for await (const chunk of result) {
      content = [...content, ...chunk];
    }
    // conversion of U8s to readable content
    const raw = Buffer.from(content).toString("utf8");

    // If there is no data in IPFS for this CID, return null
    if (raw.length == 0) {
      return null;
    }

    const json = JSON.parse(raw) as URL;

    // Here need to fetch IPFS CID again for the image 

    // Create the InvitationDomain
    const imageURL = new URL(
      json
    );

    // Return the image's url
    return imageURL;
  }
}

interface IOpenSeaMetadata {
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
}
