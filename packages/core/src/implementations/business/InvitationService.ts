/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IERC7529Utils, IERC7529UtilsType } from "@snickerdoodlelabs/erc7529";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AccountAddress,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  HexString32,
  Invitation,
  IOldUserAgreement,
  IpfsCID,
  IPFSError,
  LinkedAccount,
  IConsentCapacity,
  MinimalForwarderContractError,
  PageInvitation,
  PersistenceError,
  Signature,
  TokenId,
  UninitializedError,
  UnixTimestamp,
  DataPermissionsUpdatedEvent,
  BlockchainCommonErrors,
  InvalidArgumentError,
  OptInInfo,
  IUserAgreement,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentTokenUtils,
  IConsentTokenUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IMetatransactionForwarderRepository,
  IMetatransactionForwarderRepositoryType,
} from "@core/interfaces/data/index.js";
import { MetatransactionRequest } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class InvitationService implements IInvitationService {
  public constructor(
    @inject(IConsentTokenUtilsType)
    protected consentTokenUtils: IConsentTokenUtils,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
    @inject(IMetatransactionForwarderRepositoryType)
    protected forwarderRepo: IMetatransactionForwarderRepository,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(IERC7529UtilsType) protected erc7529Utils: IERC7529Utils,
  ) {}

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<
    EInvitationStatus,
    | PersistenceError
    | ConsentContractError
    | ConsentFactoryContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | BlockchainCommonErrors
  > {
    let cleanupActions = okAsync<void, PersistenceError>(undefined);
    return ResultUtils.combine([
      this.invitationRepo.getRejectedInvitations(),
      this.invitationRepo.getAcceptedInvitations(),
      // isAddressOptedIn() just checks for a balance- it does not require that the persistence
      // layer actually know about the token
      this.consentRepo.isAddressOptedIn(invitation.consentContractAddress),
      this.consentRepo.getConsentCapacity(invitation.consentContractAddress),
      this.consentRepo.isOpenOptInDisabled(invitation.consentContractAddress),
      this.consentRepo.getConsentContracts([invitation.consentContractAddress]),
      this.configProvider.getConfig(),
    ])
      .andThen(
        ([
          rejectedConsentContracts,
          acceptedInvitations,
          optedInOnChain,
          consentCapacity,
          openOptInDisabled,
          consentContracts,
          config,
        ]) => {
          const rejected = rejectedConsentContracts.includes(
            invitation.consentContractAddress,
          );

          const acceptedInvitation = acceptedInvitations.find((ai) => {
            return (
              ai.consentContractAddress.toLowerCase() ==
              invitation.consentContractAddress.toLowerCase()
            );
          });

          const consentContract = consentContracts.get(
            invitation.consentContractAddress,
          );
          if (consentContract == null) {
            return errAsync(
              new ConsentContractError(
                `No consent contract found for ${invitation.consentContractAddress} from getConsentContracts()`,
              ),
            );
          }

          // If we are opted in, that wins
          if (optedInOnChain) {
            // Check if know about the opt-in in the persistence
            if (acceptedInvitation != null) {
              // Persistence and chain match!
              return okAsync(EInvitationStatus.Accepted);
            }
            // There's no known accepted invitation
            // Get latest opt-in tokenId from chain, and restore Invitation in the persistence
            return this.consentRepo
              .getLatestConsentTokenId(invitation.consentContractAddress)
              .andThen((tokenIdOrNull) => {
                if (tokenIdOrNull == null) {
                  return errAsync(new ConsentContractError("No token ID"));
                }
                return this.invitationRepo
                  .addAcceptedInvitations([
                    new OptInInfo(
                      invitation.consentContractAddress,
                      tokenIdOrNull ?? invitation.tokenId,
                    ),
                  ])
                  .map(() => EInvitationStatus.Accepted);
              });
          }

          // If we are opted in in the persistence, but not on chain, we need to update the persistence
          if (acceptedInvitation != null && !optedInOnChain) {
            // This is a problem
            // We need to fix the persistence and then evaluate the rest of this stuff.
            // Fortunately the rest of the stuff doesn't care about acceptedInvitation,
            // so we'll just add a cleanupAction.
            cleanupActions =
              this.invitationRepo.removeAcceptedInvitationsByContractAddress([
                invitation.consentContractAddress,
              ]);
          }

          // Next winner, the reject list
          if (rejected) {
            return okAsync(EInvitationStatus.Rejected);
          }

          // Next up, if there are no slots available, then it's an Invalid invitation
          if (consentCapacity.availableOptInCount == 0) {
            return okAsync(EInvitationStatus.OutOfCapacity);
          }

          // If invitation has business signature verify signature
          if (
            invitation.businessSignature != null &&
            invitation.tokenId != null
          ) {
            // If business signature exist then open optIn should be disabled
            if (!openOptInDisabled) {
              return okAsync(EInvitationStatus.Invalid);
            }

            const tokenId = invitation.tokenId;

            // Check if the consent token already exists
            // If it does, it means this invitation has already been claimed
            return this.consentRepo
              .getConsentToken(invitation.consentContractAddress, tokenId)
              .andThen((existingConsentToken) => {
                // If the existing consent token exists, it must NOT be owned by us- we'd have found
                // the token via isAddressOptedIn() above. So somebody else has gotten this invitation.
                if (existingConsentToken != null) {
                  return okAsync(EInvitationStatus.Occupied);
                }
                return this.isValidSignatureForInvitation(
                  invitation.consentContractAddress,
                  tokenId,
                  invitation.businessSignature!,
                ).map((validSignature) => {
                  return validSignature
                    ? EInvitationStatus.New
                    : EInvitationStatus.Invalid;
                });
              });
          }

          // If business signature does not exist then open optIn should not be disabled
          if (openOptInDisabled) {
            return okAsync(EInvitationStatus.Invalid);
          }

          // If invitation belongs any domain verify URLs
          if (invitation.domain) {
            const domain = invitation.domain;

            return this.erc7529Utils
              .verifyContractForDomain(
                consentContract,
                domain,
                config.controlChainId,
              )
              .map((verified) => {
                if (!verified) {
                  return EInvitationStatus.Invalid;
                }
                return EInvitationStatus.New;
              });
          }
          return okAsync(EInvitationStatus.New);
        },
      )
      .andThen((invitationStatus) => {
        // If there are any cleanup actions, do them now.
        // Right now, this should just be fixing our persistence.
        return cleanupActions.map(() => {
          return invitationStatus;
        });
      });
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | ConsentError
    | ConsentContractError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ])
      .andThen(([context, config]) => {
        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError("Data wallet has not been initialized yet!"),
          );
        }

        if (
          invitation.businessSignature != null &&
          invitation.tokenId == null
        ) {
          return errAsync(
            new InvalidArgumentError(
              "tokenId is required for signed invitations",
            ),
          );
        }

        let invitationCheck = okAsync<
          void,
          | ConsentContractError
          | UninitializedError
          | BlockchainProviderError
          | AjaxError
          | BlockchainCommonErrors
          | ConsentFactoryContractError
          | ConsentError
        >(undefined);
        if (invitation.domain != null) {
          invitationCheck = this.consentRepo
            .getConsentContract(invitation.consentContractAddress)
            .andThen((consentContract) => {
              return this.erc7529Utils.verifyContractForDomain(
                consentContract,
                invitation.domain!,
                config.controlChainId,
              );
            })
            .andThen((matchingTxt) => {
              if (!matchingTxt) {
                return errAsync(
                  new ConsentError(
                    `Invitation for contract ${invitation.consentContractAddress} does not have valid domain information. Check the DNS settings for a proper TXT record!`,
                  ),
                );
              }
              return okAsync(undefined);
            });
        }

        return invitationCheck
          .andThen(() => {
            return this.dataWalletUtils.deriveOptInPrivateKey(
              invitation.consentContractAddress,
              context.dataWalletKey!,
            );
          })
          .andThen((optInPrivateKey) => {
            if (
              invitation.businessSignature != null &&
              invitation.tokenId != null
            ) {
              // It's a private invitation
              return okAsync({
                optInData: this.consentRepo.encodeAnonymousRestrictedOptIn(
                  invitation.consentContractAddress,
                  invitation.tokenId,
                  invitation.businessSignature,
                  dataPermissions,
                ),
                context,
                optInPrivateKey,
                tokenId: invitation.tokenId,
              });
            }

            return (
              invitation.tokenId == null
                ? this.cryptoUtils.getTokenId()
                : okAsync(invitation.tokenId)
            ).map((tokenId) => {
              return {
                optInData: this.consentRepo.encodeOptIn(
                  invitation.consentContractAddress,
                  tokenId,
                  dataPermissions,
                ),
                context,
                optInPrivateKey,
                tokenId,
              };
            });
          });
      })
      .andThen(({ optInData, context, optInPrivateKey, tokenId }) => {
        const optInAddress =
          this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            optInPrivateKey,
          );

        this.logUtils.log(
          `Opting in to consent contract ${invitation.consentContractAddress} with derived account ${optInAddress}`,
        );

        // We are adding the invitation to persistence NOW, because it is super important that we
        // save that. It's basically impossible to figure out what contracts you are opted into
        // by just looking at the blockchain (intentionally)!
        return ResultUtils.combine([
          optInData,
          this.forwarderRepo.getNonce(optInAddress),
          this.configProvider.getConfig(),
          this.invitationRepo.addAcceptedInvitations([
            new OptInInfo(invitation.consentContractAddress, tokenId),
          ]),
        ])
          .andThen(([callData, nonce, config]) => {
            // We need to take the types, and send it to the account signer
            const request = new MetatransactionRequest(
              invitation.consentContractAddress, // Contract address for the metatransaction
              optInAddress, // EOA to run the transaction as
              BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
              BigNumber.from(config.gasAmounts.optInGas), // The amount of gas to pay.
              BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
              callData, // The actual bytes of the request, encoded as a hex string
            );

            return this.forwarderRepo
              .signMetatransactionRequest(request, optInPrivateKey)
              .andThen((metatransactionSignature) => {
                // Got the signature for the metatransaction, now we can execute it.
                // .executeMetatransaction will sign everything and have the server run
                // the metatransaction.
                return this.insightPlatformRepo.executeMetatransaction(
                  optInAddress, // account address
                  invitation.consentContractAddress, // contract address
                  BigNumberString(BigNumber.from(nonce).toString()),
                  BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                  BigNumberString(
                    BigNumber.from(config.gasAmounts.optInGas).toString(),
                  ), // The amount of gas to pay.
                  callData,
                  metatransactionSignature,
                  optInPrivateKey,
                  config.defaultInsightPlatformBaseUrl,
                );
              })
              .map(() => {
                this.consentRepo
                  .getConsentToken(invitation.consentContractAddress, tokenId)
                  .map((consentToken) => {
                    if (consentToken == null) {
                      this.logUtils.error(
                        `No consent token created on ${invitation.consentContractAddress} with derived account ${optInAddress} and token ID ${invitation.tokenId}`,
                      );
                    } else {
                      this.logUtils.log(
                        `Opted in to ${invitation.consentContractAddress} with derived account ${consentToken.ownerAddress} and token ID ${consentToken.tokenId}`,
                      );
                    }
                  });
              })
              .orElse((e) => {
                // Metatransaction failed!
                // Need to do some cleanup
                return this.invitationRepo
                  .removeAcceptedInvitationsByContractAddress([
                    invitation.consentContractAddress,
                  ])
                  .andThen(() => {
                    // Still an error
                    return errAsync(e);
                  });
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
    invitation: Invitation,
    rejectUntil?: UnixTimestamp,
  ): ResultAsync<
    void,
    | UninitializedError
    | PersistenceError
    | ConsentContractError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
    | BlockchainCommonErrors
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

        return this.invitationRepo.addRejectedInvitations(
          [invitation.consentContractAddress],
          rejectUntil ?? null,
        );
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
    | ConsentError
    | PersistenceError
    | BlockchainCommonErrors
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been initialized yet!"),
        );
      }

      // We need to find your opt-in token
      return this.invitationRepo
        .getAcceptedInvitations()
        .andThen((acceptedInvitations) => {
          const currentInvitation = acceptedInvitations.find((invitation) => {
            return invitation.consentContractAddress == consentContractAddress;
          });
          if (currentInvitation == null) {
            return errAsync(
              new ConsentError(
                "Cannot opt out of consent contract, you were not opted in!",
              ),
            );
          }
          return ResultUtils.combine([
            this.consentRepo.getConsentToken(
              currentInvitation.consentContractAddress,
              currentInvitation.tokenId,
            ),
            this.dataWalletUtils.deriveOptInPrivateKey(
              consentContractAddress,
              context.dataWalletKey!,
            ),
          ]);
        })
        .andThen(([consentToken, optInPrivateKey]) => {
          if (consentToken == null) {
            // You're not actually opted in!
            // But we think we are. We should remove this from persistence
            this.logUtils.warning(
              `No consent token found for ${consentContractAddress}, but an opt-in is in the persistence. Removing from persistence!`,
            );
            return okAsync(undefined);
          }

          this.logUtils.debug("Existing consent token ", consentToken);

          const optInAccountAddress =
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              optInPrivateKey,
            );

          this.logUtils.log(
            `Opting out of consent contract ${consentContractAddress} with derived account ${optInAccountAddress}`,
          );

          // Encode the call to the consent contract and get the nonce for the forwarder
          return ResultUtils.combine([
            this.consentRepo.encodeOptOut(
              consentContractAddress,
              consentToken.tokenId,
            ),
            this.forwarderRepo.getNonce(optInAccountAddress),
            this.configProvider.getConfig(),
          ]).andThen(([callData, nonce, config]) => {
            const request = new MetatransactionRequest(
              consentContractAddress, // Contract address for the metatransaction
              optInAccountAddress, // EOA to run the transaction as
              BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
              BigNumber.from(config.gasAmounts.optOutGas), // The amount of gas to pay.
              BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
              callData, // The actual bytes of the request, encoded as a hex string
            );

            return this.forwarderRepo
              .signMetatransactionRequest(request, optInPrivateKey)
              .andThen((metatransactionSignature) => {
                // Got the signature for the metatransaction, now we can execute it.
                // .executeMetatransaction will sign everything and have the server run
                // the metatransaction.
                return this.insightPlatformRepo.executeMetatransaction(
                  optInAccountAddress, // account address
                  consentContractAddress, // contract address
                  BigNumberString(BigNumber.from(nonce).toString()),
                  BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                  BigNumberString(
                    BigNumber.from(config.gasAmounts.optOutGas).toString(),
                  ), // The amount of gas to pay.
                  callData,
                  metatransactionSignature,
                  optInPrivateKey,
                  config.defaultInsightPlatformBaseUrl,
                );
              });
          });
        })
        .andThen(() => {
          return this.invitationRepo.removeAcceptedInvitationsByContractAddress(
            [consentContractAddress],
          );
        })
        .map(() => {
          // Notify the world that we've opted in to the cohort
          context.publicEvents.onCohortLeft.next(consentContractAddress);
        });
    });
  }

  public getAcceptedInvitations(): ResultAsync<OptInInfo[], PersistenceError> {
    return this.invitationRepo.getAcceptedInvitations();
  }

  public getInvitationsByDomain(
    domain: DomainName,
  ): ResultAsync<
    PageInvitation[],
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | IPFSError
    | PersistenceError
    | BlockchainCommonErrors
  > {
    return this.configProvider
      .getConfig()
      .andThen((config) => {
        return this.erc7529Utils.getContractsFromDomain(
          domain,
          config.controlChainId,
        );
      })
      .andThen((contractAddresses) => {
        return ResultUtils.combine(
          contractAddresses.map((consentContractAddress) => {
            return this.getInvitationsFromConsentContract(
              domain,
              consentContractAddress,
            );
          }),
        );
      })
      .map((invitations) => {
        return invitations.flat();
      });
  }

  public getAcceptedInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
    | BlockchainCommonErrors
  > {
    return this.invitationRepo
      .getAcceptedInvitations()
      .andThen((optInInfo) => {
        return this.consentRepo.getConsentContracts(
          optInInfo.map((oii) => oii.consentContractAddress),
        );
      })
      .andThen((consentContractMap) =>
        ResultUtils.combine(
          Array.from(consentContractMap.keys()).map((contractAddress) => {
            return this.consentRepo
              .getMetadataCID(contractAddress)
              .map((ipfsCID) => ({ ipfsCID, contractAddress }));
          }),
        ),
      )
      .map(
        (addressesWithCID) =>
          new Map(
            addressesWithCID.map((addressWithCID) => [
              addressWithCID.contractAddress,
              addressWithCID.ipfsCID,
            ]),
          ),
      );
  }

  public getConsentCapacity(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentCapacity,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.consentRepo.getConsentCapacity(consentContractAddress);
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOldUserAgreement | IUserAgreement, IPFSError> {
    return this.invitationRepo.getInvitationMetadataByCID(ipfsCID);
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.consentRepo.getMetadataCID(consentAddress);
  }

  protected getInvitationsFromConsentContract(
    domain: DomainName,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    PageInvitation[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | IPFSError
    | PersistenceError
    | BlockchainCommonErrors
    | AjaxError
  > {
    return ResultUtils.combine([
      this.consentRepo.getDomains(consentContractAddress),
      this.consentRepo.getMetadataCID(consentContractAddress),
      this.getConsentCapacity(consentContractAddress),
      this.configProvider.getConfig(),
      // @TODO - check later
      // this.invitationRepo.getRejectedInvitations(),
    ]).andThen(([domains, ipfsCID, consentCapacity, config]) => {
      // If there's no slots, there's no invites
      if (consentCapacity.availableOptInCount == 0) {
        return okAsync([]);
      }

      // @TODO - blocks the promise to be resolved
      // const rejected = rejectedInvitations.find((rejectedInvitation) => {
      //   return rejectedInvitation == consentContractAddress;
      // });

      // if (rejected != null) {
      //   return okAsync([]);
      // }

      // The baseUri is an IPFS CID
      return this.invitationRepo
        .getInvitationMetadataByCID(ipfsCID)
        .andThen((invitationMetadata) => {
          if (invitationMetadata == null) {
            return errAsync(
              new IPFSError(
                `No invitation details could be found at IPFS CID ${ipfsCID}`,
              ),
            );
          }
          return ResultUtils.combine(
            domains.map((domain) => {
              return this.cryptoUtils.getTokenId().map((tokenId) => {
                return new PageInvitation(
                  domain, // getDomains() is actually misnamed, it returns URLs now
                  new Invitation(
                    consentContractAddress,
                    tokenId,
                    domain,
                    null, // getInvitationsByDomain() is only for public invitations, so will never have a business signature
                  ),
                  invitationMetadata,
                );
              });
            }),
          );
        });
    });
  }

  public updateDataPermissions(
    consentContractAddress: EVMContractAddress,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | ConsentError
    | ConsentContractError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | AjaxError
    | BlockchainCommonErrors
  > {
    // This will actually create a metatransaction. We need to update the on-chain
    // DataPermissions. You can only do this every so often, which we will need to
    // enforce in the contract itself.
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been initialized yet!"),
        );
      }

      // We need to find your opt-in token
      return this.invitationRepo
        .getAcceptedInvitations()
        .andThen((acceptedInvitations) => {
          const currentInvitation = acceptedInvitations.find((invitation) => {
            return invitation.consentContractAddress == consentContractAddress;
          });
          if (currentInvitation == null) {
            return errAsync(
              new ConsentError(
                "Cannot update permissions for a consent contract you haven't opted in to",
              ),
            );
          }
          return ResultUtils.combine([
            this.consentRepo.getConsentToken(
              currentInvitation.consentContractAddress,
              currentInvitation.tokenId,
            ),
            this.dataWalletUtils.deriveOptInPrivateKey(
              consentContractAddress,
              context.dataWalletKey!,
            ),
          ]);
        })
        .andThen(([consentToken, optInPrivateKey]) => {
          if (consentToken == null) {
            // You're not actually opted in!
            // But we think we are. We should remove this from persistence
            this.logUtils.warning(
              `No consent token found for ${consentContractAddress}, but an opt-in is in the persistence. Removing from persistence!`,
            );
            return this.invitationRepo
              .removeAcceptedInvitationsByContractAddress([
                consentContractAddress,
              ])
              .andThen(() => {
                return errAsync(
                  new ConsentError(
                    `No consent token found for ${consentContractAddress}, but an opt-in is in the persistence. Removed from persistence!`,
                  ),
                );
              });
          }

          this.logUtils.debug("Existing consent token ", consentToken);

          const optInAccountAddress =
            this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
              optInPrivateKey,
            );

          this.logUtils.log(
            `Updating data permissions on consent contract ${consentContractAddress} with derived account ${optInAccountAddress}`,
          );

          // Encode the call to the consent contract and get the nonce for the forwarder
          return ResultUtils.combine([
            this.consentRepo.encodeUpdateAgreementFlags(
              consentContractAddress,
              consentToken.tokenId,
              dataPermissions,
            ),
            this.forwarderRepo.getNonce(optInAccountAddress),
            this.configProvider.getConfig(),
          ])
            .andThen(([callData, nonce, config]) => {
              const request = new MetatransactionRequest(
                consentContractAddress, // Contract address for the metatransaction
                optInAccountAddress, // EOA to run the transaction as
                BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
                BigNumber.from(config.gasAmounts.updateAgreementFlagsGas), // The amount of gas to pay.
                BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
                callData, // The actual bytes of the request, encoded as a hex string
              );

              return this.forwarderRepo
                .signMetatransactionRequest(request, optInPrivateKey)
                .andThen((metatransactionSignature) => {
                  // Got the signature for the metatransaction, now we can execute it.
                  // .executeMetatransaction will sign everything and have the server run
                  // the metatransaction.
                  return this.insightPlatformRepo.executeMetatransaction(
                    optInAccountAddress, // account address
                    consentContractAddress, // contract address
                    BigNumberString(BigNumber.from(nonce).toString()),
                    BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                    BigNumberString(
                      BigNumber.from(
                        config.gasAmounts.updateAgreementFlagsGas,
                      ).toString(),
                    ), // The amount of gas to pay.
                    callData,
                    metatransactionSignature,
                    optInPrivateKey,
                    config.defaultInsightPlatformBaseUrl,
                  );
                });
            })
            .map(() => {
              // Metatransaction complete. We don't actually store the permissions in our
              // persistence layer, they are only stored on the chain, so there's nothing more
              // to do for that. We should let the world know we made this change though.
              // Notify the world that we've opted in to the cohort
              context.publicEvents.onDataPermissionsUpdated.next(
                new DataPermissionsUpdatedEvent(
                  consentContractAddress,
                  dataPermissions,
                ),
              );
            });
        });
    });
  }

  public getAgreementFlags(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    HexString32,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | PersistenceError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.consentTokenUtils.getAgreementFlags(consentContractAddress);
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
      const linkedAccount = this.getLinkedAccountForReceivingAddress(
        linkedAccounts,
        receivingAddress,
      );
      if (linkedAccount == null) {
        return errAsync(
          new PersistenceError(
            "Unlinked accounts cannot be selected as recipient addresses.",
          ),
        );
      }

      // NOTE: we are using linkedAccount.sourceAccountAddress because it is already
      // de-checksum'd. receivingAddress could be a Solana or EVM address and we don't know
      // the chain to use.
      return this.accountRepo.setDefaultReceivingAddress(
        linkedAccount.sourceAccountAddress,
      );
    });
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
      const linkedAccount = this.getLinkedAccountForReceivingAddress(
        linkedAccounts,
        receivingAddress,
      );
      if (linkedAccount == null) {
        return errAsync(
          new PersistenceError(
            "Unlinked accounts cannot be selected as recipient addresses.",
          ),
        );
      }

      // NOTE: We are using the sourceAccountAddress because it is already de-checksum'd.
      return this.accountRepo.setReceivingAddress(
        contractAddress,
        linkedAccount.sourceAccountAddress,
      );
    });
  }

  public getReceivingAddress(
    contractAddress?: EVMContractAddress,
  ): ResultAsync<AccountAddress, PersistenceError> {
    this.logUtils.log(`check account for contract => ${contractAddress}`);

    if (!contractAddress) {
      return this._getDefaultReceivingAddress();
    }

    return this.accountRepo
      .getReceivingAddress(contractAddress)
      .andThen((receivingAddress) => {
        if (receivingAddress == null) {
          return this._getDefaultReceivingAddress();
        }

        this.logUtils.log(
          `receiving address found for contract => ${contractAddress} is ${receivingAddress}`,
        );

        return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
          const linkedAccount = this.getLinkedAccountForReceivingAddress(
            linkedAccounts,
            receivingAddress,
          );
          if (linkedAccount != null) {
            return okAsync(linkedAccount.sourceAccountAddress);
          }

          // This check removes the receiving address from the contract and replaces
          // it with the default
          return this.accountRepo
            .setReceivingAddress(contractAddress, null)
            .andThen(() => {
              return this._getDefaultReceivingAddress();
            });
        });
      });
  }

  protected isValidSignatureForInvitation(
    consentContractAddres: EVMContractAddress,
    tokenId: TokenId,
    businessSignature: Signature,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.consentRepo
      .getSignerRoleMembers(consentContractAddres)
      .andThen((signersAccountAddresses) => {
        return ResultUtils.combine(
          signersAccountAddresses.map((signerAccountAddress) => {
            const types = ["address", "uint256"];
            const msgHash = ethers.utils.solidityKeccak256(
              [...types],
              [consentContractAddres, BigNumber.from(tokenId)],
            );
            return this.cryptoUtils
              .verifyEVMSignature(
                ethers.utils.arrayify(msgHash),
                businessSignature,
              )
              .map((accountAddress) => {
                return accountAddress == signerAccountAddress;
              });
          }),
        ).map((validationResults) => {
          return validationResults.filter(Boolean).length > 0;
        });
      });
  }

  protected getAvailableConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | PersistenceError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      // can be fetched via insight-platform API call
      // or indexing can be used to avoid this relatively expensive look through
      this.consentRepo.getDeployedConsentContractAddresses(),
      this.invitationRepo.getAcceptedInvitations(),
      this.invitationRepo.getRejectedInvitations(),
    ]).andThen(([consents, acceptedInvitations, rejectedConsents]) => {
      return ResultUtils.combine(
        consents
          .filter((consent) => {
            const existingAcceptedInvitation = acceptedInvitations.find(
              (acceptedInvitation) => {
                return acceptedInvitation.consentContractAddress == consent;
              },
            );
            return (
              existingAcceptedInvitation == null &&
              !rejectedConsents.includes(consent)
            );
          })
          .map((consentAddress) =>
            this.getConsentCapacity(consentAddress).map((consentCapacity) => ({
              availableOptIns: consentCapacity.availableOptInCount,
              consentAddress,
            })),
          ),
      ).map((results) =>
        results
          .filter((res) => res.availableOptIns)
          .map((res) => res.consentAddress),
      );
    });
  }

  private getLinkedAccountForReceivingAddress(
    linkedAccounts: LinkedAccount[],
    receivingAddress: AccountAddress | null,
  ): LinkedAccount | null {
    if (!receivingAddress) {
      return null;
    }

    const linkedAccount = linkedAccounts.find((ac) => {
      // Since we don't know what chain the address is for, we need to check
      // both the direct input (for Solana) or the lowercase version (for Ethereum)
      return (
        ac.sourceAccountAddress == receivingAddress ||
        ac.sourceAccountAddress == receivingAddress.toLowerCase()
      );
    });

    return linkedAccount ?? null;
  }

  private _getDefaultReceivingAddress(): ResultAsync<
    AccountAddress,
    PersistenceError
  > {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.accountRepo.getDefaultReceivingAddress(),
    ]).andThen(([linkedAccounts, defaultReceivingAddress]) => {
      const linkedAccount = this.getLinkedAccountForReceivingAddress(
        linkedAccounts,
        defaultReceivingAddress,
      );
      if (defaultReceivingAddress == null || linkedAccount == null) {
        return this.accountRepo
          .setDefaultReceivingAddress(linkedAccounts[0].sourceAccountAddress)
          .map(() => linkedAccounts[0].sourceAccountAddress);
      }

      return okAsync(defaultReceivingAddress);
    });
  }
}
