/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { EConsentRoles } from "@snickerdoodlelabs/contracts-sdk";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AccountAddress,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  Invitation,
  IOldUserAgreement,
  IpfsCID,
  IPFSError,
  LinkedAccount,
  MinimalForwarderContractError,
  PageInvitation,
  PersistenceError,
  Signature,
  TokenId,
  UninitializedError,
  UnixTimestamp,
  BlockchainCommonErrors,
  OptInInfo,
  IUserAgreement,
  InvalidParametersError,
  CircuitError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IDNSRepository,
  IDNSRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IPermissionRepository,
  IPermissionRepositoryType,
} from "@core/interfaces/data/index.js";
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
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IPermissionRepositoryType)
    protected permissionRepo: IPermissionRepository,
    @inject(IDNSRepositoryType) protected dnsRepository: IDNSRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
  ) {}

  public checkInvitationStatus(
    invitation: Invitation,
  ): ResultAsync<
    EInvitationStatus,
    | PersistenceError
    | ConsentContractError
    | ConsentContractRepositoryError
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
      this.consentRepo.getCommitmentIndex(invitation.consentContractAddress),
      this.consentRepo.isOpenOptInDisabled(invitation.consentContractAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(
        ([
          rejectedConsentContracts,
          acceptedInvitations,
          commitmentIndex,
          openOptInDisabled,
          context,
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

          // Check to make sure we have the data wallet key
          if (context.dataWalletKey == null) {
            return errAsync(
              new UninitializedError("Data wallet is not initialized!"),
            );
          }

          // If we are opted in, that wins
          if (commitmentIndex > -1) {
            // Check if we know about the opt-in in the persistence
            if (acceptedInvitation != null) {
              // Persistence and chain match!
              return okAsync(EInvitationStatus.Accepted);
            }

            // There's no known accepted invitation
            // This is a problem but we'll just add a new accepted invitation
            return this.dataWalletUtils
              .deriveOptInInfo(
                invitation.consentContractAddress,
                context.dataWalletKey,
              )
              .andThen((optInInfo) => {
                return this.invitationRepo.addAcceptedInvitations([optInInfo]);
              })
              .map(() => EInvitationStatus.Accepted);
          }

          // If we are opted in in the persistence, but not on chain, we need to update the persistence
          if (acceptedInvitation != null && commitmentIndex == -1) {
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
              .isNonceUsed(invitation.consentContractAddress, tokenId)
              .andThen((used) => {
                // If the nonce has already been used, we can't use the invitation for sure
                if (used) {
                  return okAsync(EInvitationStatus.Occupied);
                }

                // Nonce is not used
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
            // Not rejected or already in the cohort, we need to verify the invitation
            return ResultUtils.combine([
              this.consentRepo.checkDomain(
                invitation.consentContractAddress,
                invitation.domain,
              ),
              this.getConsentContractAddressesFromDNS(domain),
            ]).map(([domainIncluded, consentContractAddresses]) => {
              // The contract must include the domain
              if (!domainIncluded) {
                return EInvitationStatus.Invalid;
              }
              if (
                !consentContractAddresses.includes(
                  invitation.consentContractAddress,
                )
              ) {
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
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | InvalidParametersError
    | CircuitError
    | ConsentError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been initialized yet!"),
        );
      }

      if (invitation.businessSignature != null && invitation.tokenId == null) {
        return errAsync(
          new InvalidParametersError(
            "tokenId is required for signed invitations",
          ),
        );
      }

      let invitationCheck = okAsync<void, ConsentError>(undefined);
      if (invitation.domain != null) {
        invitationCheck = this.consentContractHasMatchingTXT(
          invitation.consentContractAddress,
          invitation.domain,
        ).andThen((matchingTxt) => {
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
          return this.dataWalletUtils.deriveOptInInfo(
            invitation.consentContractAddress,
            context.dataWalletKey!,
          );
        })
        .andThen((optInInfo) => {
          this.logUtils.log(
            `Opting in to consent contract ${invitation.consentContractAddress}`,
          );

          // Send the commitment to the insight platform.
          return this.insightPlatformRepo
            .optin(
              invitation.consentContractAddress, // contract address
              optInInfo.identityTrapdoor,
              optInInfo.identityNullifier,
              config.defaultInsightPlatformBaseUrl,
            )
            .andThen(() => {
              // .optin() returns before the commitment is actually on chain, so we need to wait for it
              // we will do this by polling; backoffAndRetry() does an exponential backoff but keeps trying.
              return ResultUtils.backoffAndRetry(
                () => {
                  return this.consentRepo
                    .getCommitmentIndex(invitation.consentContractAddress)
                    .andThen((index) => {
                      if (index == -1) {
                        // It's not found, need to retry. ConsentError is a retryable error and not
                        // generated by .getCommitmentIndex().
                        return errAsync(
                          new ConsentError("Commitment not found"),
                        );
                      }
                      return okAsync(index);
                    });
                },
                [ConsentError],
                undefined, // maxAttempts
                1, // baseSeconds
              );
            })
            .andThen(() => {
              // Only when the commitment is on the chain should we save the opt-in info and return
              return this.invitationRepo.addAcceptedInvitations([optInInfo]);
            });
        })
        .map(() => {
          // Notify the world that we've opted in to the cohort
          context.publicEvents.onCohortJoined.next(
            invitation.consentContractAddress,
          );

          return;
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
    | ConsentContractRepositoryError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
    | BlockchainCommonErrors
  > {
    // Need to check first if we are already opted in
    return this.consentRepo
      .getCommitmentIndex(invitation.consentContractAddress)
      .andThen((commitmentIndex) => {
        if (commitmentIndex > -1) {
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
    // There's no removing your commitment from the chain, so we just need to remove the accepted
    // invitation from the persistence
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

        return this.invitationRepo.removeAcceptedInvitationsByContractAddress([
          consentContractAddress,
        ]);
      })
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        // Notify the world that we've opted in to the cohort
        context.publicEvents.onCohortLeft.next(consentContractAddress);
      });
  }

  public getAcceptedInvitations(): ResultAsync<
    OptInInfo[],
    PersistenceError | UninitializedError
  > {
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
    return this.getConsentContractAddressesFromDNS(domain)
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
  > {
    return ResultUtils.combine([
      this.consentRepo.checkDomain(consentContractAddress, domain),
      this.consentRepo.getMetadataCID(consentContractAddress),
      // @TODO - check later
      // this.invitationRepo.getRejectedInvitations(),
    ]).andThen(([domainIncluded, ipfsCID]) => {
      if (!domainIncluded) {
        // TODO: This should be a specific error type
        return errAsync(
          new IPFSError("Domain not included in consent contract"),
        );
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
          return this.cryptoUtils.getTokenId().map((tokenId) => {
            return [
              new PageInvitation(
                // TODO: Fix this!
                URLString(domain),
                new Invitation(
                  consentContractAddress,
                  tokenId,
                  domain,
                  null, // getInvitationsByDomain() is only for public invitations, so will never have a business signature
                ),
                invitationMetadata,
              ),
            ];
          });
        });
    });
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
    | BlockchainCommonErrors
  > {
    // TODO: This method needs to be rethought
    return okAsync(new Map());
    // return this.getAvailableConsentContractAddresses().andThen(
    //   (consentAddresses) => {
    //     return ResultUtils.combine(
    //       consentAddresses.map((consentAddress) =>
    //         this.consentContractHasMatchingTXT(consentAddress).map(
    //           (hasMatchingTXT) => ({
    //             consentAddress,
    //             hasMatchingTXT,
    //           }),
    //         ),
    //       ),
    //     )
    //       .andThen((results) => {
    //         // since we are checking TXT records here
    //         // we can confirm that all consent addresses are for public invitations
    //         const validConsentContractAddresses = results
    //           .filter((result) => result.hasMatchingTXT)
    //           .map((validResults) => validResults.consentAddress);
    //         return ResultUtils.combine(
    //           validConsentContractAddresses.map((contractAddress) =>
    //             this.consentRepo
    //               .getMetadataCID(contractAddress)
    //               .map((ipfsCID) => ({ ipfsCID, contractAddress })),
    //           ),
    //         );
    //       })
    //       .map((addressesWithCID) => {
    //         return new Map(
    //           addressesWithCID.map((addressWithCID) => [
    //             addressWithCID.contractAddress,
    //             addressWithCID.ipfsCID,
    //           ]),
    //         );
    //       });
    //   },
    // );
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
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    businessSignature: Signature,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    const types = ["address", "uint256"];
    const msgHash = ethers.solidityPackedKeccak256(
      [...types],
      [consentContractAddress, BigInt(tokenId)],
    );

    // Retrieve the business signature's signer and check if it has the SIGNER_ROLE on the consent contract
    return this.cryptoUtils
      .verifyEVMSignature(ethers.getBytes(msgHash), businessSignature)
      .andThen((accountAddress) => {
        return this.consentRepo.hasRole(
          consentContractAddress,
          EConsentRoles.SIGNER_ROLE,
          accountAddress,
        );
      });
  }

  protected consentContractHasMatchingTXT(
    consentContractAddress: EVMContractAddress,
    domain: DomainName,
  ): ResultAsync<boolean, never> {
    return this.consentRepo
      .checkDomain(consentContractAddress, domain)
      .andThen((domainIncluded) => {
        if (!domainIncluded) {
          return okAsync([]);
        }
        return this.getConsentContractAddressesFromDNS(
          DomainName(`snickerdoodle-protocol.${domain}`),
        ).orElse(() => {
          return okAsync([] as EVMContractAddress[]);
        });
      })
      .map((contractAddressesArr) => {
        let match = false;
        for (const contractAddresses of contractAddressesArr) {
          if (contractAddresses.includes(consentContractAddress)) {
            match = true;
            break;
          }
        }
        return match;
      })
      .orElse((e) => {
        return okAsync(false);
      });
  }

  protected getAvailableConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | PersistenceError
    | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      // can be fetched via insight-platform API call
      // or indexing can be used to avoid this relatively expensive look through
      this.consentRepo.getDeployedConsentContractAddresses(),
      this.invitationRepo.getAcceptedInvitations(),
      this.invitationRepo.getRejectedInvitations(),
    ]).map(([consents, acceptedInvitations, rejectedConsents]) => {
      return consents.filter((consent) => {
        const existingAcceptedInvitation = acceptedInvitations.find(
          (acceptedInvitation) => {
            return acceptedInvitation.consentContractAddress == consent;
          },
        );
        return (
          existingAcceptedInvitation == null &&
          !rejectedConsents.includes(consent)
        );
      });
    });
  }

  protected getConsentContractAddressesFromDNS(
    domain: DomainName,
  ): ResultAsync<EVMContractAddress[], AjaxError> {
    return this.dnsRepository.fetchTXTRecords(domain).map((txtRecords) => {
      // to avoid TXT records which were not shaped as JSON
      try {
        return txtRecords
          .map((txtRecord) => {
            const records = JSON.parse(txtRecord)
              .split(",")
              .map((r) => r.trim());
            return records.map((record) => EVMContractAddress(record));
          })
          .flat();
      } catch {
        return [];
      }
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
