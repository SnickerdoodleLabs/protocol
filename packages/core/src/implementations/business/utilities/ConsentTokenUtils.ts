import {
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  ConsentToken,
  EVMContractAddress,
  HexString32,
  PersistenceError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/index.js";

@injectable()
export class ConsentTokenUtils {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
  ) {}

  // This is nearly identical to ConsentContractRepo.getConsentToken, but does the lookup
  // of accepted invites for you.
  public getCurrentConsentToken(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | PersistenceError
  > {
    return this.persistenceRepo.getAcceptedInvitations().andThen((optIns) => {
      const currentOptIn = optIns.find((optIn) => {
        return optIn.consentContractAddress == consentContractAddress;
      });
      if (currentOptIn == null) {
        return okAsync(null);
      }
      return this.consentRepo.getConsentToken(currentOptIn);
    });
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | PersistenceError
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | ConsentFactoryContractError
  > {
    return this.getCurrentConsentToken(consentContractAddress).andThen(
      (consentToken) => {
        if (consentToken == null) {
          // not opted in!
          return errAsync(
            new ConsentError(
              `User is not opted in to consent contract ${consentContractAddress}`,
            ),
          );
        }
        return this.consentRepo
          .getConsentContracts([consentContractAddress])
          .andThen((contractMap) => {
            const contract = contractMap.get(consentContractAddress);
            if (contract == null) {
              return errAsync(
                new ConsentError(
                  `Cannot get agreement flags for contract ${consentContractAddress}, you are not opted in!`,
                ),
              );
            }
            return contract.agreementFlags(consentToken.tokenId);
          });
      },
    );
  }
}
