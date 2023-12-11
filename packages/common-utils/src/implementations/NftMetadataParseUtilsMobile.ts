import {
  AttributesEntity,
  EContentType,
  INFT,
  INFTEventField,
} from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { INftMetadataParseUtils, INftMetadataParseUtilsType } from "..";

const emptytNft: INFT = {
  name: null,
  description: null,
  imageUrl: null,
  animationUrl: null,
  externalUrl: null,
  contentType: null,
  contentUrls: null,
  attributes: null,
  event: null,
};

export class NftMetadataParseUtilsMobile implements INftMetadataParseUtils {
  public getParsedNFT(metadataString: string): INFT {
    if (!metadataString) {
      return emptytNft;
    }
    let metadataObj = null;
    try {
      const obj = JSON.parse(metadataString);
      metadataObj = obj.raw ? JSON.parse(obj.raw) : obj;
    } catch (e) {
      metadataObj = null;
    }
    if (!metadataObj) {
      return emptytNft;
    }
    return {
      name: NftMetadataParseUtilsMobile.getName(metadataObj),
      description: NftMetadataParseUtilsMobile.getDescription(metadataObj),
      imageUrl: NftMetadataParseUtilsMobile.getImageUrl(metadataString),
      animationUrl: NftMetadataParseUtilsMobile.getAnimationUrl(metadataObj),
      externalUrl: NftMetadataParseUtilsMobile.getExternalUrl(metadataObj),
      contentType: NftMetadataParseUtilsMobile.getContentType(metadataObj),
      contentUrls: NftMetadataParseUtilsMobile.getContentUrls(metadataObj),
      attributes: NftMetadataParseUtilsMobile.getAttributes(metadataObj),
      event: NftMetadataParseUtilsMobile.getEventInfo(metadataObj),
    } as INFT;
  }

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
      ? NftMetadataParseUtilsMobile.normalizeUrl(nftImages[0])
      : null;
  }

  private static getContentType(metadataObj) {
    return EContentType.UNKNOWN;
  }

  private static getAnimationUrl(metadataObj) {
    return metadataObj.animation_url
      ? NftMetadataParseUtilsMobile.normalizeUrl(metadataObj.animation_url)
      : null;
  }

  private static getExternalUrl(metadataObj) {
    return metadataObj.external_url
      ? NftMetadataParseUtilsMobile.normalizeUrl(metadataObj.external_url)
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

  private static getEventInfo(metadataObj) {
    if (
      metadataObj.hasOwnProperty("start_date") &&
      metadataObj.hasOwnProperty("end_date")
    ) {
      return {
        id: metadataObj.id,
        eventUrl: metadataObj.event_url,
        country: metadataObj.country,
        city: metadataObj.city,
        startDate: metadataObj.start_date,
        endDate: metadataObj.end_date,
        expiryDate: metadataObj.expiry_date,
        supply: metadataObj.supply,
        year: metadataObj.year,
      } as INFTEventField;
    }
    return null;
  }

  private static normalizeUrl(url: string): string {
    let res = url;
    if (res.includes("ipfs://ipfs/")) {
      res = res.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
    } else {
      res = res.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    // added for location base issues
    res = res.replace("https://ipfs.io/ipfs/", "https://cf-ipfs.com/ipfs/");
    return res;
  }
}
