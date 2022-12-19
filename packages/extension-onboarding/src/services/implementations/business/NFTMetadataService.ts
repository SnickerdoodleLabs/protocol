import { INFTMetadataService } from "@extension-onboarding/services/interfaces/business/INFTMetadataService";
import { INFTMetadataRepository } from "@extension-onboarding/services/interfaces/data/INFTMetadataRepository";
import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export class NFTMetadataService implements INFTMetadataService {
  constructor(protected nftMetadataRepository: INFTMetadataRepository) {}
  public fetchNFTMetadata(url: URL): ResultAsync<any, AjaxError> {
    return this.nftMetadataRepository.fetchNFTMetadata(url);
  }
}
