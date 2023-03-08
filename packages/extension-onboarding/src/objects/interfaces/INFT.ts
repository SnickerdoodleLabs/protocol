import { EContentType } from "@extension-onboarding/objects/enums";

export interface INFTEventField {
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
  attributes: Record<string, string>[] | null;
  event: null | INFTEventField;
}
