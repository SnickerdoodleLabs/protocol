import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  EligibleAd,
  PersistenceError,
  AdSignature,
  IpfsCID,
  SHA256Hash,
  UninitializedError,
  IPFSError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IAdService } from "@core/interfaces/business/index.js";
import {
  IAdContentRepository,
  IAdDataRepository,
  IAdDataRepositoryType,
  IAdRepositoryType,
} from "@core/interfaces/data/index.js";
import { CoreContext } from "@core/interfaces/objects/index.js";
import {
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class AdService implements IAdService {
  constructor(
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(IAdRepositoryType)
    protected adContentRepository: IAdContentRepository,
    @inject(IAdDataRepositoryType)
    protected adDataRepo: IAdDataRepository,
  ) {}

  public requestDisplay(
    ad: EligibleAd,
  ): ResultAsync<boolean, PersistenceError> {
    throw new Error("Method not implemented.");
  }

  public onAdDisplayed(
    eligibleAd: EligibleAd,
  ): ResultAsync<void, UninitializedError | IPFSError | PersistenceError> {
    return this.createAdSignature(eligibleAd).andThen((adSignature) => {
      return this.adDataRepo.saveAdSignatures([adSignature]);
    });
  }

  private createAdSignature(
    eligibleAd: EligibleAd,
  ): ResultAsync<AdSignature, UninitializedError | IPFSError> {
    return this._validateAndGetContext().andThen((context) => {
      return ResultUtils.combine([
        this.dataWalletUtils.deriveOptInPrivateKey(
          eligibleAd.consentContractAddress,
          context.dataWalletKey!,
        ),
        this.getHashedAdContentByIpfsCID(eligibleAd.content.src),
      ]).andThen(([optInPrivateKey, contentHash]) => {
        return this.cryptoUtils
          .signMessage(contentHash, optInPrivateKey)
          .map((signature) => {
            return new AdSignature(
              eligibleAd.consentContractAddress,
              eligibleAd.queryCID,
              eligibleAd.key,
              signature,
            );
          });
      });
    });
  }

  private getHashedAdContentByIpfsCID(
    cid: IpfsCID,
  ): ResultAsync<SHA256Hash, IPFSError> {
    return this.adContentRepository
      .getRawAdContentByCID(cid)
      .andThen(this.cryptoUtils.hashStringSHA256);
  }

  private _validateAndGetContext(): ResultAsync<
    CoreContext,
    UninitializedError
  > {
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(new UninitializedError("Core is not unlocked!"));
      }

      return okAsync(context);
    });
  }
}
