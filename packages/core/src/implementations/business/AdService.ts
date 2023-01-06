import { IAdService } from "@core/interfaces/business";
import {
    IDataWalletPersistenceType,
    IDataWalletPersistence,
    EligibleAd,
    PersistenceError,
    AdKey,
    AdSignatureWrapper,
    IpfsCID,
    SHA256Hash,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";


@injectable()
export class AdService implements IAdService {

    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {}


    getAdSignatures(): ResultAsync<AdSignatureWrapper[], PersistenceError> {
        throw new Error("Method not implemented.");
    }
    requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    onAdDisplayed(queryCID: IpfsCID, adKey: AdKey, contentHash: SHA256Hash): ResultAsync<void, Error> {
        throw new Error("Method not implemented.");
    }
    createAdSignature(queryCID: IpfsCID, adKey: AdKey, contentHash: SHA256Hash): ResultAsync<AdSignatureWrapper, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    saveAdSignatures(adSignatureWrapperList: AdSignatureWrapper[]): ResultAsync<void, PersistenceError> {
        throw new Error("Method not implemented.");
    }

    public getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError> {
        return this.dataWalletPersistence.getEligibleAds();
    }

    public saveEligibleAds(
        ads: EligibleAd[],
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.addEligibleAds(ads);
    }
}
