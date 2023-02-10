import { AjaxError } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface INFTMetadataService {
  fetchNFTMetadata: (url: URL) => ResultAsync<any, AjaxError>;
}
