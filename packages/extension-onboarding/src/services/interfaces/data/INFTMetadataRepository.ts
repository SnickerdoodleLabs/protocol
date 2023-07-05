import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INFTMetadataRepository {
  fetchNFTMetadata: (url: URL) => ResultAsync<any, AjaxError>;
}
