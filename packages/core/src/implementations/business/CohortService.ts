/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TypedDataField } from "@ethersproject/abstract-signer";
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  CohortInvitation,
  EInvitationStatus,
  UninitializedError,
  PersistenceError,
  ConsentConditions,
  ConsentError,
  EVMContractAddress,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  Signature,
  ConsentContractError,
  ConsentContractRepositoryError,
  BlockchainProviderError,
  AjaxError,
  IPFSError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICohortService } from "@core/interfaces/business";
import {
  IInsightPlatformRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
} from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory";

@injectable()
export class CohortService implements ICohortService {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
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
    ]).andThen(([rejectedConsentContracts, optedIn]) => {
      const rejected = rejectedConsentContracts.includes(
        invitation.consentContractAddress,
      );

      // If we are opted in, that wins
      if (optedIn) {
        return okAsync(EInvitationStatus.Accepted);
      }

      // Next winner, the reject list
      if (rejected) {
        return okAsync(EInvitationStatus.Rejected);
      }

      // Not rejected or already in the cohort, we need to verify the invitation
      return this.contractFactory
        .factoryConsentContracts([invitation.consentContractAddress])
        .andThen((contracts) => {
          const contract = contracts[0];
          return ResultUtils.combine([
            contract.getDomains(),
            this.insightPlatformRepo.getTXTRecords(invitation.domain),
          ]);
        })
        .map(([domains, domainTXT]) => {
          // The contract must include the domain
          if (!domains.includes(invitation.domain)) {
            return EInvitationStatus.Invalid;
          }

          if (!domainTXT.includes(invitation.consentContractAddress)) {
            return EInvitationStatus.Invalid;
          }

          return EInvitationStatus.New;
        });
    });
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<void, UninitializedError | PersistenceError | AjaxError> {
    // TODO: Need to sign the invitation with our data wallet!
    //context.dataWalletKey
    const signature = Signature("TODO, this should sign the invitation!");

    // Not already opted in. We are only supporting a lazy opt-in process, whereby the business pays the gas
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }
      return this.insightPlatformRepo
        .acceptInvitation(context.dataWalletAddress, invitation, signature)
        .map(() => {
          // Notify the world that we've opted in to the cohort
          context.publicEvents.onCohortJoined.next(
            invitation.consentContractAddress,
          );
        });
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
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  > {
    return ResultUtils.combine([
      this.consentRepo.isAddressOptedIn(consentContractAddress),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([optedIn, context, config]) => {
      if (!optedIn) {
        return errAsync(
          new ConsentError(
            `Cannot opt out of cohort ${consentContractAddress}, as you are a member`,
          ),
        );
      }

      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // Need to sign the request to leave
      const value = {
        consentContractAddress: consentContractAddress,
      } as Record<string, unknown>;

      const types: Record<string, TypedDataField[]> = {
        LeaveCohort: [{ name: "consentContractAddress", type: "string" }],
      };

      return this.cryptoUtils
        .signTypedData(
          config.snickerdoodleProtocolDomain,
          types,
          value,
          context.dataWalletKey,
        )
        .andThen((signature) => {
          return this.insightPlatformRepo.leaveCohort(
            context.dataWalletAddress!,
            consentContractAddress,
            signature,
          );
        })
        .map(() => {
          context.publicEvents.onCohortLeft.next(consentContractAddress);
        });
    });
  }

  // If checkInvitationStatus id VALID, we can get its details here
  public getInvitationDetails(
    invitation: CohortInvitation,
  ): ResultAsync<
    JSON,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
    | Error
  > {
    return this.consentRepo
      .getBaseURI(invitation.consentContractAddress)
      .andThen((baseURI) => {
        // make ipfs http address
        const ipfsURL = "http://ipfs.io/" + baseURI;

        return ResultAsync.fromPromise(fetch(ipfsURL), (e) => {
          return new Error("Fetch error");
        }).andThen((response) => {
          return ResultAsync.fromPromise(response.json(), (e) => {
            return new Error("json() error");
          });
        });
      });
    // The baseURI would be an IPFS CID that is type <NFTMetadata> based on reference below:
    //https://docs.opensea.io/docs/metadata-standards#metadata-structure
    // do ipfs check to retrieve its json
    // return the json object
  }
}
