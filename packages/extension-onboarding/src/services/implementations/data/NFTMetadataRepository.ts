import { IAxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { INFTMetadataRepository } from "@extension-onboarding/services/interfaces/data/INFTMetadataRepository";

export class NFTMetadataRepository implements INFTMetadataRepository {
  constructor(protected ajaxUtil: IAxiosAjaxUtils) {}
  public fetchNFTMetadata(url: URL): ResultAsync<unknown, AjaxError> {
    return this.ajaxUtil.get<any>(url, {
      headers: { Accept: "application/json" },
    });
  }
}
