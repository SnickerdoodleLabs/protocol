import { EContentType, INFT } from "@extension-onboarding/objects";
import { okAsync, ResultAsync } from "neverthrow";

const emptytNft: INFT = {
  name: null,
  description: null,
  imageUrl: null,
  animationUrl: null,
  externalUrl: null,
  contentType: null,
  contentUrls: null,
  attributes: null,
};

export class NftMetadataParseUtils {
  public static getParsedNFT = (
    metadataString: string,
  ): ResultAsync<INFT, never> => {
    if (!metadataString) {
      return okAsync(emptytNft);
    }
    let metadataObj = null;
    try {
      const obj = JSON.parse(metadataString);
      metadataObj = obj.raw ? JSON.parse(obj.raw) : obj;
    } catch (e) {
      metadataObj = null;
    }
    if (!metadataObj) {
      return okAsync(emptytNft);
    }
    return okAsync({
      name: this.getName(metadataObj),
      description: this.getDescription(metadataObj),
      imageUrl: this.getImageUrl(metadataString),
      animationUrl: this.getAnimationUrl(metadataObj),
      externalUrl: this.getExternalUrl(metadataObj),
      contentType: this.getContentType(metadataObj),
      contentUrls: this.getContentUrls(metadataObj),
      attributes: this.getAttributes(metadataObj),
    } as INFT);
  };

  private static getImageUrl(metadataString: string) {
    let nftImages: string[];
    try {
      const regexpImage = /(\"image.*?\":.*?\"(.*?)\\?\")/;
      const regexpUrl = /(https?|ipfs|data)/i;
      const splittedData = metadataString?.split(regexpImage);
      const extractedImages: string[] = [];
      splittedData?.forEach((key) => {
        if (regexpImage.test(key)) {
          const imageUrl = key.match(regexpImage)?.[2];
          if (imageUrl && regexpUrl.test(imageUrl)) {
            extractedImages.push(imageUrl);
          }
        }
      });
      nftImages = extractedImages;
    } catch (e) {
      nftImages = [];
    }
    return nftImages?.[0]
      ? NftMetadataParseUtils.normalizeUrl(nftImages[0])
      : null;
  }

  private static getContentType(metadataObj) {
    return EContentType.UNKNOWN;
  }

  private static getAnimationUrl(metadataObj) {
    return metadataObj.animation_url
      ? NftMetadataParseUtils.normalizeUrl(metadataObj.animation_url)
      : null;
  }

  private static getExternalUrl(metadataObj) {
    return metadataObj.external_url
      ? NftMetadataParseUtils.normalizeUrl(metadataObj.external_url)
      : null;
  }

  private static getContentUrls(metadataObj) {
    return null;
  }

  private static getAttributes(metadataObj) {
    return metadataObj.attributes ?? null;
  }

  private static getName(metadataObj) {
    return metadataObj.name ?? null;
  }
  private static getDescription(metadataObj) {
    return metadataObj.description ?? null;
  }

  private static normalizeUrl(url: string): string {
    let res = url;
    if (res.includes("ipfs://ipfs/")) {
      res = res.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
    } else {
      res = res.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return res;
  }
}
