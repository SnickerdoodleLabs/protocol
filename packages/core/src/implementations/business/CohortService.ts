/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TypedDataField } from "@ethersproject/abstract-signer";
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
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
  ConsentContractError,
  ConsentContractRepositoryError,
  BlockchainProviderError,
  AjaxError,
  EVMAccountAddress,
  BigNumberString,
  TokenUri,
  MinimalForwarderContractError,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICohortService } from "@core/interfaces/business";
import {
  IInsightPlatformRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
  IDNSRepositoryType,
  IDNSRepository,
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
    @inject(IDNSRepositoryType) protected dnsRepository: IDNSRepository,
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
            this.dnsRepository.fetchTXTRecords(invitation.domain),
          ]);
        })
        .map(([domains, domainTXT]) => {
          // The contract must include the domain
          if (!domains.includes(invitation.domain)) {
            return EInvitationStatus.Invalid;
          }

          // TODO: Uncomment this when we have DNS simulation working!
          // if (!domainTXT.includes(invitation.consentContractAddress)) {
          //   return EInvitationStatus.Invalid;
          // }

          return EInvitationStatus.New;
        });
    });
  }

  public acceptInvitation(
    invitation: CohortInvitation,
    consentConditions: ConsentConditions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.contractFactory.factoryConsentContracts([
        invitation.consentContractAddress,
      ]),
      this.contractFactory.factoryMinimalForwarderContract(),
    ]).andThen(([config, context, [consentContract], minimalForwarder]) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // Encode the call to the consent contract
      const callData = consentContract.encodeOptIn(
        invitation.tokenId,
        TokenUri("ConsentConditionsGoHere"),
      );

      return minimalForwarder
        .getNonce(EVMAccountAddress(context.dataWalletAddress))
        .andThen((nonce) => {
          // We need to take the types, and send it to the account signer
          const value = {
            to: invitation.consentContractAddress, // Contract address for the metatransaction
            from: EVMAccountAddress(context.dataWalletAddress!), // EOA to run the transaction as (linked account, not derived)
            value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(1000000), // The amount of gas to pay.
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: callData, // The actual bytes of the request, encoded as a hex string
          } as IMinimalForwarderRequest;

          return this.cryptoUtils
            .signTypedData(
              getMinimalForwarderSigningDomain(
                config.controlChainId,
                config.controlChainInformation.metatransactionForwarderAddress,
              ),
              forwardRequestTypes,
              value,
              context.dataWalletKey!,
            )
            .andThen((metatransactionSignature) => {
              // Got the signature for the metatransaction, now we can execute it.
              // .executeMetatransaction will sign everything and have the server run
              // the metatransaction.
              return this.insightPlatformRepo.executeMetatransaction(
                context.dataWalletAddress!, // data wallet address
                EVMAccountAddress(context.dataWalletAddress!), // account address
                invitation.consentContractAddress, // contract address
                BigNumberString(BigNumber.from(nonce).toString()),
                callData,
                metatransactionSignature,
                context.dataWalletKey!,
              );
            });
        })
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
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentContractError
    | ConsentContractRepositoryError
    | ConsentError
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return ResultUtils.combine([
      this.configProvider.getConfig(),
      this.contextProvider.getContext(),
      this.contractFactory.factoryConsentContracts([consentContractAddress]),
      this.contractFactory.factoryMinimalForwarderContract(),
    ]).andThen(([config, context, [consentContract], minimalForwarder]) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // We need to find your opt-in token
      return this.consentRepo
        .getCurrentConsentToken(
          consentContractAddress,
          EVMAccountAddress(context.dataWalletAddress),
        )
        .andThen((consentTokens) => {
          console.log(consentTokens);
          // These are all of your consent tokens, we need to find the one for this particular consent contract
          const consentToken = consentTokens.find((token) => {
            return token.consentContractAddress == consentContractAddress;
          });

          if (consentToken == null) {
            // You're not actually opted in!
            return errAsync(
              new ConsentError(
                "Cannot opt out of consent contract, you were not opted in!",
              ),
            );
          }

          // Encode the call to the consent contract
          const callData = consentContract.encodeOptOut(consentToken.tokenId);

          return minimalForwarder
            .getNonce(EVMAccountAddress(context.dataWalletAddress!))
            .andThen((nonce) => {
              // We need to take the types, and send it to the account signer
              const value = {
                to: consentContractAddress, // Contract address for the metatransaction
                from: EVMAccountAddress(context.dataWalletAddress!), // EOA to run the transaction as (linked account, not derived)
                value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
                gas: BigNumber.from(1000000), // The amount of gas to pay.
                nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
                data: callData, // The actual bytes of the request, encoded as a hex string
              } as IMinimalForwarderRequest;

              return this.cryptoUtils
                .signTypedData(
                  getMinimalForwarderSigningDomain(
                    config.controlChainId,
                    config.controlChainInformation
                      .metatransactionForwarderAddress,
                  ),
                  forwardRequestTypes,
                  value,
                  context.dataWalletKey!,
                )
                .andThen((metatransactionSignature) => {
                  // Got the signature for the metatransaction, now we can execute it.
                  // .executeMetatransaction will sign everything and have the server run
                  // the metatransaction.
                  return this.insightPlatformRepo.executeMetatransaction(
                    context.dataWalletAddress!, // data wallet address
                    EVMAccountAddress(context.dataWalletAddress!), // account address
                    consentContractAddress, // contract address
                    BigNumberString(BigNumber.from(nonce).toString()),
                    callData,
                    metatransactionSignature,
                    context.dataWalletKey!,
                  );
                });
            })
            .map(() => {
              // Notify the world that we've opted in to the cohort
              context.publicEvents.onCohortLeft.next(consentContractAddress);
            });
        });
    });
  }
}
