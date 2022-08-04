import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DomainName,
  InvitationDomain,
  IpfsCID,
  IPFSError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInvitationRepository } from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities";

@injectable()
export class InvitationRepository implements IInvitationRepository {
  protected cache = new Map<IpfsCID, InvitationDomain>();

  public constructor(
    @inject(IAxiosAjaxUtilsType) protected ajaxUtil: IAxiosAjaxUtils,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
  ) {}

  public getInvitationDomainByCID(
    cid: IpfsCID,
    domain: DomainName,
  ): ResultAsync<InvitationDomain | null, IPFSError> {
    const cached = this.cache.get(cid);

    if (cached != null) {
      return okAsync(cached);
    }

    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const ipfsUrl = urlJoin(config.ipfsFetchBaseUrl, cid);
        return this.ajaxUtil.get<IOpenSeaMetadata>(new URL(ipfsUrl));
      })
      .andThen((json) => {
        const invitationDomain = new InvitationDomain(
          domain,
          json?.title,
          json?.description,
          json?.image,
          json?.rewardName,
          json?.nftClaimedImage,
        );

        // Cache the query
        this.cache.set(cid, invitationDomain);

        return okAsync(invitationDomain);
      })
      .orElse((err) => {
        return errAsync(new IPFSError((err as Error).message, err));
      });
  }
}

interface IOpenSeaMetadata {
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
}
