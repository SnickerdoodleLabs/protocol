import { IAdService } from "@core/interfaces/business";
import {
    IDataWalletPersistenceType,
    IDataWalletPersistence,
    EligibleAd,
    PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";



@injectable()
export class AdService implements IAdService {

    constructor(
        @inject(IDataWalletPersistenceType)
        protected dataWalletPersistence: IDataWalletPersistence,
    ) {}

    public getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError> {
        return this.dataWalletPersistence.getEligibleAds();
    }

    public addEligibleAds(
        ads: EligibleAd[],
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.addEligibleAds(ads);
    }
}
