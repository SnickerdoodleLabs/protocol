import { INFT } from "@snickerdoodlelabs/objects";

export interface INftMetadataParseUtilsExtension {
  getParsedNFT(metadataString: string): INFT;
}

export const INftMetadataParseUtilsType = Symbol.for("INftMetadataParseUtils");
