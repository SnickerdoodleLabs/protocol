import { EContentType } from "@extension-onboarding/objects/enums";

export interface INFT {
  name: string | null;
  description: string | null;
  imageUrl: string | null;
  animationUrl: string | null;
  externalUrl: string | null;
  contentType: EContentType | null;
  contentUrls: Record<EContentType, string>[] | null;
  attributes: Record<string, string>[] | null;
}
