import {
  IAxiosAjaxUtils,
  IAxiosAjaxUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  DomainName,
  InvitationDomain,
  IOpenSeaMetadata,
  IpfsCID,
  IPFSError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { urlJoin } from "url-join-ts";

import { IInvitationRepository } from "@core/interfaces/data/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@core/interfaces/utilities/index.js";

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

    return this.getInvitationMetadataByCID(cid).andThen((json) => {
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
    });
  }

  public getInvitationMetadataByCID(
    cid: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError> {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        const ipfsUrl = urlJoin(config.ipfsFetchBaseUrl, cid);
        return this.ajaxUtil
          .get<IOpenSeaMetadata>(new URL(ipfsUrl))
          .map((metadata) => {
            metadata.image = URLString(
              metadata.image?.replace("ipfs://", config.ipfsFetchBaseUrl) ?? "",
            );
            metadata.nftClaimedImage = URLString(
              metadata.nftClaimedImage?.replace(
                "ipfs://",
                config.ipfsFetchBaseUrl,
              ) ?? "",
            );
            return metadata;
          });
      })

      .orElse((err) => {
        return errAsync(new IPFSError((err as Error).message, err));
      });
  }
}
