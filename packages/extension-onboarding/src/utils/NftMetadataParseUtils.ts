import {
  WalletNFT,
  EVMNFT,
  UnixTimestamp,
  EIndexedDbOp,
  BigNumberString,
  EChainTechnology,
} from "@snickerdoodlelabs/objects";

import {
  AttributesEntity,
  EContentType,
  INFT,
  INFTEventField,
} from "@extension-onboarding/objects";

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

export class NftMetadataParseUtils {
  static isEVMNFT(walletNFT: WalletNFT): walletNFT is EVMNFT {
    return walletNFT.type === EChainTechnology.EVM;
  }
  public static getParsedNFT = (metadataString: string): INFT => {
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
      name: this.getName(metadataObj),
      description: this.getDescription(metadataObj),
      imageUrl: this.getImageUrl(metadataString, metadataObj),
      animationUrl: this.getAnimationUrl(metadataObj),
      externalUrl: this.getExternalUrl(metadataObj),
      contentType: this.getContentType(metadataObj),
      contentUrls: this.getContentUrls(metadataObj),
      attributes: this.getAttributes(metadataObj),
      event: this.getEventInfo(metadataObj),
    } as INFT;
  };

  private static getImageUrl(metadataString: string, metadataObj) {
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
      : NftMetadataParseUtils.getImageFromContent(metadataObj);
  }

  private static getImageFromContent(metadataObj) {
    const image = metadataObj?.content?.[0]?.url ?? null;
    return image ? NftMetadataParseUtils.normalizeUrl(image as string) : null;
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

  private static getAttributes(metadataObj): AttributesEntity[] | null {
    const _attributes = metadataObj.attributes ?? metadataObj.traits ?? null;
    if (!_attributes) {
      return null;
    }
    return _attributes.map((attribute) => {
      return {
        trait_type: attribute.trait_type ?? attribute.key ?? attribute.name,
        value: attribute.value,
      };
    });
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
