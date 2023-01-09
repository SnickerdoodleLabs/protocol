import { IAdService } from "@core/interfaces/business";
import { IContextProvider, IContextProviderType } from "@core/interfaces/utilities";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
import {
    IDataWalletPersistenceType,
    IDataWalletPersistence,
    EligibleAd,
    PersistenceError,
    AdKey,
    AdSignatureWrapper,
    IpfsCID,
    SHA256Hash,
    Signature,
    EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
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
    ) {}


    getAdSignatures(): ResultAsync<AdSignatureWrapper[], PersistenceError> {
        return this.dataWalletPersistence.getAdSignatures();
    }

    requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError> {
        throw new Error("Method not implemented.");
    }
    onAdDisplayed(queryCID: IpfsCID, adKey: AdKey, contentHash: SHA256Hash): ResultAsync<void, Error> {
        throw new Error("Method not implemented.");
    }

    public createAdSignature(eligibleAd: EligibleAd): ResultAsync<AdSignatureWrapper, Error> {

        return ResultUtils.combine([
            this.cryptoUtils.hashStringSHA256(JSON.stringify(eligibleAd)),
            this.contextProvider.getContext()
        ])
        .andThen(([contentHash, context]) => {

            return this.cryptoUtils.signMessage(
                contentHash, context.dataWalletKey!
            ).andThen((signature) => {

                return okAsync(
                    new AdSignatureWrapper(
                        eligibleAd.queryCID,
                        eligibleAd.key,
                        contentHash, //base64
                        signature
                    )
                );
            })
        });
    }

    public saveAdSignatures(
        adSignatureWrapperList: AdSignatureWrapper[]
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.saveAdSignatures(adSignatureWrapperList);
    }

    public getEligibleAds(): ResultAsync<EligibleAd[], PersistenceError> {
        return this.dataWalletPersistence.getEligibleAds();
    }

    public saveEligibleAds(
        ads: EligibleAd[],
    ): ResultAsync<void, PersistenceError> {
        return this.dataWalletPersistence.saveEligibleAds(ads);
    }
}
