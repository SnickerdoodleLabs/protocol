import { EContentType, } from "@snickerdoodlelabs/objects";
const emptytNft = {
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
// import { ResultAsync } from "neverthrow";
// import { INFTMetadataService } from "@extension-onboarding/services/interfaces/business/INFTMetadataService";
// import { INFTMetadataRepository } from "@extension-onboarding/services/interfaces/data/INFTMetadataRepository";
// export class NFTMetadataService implements INFTMetadataService {
//   constructor(protected nftMetadataRepository: INFTMetadataRepository) {}
//   public fetchNFTMetadata(url: URL): ResultAsync<any, AjaxError> {
//     return this.nftMetadataRepository.fetchNFTMetadata(url);
//   }
// }
export class NftMetadataParseUtilsExtension {
    static getParsedNFT(metadataString) {
        if (!metadataString) {
            return emptytNft;
        }
        let metadataObj = null;
        try {
            const obj = JSON.parse(metadataString);
            metadataObj = obj.raw ? JSON.parse(obj.raw) : obj;
        }
        catch (e) {
            metadataObj = null;
        }
        if (!metadataObj) {
            return emptytNft;
        }
        return {
            name: NftMetadataParseUtilsExtension.getName(metadataObj),
            description: NftMetadataParseUtilsExtension.getDescription(metadataObj),
            imageUrl: NftMetadataParseUtilsExtension.getImageUrl(metadataString, metadataObj),
            animationUrl: NftMetadataParseUtilsExtension.getAnimationUrl(metadataObj),
            externalUrl: NftMetadataParseUtilsExtension.getExternalUrl(metadataObj),
            contentType: NftMetadataParseUtilsExtension.getContentType(metadataObj),
            contentUrls: NftMetadataParseUtilsExtension.getContentUrls(metadataObj),
            attributes: NftMetadataParseUtilsExtension.getAttributes(metadataObj),
            event: NftMetadataParseUtilsExtension.getEventInfo(metadataObj),
        };
    }
    static getImageUrl(metadataString, metadataObj) {
        let nftImages;
        try {
            const regexpImage = /(\"image.*?\":.*?\"(.*?)\\?\")/;
            const regexpUrl = /(https?|ipfs|data)/i;
            const splittedData = metadataString === null || metadataString === void 0 ? void 0 : metadataString.split(regexpImage);
            const extractedImages = [];
            splittedData === null || splittedData === void 0 ? void 0 : splittedData.forEach((key) => {
                var _a;
                if (regexpImage.test(key)) {
                    const imageUrl = (_a = key.match(regexpImage)) === null || _a === void 0 ? void 0 : _a[2];
                    if (imageUrl && regexpUrl.test(imageUrl)) {
                        extractedImages.push(imageUrl);
                    }
                }
            });
            nftImages = extractedImages;
        }
        catch (e) {
            nftImages = [];
        }
        return (nftImages === null || nftImages === void 0 ? void 0 : nftImages[0])
            ? NftMetadataParseUtilsExtension.normalizeUrl(nftImages[0])
            : NftMetadataParseUtilsExtension.getImageFromContent(metadataObj);
    }
    static getImageFromContent(metadataObj) {
        var _a, _b, _c;
        const image = (_c = (_b = (_a = metadataObj === null || metadataObj === void 0 ? void 0 : metadataObj.content) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null;
        return image
            ? NftMetadataParseUtilsExtension.normalizeUrl(image)
            : null;
    }
    static getContentType(metadataObj) {
        return EContentType.UNKNOWN;
    }
    static getAnimationUrl(metadataObj) {
        return metadataObj.animation_url
            ? NftMetadataParseUtilsExtension.normalizeUrl(metadataObj.animation_url)
            : null;
    }
    static getExternalUrl(metadataObj) {
        return metadataObj.external_url
            ? NftMetadataParseUtilsExtension.normalizeUrl(metadataObj.external_url)
            : null;
    }
    static getContentUrls(metadataObj) {
        return null;
    }
    static getAttributes(metadataObj) {
        var _a, _b;
        const _attributes = (_b = (_a = metadataObj.attributes) !== null && _a !== void 0 ? _a : metadataObj.traits) !== null && _b !== void 0 ? _b : null;
        if (!_attributes) {
            return null;
        }
        return _attributes.map((attribute) => {
            var _a, _b;
            return {
                trait_type: (_b = (_a = attribute.trait_type) !== null && _a !== void 0 ? _a : attribute.key) !== null && _b !== void 0 ? _b : attribute.name,
                value: attribute.value,
            };
        });
    }
    static getName(metadataObj) {
        var _a;
        return (_a = metadataObj.name) !== null && _a !== void 0 ? _a : null;
    }
    static getDescription(metadataObj) {
        var _a;
        return (_a = metadataObj.description) !== null && _a !== void 0 ? _a : null;
    }
    static getEventInfo(metadataObj) {
        if (metadataObj.hasOwnProperty("start_date") &&
            metadataObj.hasOwnProperty("end_date")) {
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
            };
        }
        return null;
    }
    static normalizeUrl(url) {
        let res = url;
        if (res.includes("ipfs://ipfs/")) {
            res = res.replace("ipfs://ipfs/", "https://ipfs.io/ipfs/");
        }
        else {
            res = res.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        // added for location base issues
        res = res.replace("https://ipfs.io/ipfs/", "https://cf-ipfs.com/ipfs/");
        return res;
    }
}
//# sourceMappingURL=NftMetadataParseUtilsExtension.js.map