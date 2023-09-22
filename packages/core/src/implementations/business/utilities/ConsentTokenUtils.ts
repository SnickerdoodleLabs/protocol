import {
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  ConsentToken,
  EVMContractAddress,
  HexString32,
  PersistenceError,
  BlockchainCommonErrors,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
} from "@core/interfaces/data/index.js";

@injectable()
export class ConsentTokenUtils {
  public constructor(
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
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
    | BlockchainCommonErrors
  > {
    return this.invitationRepo.getAcceptedInvitations().andThen((optIns) => {
      const currentOptIn = optIns.find((optIn) => {
        return optIn.consentContractAddress == consentContractAddress;
      });
      if (currentOptIn == null) {
        return okAsync(null);
      }
      return this.consentRepo.getConsentToken(
        currentOptIn.consentContractAddress,
        currentOptIn.tokenId,
      );
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
    | BlockchainCommonErrors
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
