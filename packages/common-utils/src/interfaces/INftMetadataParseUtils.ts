import { INFT } from "@snickerdoodlelabs/objects";

export interface INftMetadataParseUtils {
  getParsedNFT(metadataString: string): INFT;
}

export const INftMetadataParseUtilsType = Symbol.for("INftMetadataParseUtils");
