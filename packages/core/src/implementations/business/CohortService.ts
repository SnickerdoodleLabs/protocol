import {
  CohortInvitation,
  EInvitationStatus,
  UninitializedError,
  PersistenceError,
  ConsentConditions,
  ConsentError,
  EthereumContractAddress,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  Signature,
  ConsentContractError,
  ConsentContractRepositoryError,
  BlockchainProviderError,
  AjaxError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IInsightPlatformRepositoryType } from "../data";

import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
} from "@browser-extension/interfaces/data";
import {
  IContextProvider,
  IContextProviderType,
} from "@browser-extension/interfaces/utilities";
import { ICohortService } from "@core/interfaces/business";

@injectable()
export class CohortService implements ICohortService {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public checkInvitationStatus(
    invitation: CohortInvitation,
  ): ResultAsync<
    EInvitationStatus,
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.persistenceRepo.getRejectedCohorts(),
      this.consentRepo.isAddressOptedIn(invitation.consentContractAddress),
    ]).map(([rejectedConsentContracts, optedIn]) => {
      const rejected = rejectedConsentContracts.includes(
        invitation.consentContractAddress,
      );

      // If we are opted in, that wins
      if (optedIn) {
        return EInvitationStatus.Accepted;
      }

      // Next winner, the reject list
      if (rejected) {
        return EInvitationStatus.Rejected;
      }

      return EInvitationStatus.New;
    });
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, UninitializedError | PersistenceError> {
    // TODO: Need to sign the invitation with our data wallet!
    //context.dataWalletKey
    const signature = Signature("TODO, this should sign the invitation!");

    // Not already opted in. We are only supporting a lazy opt-in process, whereby the business pays the gas
    return ResultUtils.combine([
      this.insightPlatformRepo.acceptInvitation(invitation, signature),
      this.contextProvider.getContext(),
    ]).map(([tokenId, context]) => {
      // Notify the world that we've opted in to the cohort
      context.publicEvents.onCohortJoined.next(
        invitation.consentContractAddress,
      );
    });
  }

  public rejectInvitation(
    invitation: CohortInvitation,
  ): ResultAsync<
    void,
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  > {
    // Need to check first if we are already opted in
    return this.consentRepo
      .isAddressOptedIn(invitation.consentContractAddress)
      .andThen((optedIn) => {
        if (optedIn) {
          return errAsync(
            new ConsentError(
              `Cannot reject an invitation to consent contract ${invitation.consentContractAddress}, as you are already have a consent token`,
            ),
          );
        }

        return this.persistenceRepo.addRejectedCohorts([
          invitation.consentContractAddress,
        ]);
      });
  }

  public leaveCohort(
    consentContractAddress: EthereumContractAddress,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  > {
    return this.consentRepo
      .isAddressOptedIn(consentContractAddress)
      .andThen((optedIn) => {
        if (!optedIn) {
          return errAsync(
            new ConsentError(
              `Cannot opt out of cohort ${consentContractAddress}, as you are a member`,
            ),
          );
        }

        return this.insightPlatformRepo.leaveCohort(consentContractAddress);
      })
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onCohortLeft.next(consentContractAddress);
      });
  }
}
