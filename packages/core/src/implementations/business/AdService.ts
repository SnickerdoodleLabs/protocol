import { IAdService } from "@core/interfaces/business";
import { 
    IContextProvider, 
    IContextProviderType, 
    IDataWalletUtils, 
    IDataWalletUtilsType 
} from "@core/interfaces/utilities/index.js";
import { 
    ICryptoUtils, 
    ICryptoUtilsType 
} from "@snickerdoodlelabs/common-utils";
import {
    IDataWalletPersistenceType,
    IDataWalletPersistence,
    EligibleAd,
    PersistenceError,
    AdKey,
    AdSignature,
    IpfsCID,
    SHA256Hash,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";


@injectable()
export class AdService implements IAdService {

    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
        @inject(ICryptoUtilsType)
        protected cryptoUtils: ICryptoUtils,
        @inject(IContextProviderType) 
        protected contextProvider: IContextProvider,
        @inject(IDataWalletUtilsType) 
        protected dataWalletUtils: IDataWalletUtils,
    ) {}

    public requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError> {
        throw new Error("Method not implemented.");
    }

    public onAdDisplayed(queryCID: IpfsCID, adKey: AdKey, contentHash: SHA256Hash): ResultAsync<void, Error> {
        throw new Error("Method not implemented.");
    }

    public createAdSignature(eligibleAd: EligibleAd): ResultAsync<AdSignature, Error> {

        return ResultUtils.combine([
            this.cryptoUtils.hashStringSHA256(JSON.stringify(eligibleAd)),
            this.contextProvider.getContext().andThen((context) => {
                return this.dataWalletUtils.deriveOptInPrivateKey(
                    eligibleAd.consentContractAddress,
                    context.dataWalletKey!,
                );
            })
        ]).andThen(([contentHash, optInPrivateKey]) => {

            return this.cryptoUtils.signMessage(
                contentHash, optInPrivateKey
            ).map((signature) => {

                return new AdSignature(
                    eligibleAd.consentContractAddress,
                    eligibleAd.queryCID,
                    eligibleAd.key,
                    contentHash, //base64
                    signature
                );
            })
        });
    }

    public getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError> {
        return this.dataWalletPersistence.getEligibleAds();
    }

    public saveEligibleAds(
        ads: EligibleAd[],
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.saveEligibleAds(ads);
    }

    public getAdSignatures(): ResultAsync<AdSignature[], PersistenceError> {
        return this.dataWalletPersistence.getAdSignatures();
    }

    public saveAdSignatures(
        adSigList: AdSignature[]
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.saveAdSignatures(adSigList);
    }
}
