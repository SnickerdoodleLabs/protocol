import { EContentType } from "@snickerdoodlelabs/objects/src/enum/EContentType.js";

export interface INFTEventField {
  id: string;
  eventUrl?: string;
  country?: string;
  city?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  supply?: string;
}
export interface INFT {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  animationUrl: string | null;
  externalUrl: string | null;
  contentType: EContentType | null;
  contentUrls: Record<EContentType, string>[] | null;
  attributes: AttributesEntity[] | null;
  // FOR MOBILE, you instead have:
  // attributes: Record<string, string>[] | null;
  event: null | INFTEventField;
}

export interface POAPMetadata {
  description: string;
  external_url: string;
  home_url: string;
  image_url: string;
  name: string;
  year: number;
  tags?: string[] | null;
  attributes: AttributesEntity[];
}
export interface AttributesEntity {
  trait_type: string;
  value: string;
}
