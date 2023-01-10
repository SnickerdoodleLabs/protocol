import { IAdService } from "@core/interfaces/business/index.js";
import { IAdRepository, IAdRepositoryType } from "@core/interfaces/data/index.js";
import { CoreContext } from "@core/interfaces/objects/index.js";
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
    UninitializedError,
    IPFSError,
    EVMContractAddress,
    EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";


@injectable()
export class AdService implements IAdService {

    constructor(
        @inject(IDataWalletPersistenceType) protected dataWalletPersistence: IDataWalletPersistence,
        @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
        @inject(IContextProviderType) protected contextProvider: IContextProvider,
        @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
        @inject(IAdRepositoryType) protected adRepository: IAdRepository,
    ) {}

    public requestDisplay(ad: EligibleAd): ResultAsync<boolean, PersistenceError> {
        throw new Error("Method not implemented.");
    }

    public onAdDisplayed(queryCID: IpfsCID, adKey: AdKey, contentHash: SHA256Hash): ResultAsync<void, Error> {
        throw new Error("Method not implemented.");
    }

    public createAdSignature(
        eligibleAd: EligibleAd
    ): ResultAsync<AdSignature, Error> {

        return this._validateAndGetContext().andThen((context) => {

            return ResultUtils.combine([
                this.dataWalletUtils.deriveOptInPrivateKey(eligibleAd.consentContractAddress, context.dataWalletKey!),
                this.getHashedAdContentByIpfsCID(eligibleAd.content.src)
            ]).andThen(([optInPrivateKey, contentHash]) => {

                return this.cryptoUtils.signMessage(contentHash, optInPrivateKey).map((signature) => {
    
                    return new AdSignature(
                        eligibleAd.consentContractAddress,
                        eligibleAd.queryCID,
                        eligibleAd.key,
                        contentHash,
                        signature
                    );
                });
            });
        });
    }

    private getHashedAdContentByIpfsCID(cid: IpfsCID): ResultAsync<SHA256Hash, IPFSError> {
        return this.adRepository.getRawAdContentByCID(cid)
            .andThen(this.cryptoUtils.hashStringSHA256);
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

    private _validateAndGetContext(): ResultAsync<CoreContext, UninitializedError> {

        return this.contextProvider.getContext().andThen((context) => {

            if (context.dataWalletAddress == null || context.dataWalletKey == null) {
                return errAsync(new UninitializedError("Core is not unlocked!"));
            }

            return okAsync(context);
        });
    }
}
