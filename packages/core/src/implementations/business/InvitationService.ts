/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentTokenUtils,
  IConsentTokenUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IDNSRepository,
  IDNSRepositoryType,
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
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  AccountAddress,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  ConsentFactoryContractError,
  DataPermissions,
  DomainName,
  EInvitationStatus,
  EVMContractAddress,
  HexString32,
  Invitation,
  IOpenSeaMetadata,
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
  PermissionsUpdatedEvent,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { getDomain, parse } from "tldts";

@injectable()
export class InvitationService implements IInvitationService {
  public constructor(
    @inject(IConsentTokenUtilsType)
    protected consentTokenUtils: IConsentTokenUtils,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IDNSRepositoryType) protected dnsRepository: IDNSRepository,
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
  > {
    let cleanupActions = okAsync<void, PersistenceError>(undefined);
    return ResultUtils.combine([
      this.accountRepo.getRejectedCohorts(),
      this.accountRepo.getAcceptedInvitations(),
      // isAddressOptedIn() just checks for a balance- it does not require that the persistence
      // layer actually know about the token
      this.consentRepo.isAddressOptedIn(invitation.consentContractAddress),
      this.getConsentCapacity(invitation.consentContractAddress),
      this.consentRepo.isOpenOptInDisabled(invitation.consentContractAddress),
    ])
      .andThen(
        ([
          rejectedConsentContracts,
          acceptedInvitations,
          optedInOnChain,
          consentCapacity,
          openOptInDisabled,
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
                return this.accountRepo
                  .addAcceptedInvitations([
                    new Invitation(
                      invitation.domain,
                      invitation.consentContractAddress,
                      tokenIdOrNull ?? invitation.tokenId,
                      invitation.businessSignature,
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
              this.accountRepo.removeAcceptedInvitationsByContractAddress([
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

          // If invitation has bussiness signature verify signature
          if (invitation.businessSignature) {
            // If business signature exist then open optIn should be disabled
            if (!openOptInDisabled) {
              return okAsync(EInvitationStatus.Invalid);
            }

            // Check if the consent token already exists
            // If it does, it means this invitation has already been claimed
            return this.consentRepo
              .getConsentToken(invitation)
              .andThen((existingConsentToken) => {
                // If the existing consent token exists, it must NOT be owned by us- we'd have found
                // the token via isAddressOptedIn() above. So somebody else has gotten this invitation.
                if (existingConsentToken != null) {
                  return okAsync(EInvitationStatus.Occupied);
                }
                return this.isValidSignatureForInvitation(
                  invitation.consentContractAddress,
                  invitation.tokenId,
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
            // Not rejected or already in the cohort, we need to verify the invitation
            return ResultUtils.combine([
              this.consentRepo.getInvitationUrls(
                invitation.consentContractAddress,
              ),
              this.getConsentContractAddressesFromDNS(invitation.domain),
            ]).map(([urls, consentContractAddresses]) => {
              // Derive a list of domains from a list of URLs

              const domains = urls
                .map((url) => {
                  if (url.includes("https://") || url.includes("http://")) {
                    return new URL(url).href;
                  }
                  return new URL(`http://${url}`).href;
                })
                .map((href) => getDomain(href));

              // We need to remove the subdomain so it would match with the saved domains in the blockchain
              const domainStr = getDomain(invitation.domain);
              // The contract must include the domain
              if (!domains.includes(domainStr)) {
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
    dataPermissions: DataPermissions | null,
  ): ResultAsync<
    void,
    | PersistenceError
    | UninitializedError
    | AjaxError
    | BlockchainProviderError
    | MinimalForwarderContractError
    | ConsentError
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        if (
          context.dataWalletAddress == null ||
          context.dataWalletKey == null
        ) {
          return errAsync(
            new UninitializedError("Data wallet has not been unlocked yet!"),
          );
        }

        return this.dataWalletUtils
          .deriveOptInPrivateKey(
            invitation.consentContractAddress,
            context.dataWalletKey!,
          )
          .andThen((optInPrivateKey) => {
            if (invitation.businessSignature == null) {
              // If the invitation includes a domain, we will check that DNS records
              // just to be extra safe.
              let invitationCheck = okAsync<void, ConsentError>(undefined);
              if (invitation.domain != "") {
                invitationCheck = this.consentContractHasMatchingTXT(
                  invitation.consentContractAddress,
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
              // Only thing left is the actual opt in data
              return invitationCheck.map(() => {
                return {
                  optInData: this.consentRepo.encodeOptIn(
                    invitation.consentContractAddress,
                    invitation.tokenId,
                    dataPermissions,
                  ),
                  context,
                  optInPrivateKey,
                };
              });
            }

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
            });
          });
      })
      .andThen(({ optInData, context, optInPrivateKey }) => {
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
          this.accountRepo.addAcceptedInvitations([invitation]),
        ])
          .andThen(([callData, nonce, config]) => {
            // We need to take the types, and send it to the account signer
            const request = new MetatransactionRequest(
              invitation.consentContractAddress, // Contract address for the metatransaction
              optInAddress, // EOA to run the transaction as
              BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
              BigNumber.from(10000000), // The amount of gas to pay.
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
                  BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                  callData,
                  metatransactionSignature,
                  optInPrivateKey,
                  config.defaultInsightPlatformBaseUrl,
                );
              })
              .map(() => {
                this.consentRepo
                  .getConsentToken(invitation)
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
                return this.accountRepo
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

        return this.accountRepo.addRejectedCohorts([
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
    | ConsentError
    | PersistenceError
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // We need to find your opt-in token
      return this.accountRepo
        .getAcceptedInvitations()
        .andThen((invitations) => {
          const currentInvitation = invitations.find((invitation) => {
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
            this.consentRepo.getConsentToken(currentInvitation),
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
              BigNumber.from(10000000), // The amount of gas to pay.
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
                  BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                  callData,
                  metatransactionSignature,
                  optInPrivateKey,
                  config.defaultInsightPlatformBaseUrl,
                );
              });
          });
        })
        .andThen(() => {
          return this.accountRepo.removeAcceptedInvitationsByContractAddress([
            consentContractAddress,
          ]);
        })
        .map(() => {
          // Notify the world that we've opted in to the cohort
          context.publicEvents.onCohortLeft.next(consentContractAddress);
        });
    });
  }

  public getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError> {
    return this.accountRepo.getAcceptedInvitations();
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
  > {
    return this.accountRepo
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
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.consentRepo.getConsentCapacity(consentContractAddress);
  }

  public getInvitationMetadataByCID(
    ipfsCID: IpfsCID,
  ): ResultAsync<IOpenSeaMetadata, IPFSError> {
    return this.invitationRepo.getInvitationMetadataByCID(ipfsCID);
  }

  public getConsentContractCID(
    consentAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    BlockchainProviderError | UninitializedError | ConsentContractError
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
  > {
    return ResultUtils.combine([
      this.consentRepo.getInvitationUrls(consentContractAddress),
      this.consentRepo.getMetadataCID(consentContractAddress),
      this.getConsentCapacity(consentContractAddress),
    ]).andThen(([invitationUrls, ipfsCID, consentCapacity]) => {
      // If there's no slots, there's no invites
      if (consentCapacity.availableOptInCount == 0) {
        return okAsync([]);
      }

      // The baseUri is an IPFS CID
      return this.invitationRepo
        .getInvitationDomainByCID(ipfsCID, domain)
        .andThen((invitationDomain) => {
          if (invitationDomain == null) {
            return errAsync(
              new IPFSError(
                `No invitation details could be found at IPFS CID ${ipfsCID}`,
              ),
            );
          }
          return ResultUtils.combine(
            invitationUrls.map((invitationUrl) => {
              return this.cryptoUtils.getTokenId().map((tokenId) => {
                return new PageInvitation(
                  invitationUrl, // getDomains() is actually misnamed, it returns URLs now
                  new Invitation(
                    domain,
                    consentContractAddress,
                    tokenId,
                    null, // getInvitationsByDomain() is only for public invitations, so will never have a business signature
                  ),
                  invitationDomain,
                );
              });
            }),
          );
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
  > {
    return this.consentTokenUtils.getAgreementFlags(consentContractAddress);
  }

  public getAvailableInvitationsCID(): ResultAsync<
    Map<EVMContractAddress, IpfsCID>,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
    | PersistenceError
  > {
    return this.getAvailableConsentContractAddresses().andThen(
      (consentAddresses) => {
        return ResultUtils.combine(
          consentAddresses.map((consentAddress) =>
            this.consentContractHasMatchingTXT(consentAddress).map(
              (hasMatchingTXT) => ({
                consentAddress,
                hasMatchingTXT,
              }),
            ),
          ),
        )
          .andThen((results) => {
            // since we are checking TXT records here
            // we can confirm that all consent addresses are for public invitations
            const validConsentContractAddresses = results
              .filter((result) => result.hasMatchingTXT)
              .map((validResults) => validResults.consentAddress);
            return ResultUtils.combine(
              validConsentContractAddresses.map((contractAddress) =>
                this.consentRepo
                  .getMetadataCID(contractAddress)
                  .map((ipfsCID) => ({ ipfsCID, contractAddress })),
              ),
            );
          })
          .map((addressesWithCID) => {
            return new Map(
              addressesWithCID.map((addressWithCID) => [
                addressWithCID.contractAddress,
                addressWithCID.ipfsCID,
              ]),
            );
          });
      },
    );
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
      if (
        !this._doLinkedAccountsContainReceivingAddress(
          linkedAccounts,
          receivingAddress,
        )
      ) {
        return errAsync(
          new PersistenceError(
            "Unlinked accounts cannot be selected as recipient addresses.",
          ),
        );
      }

      return this.accountRepo.setDefaultReceivingAddress(receivingAddress);
    });
  }

  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
      if (
        !this._doLinkedAccountsContainReceivingAddress(
          linkedAccounts,
          receivingAddress,
        )
      ) {
        return errAsync(
          new PersistenceError(
            "Unlinked accounts cannot be selected as recipient addresses.",
          ),
        );
      }

      return this.accountRepo.setReceivingAddress(
        contractAddress,
        receivingAddress,
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
        if (!receivingAddress) {
          return this._getDefaultReceivingAddress();
        }

        this.logUtils.log(
          `receiving address found for contract => ${contractAddress} is ${receivingAddress}`,
        );

        return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
          if (
            this._doLinkedAccountsContainReceivingAddress(
              linkedAccounts,
              receivingAddress,
            )
          ) {
            return okAsync(receivingAddress);
          }

          return this.accountRepo
            .setReceivingAddress(contractAddress, null)
            .andThen(() => {
              return this._getDefaultReceivingAddress();
            });
        });
      });
  }

  public updatePermissions(
    consentContractAddress: EVMContractAddress,
    newDataPermissions: DataPermissions,
  ): ResultAsync<
    void,
    | BlockchainProviderError
    | UninitializedError
    | AjaxError
    | MinimalForwarderContractError
    | ConsentContractError
    | ConsentError
    | PersistenceError
  > {
    // This will actually create a metatransaction, since the invitation is issued
    // to the data wallet address
    return this.contextProvider.getContext().andThen((context) => {
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // We need to find your opt-in token
      return this.accountRepo
        .getAcceptedInvitations()
        .andThen((invitations) => {
          const currentInvitation = invitations.find((invitation) => {
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
            this.consentRepo.getConsentToken(currentInvitation),
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
            `Updating permissions / agreement flag of ${consentToken.tokenId} on contract ${consentContractAddress} with derived account ${optInAccountAddress}`,
          );

          // Encode the call to the consent contract and get the nonce for the forwarder
          return ResultUtils.combine([
            this.consentRepo.encodeUpdateAgreementFlags(
              consentContractAddress,
              consentToken.tokenId,
              newDataPermissions,
            ),
            this.forwarderRepo.getNonce(optInAccountAddress),
            this.configProvider.getConfig(),
          ])
            .andThen(([callData, nonce, config]) => {
              const request = new MetatransactionRequest(
                consentContractAddress, // Contract address for the metatransaction
                optInAccountAddress, // EOA to run the transaction as
                BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
                BigNumber.from(10000000), // The amount of gas to pay.
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
                    BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                    callData,
                    metatransactionSignature,
                    optInPrivateKey,
                    config.defaultInsightPlatformBaseUrl,
                  );
                });
            })
            .map(() => {
              // Notify the world that that permissions have been updated
              context.publicEvents.onPermissionsUpdated.next(
                new PermissionsUpdatedEvent(
                  consentContractAddress,
                  consentToken.tokenId,
                  newDataPermissions,
                ),
              );
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
    BlockchainProviderError | UninitializedError | ConsentContractError
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

  protected consentContractHasMatchingTXT(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<boolean, never> {
    return this.consentRepo
      .getInvitationUrls(consentContractAddress)
      .andThen((urls) => {
        return ResultUtils.combine(
          urls.map((url) => {
            const urlInfo = parse(url);
            return this.getConsentContractAddressesFromDNS(
              DomainName(`snickerdoodle-protocol.${urlInfo.domain}`),
            ).orElse(() => {
              return okAsync([] as EVMContractAddress[]);
            });
          }),
        );
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
    | ConsentContractError
  > {
    return ResultUtils.combine([
      // can be fetched via insight-platform API call
      // or indexing can be used to avoid this relatively expensive look through
      this.consentRepo.getDeployedConsentContractAddresses(),
      this.accountRepo.getAcceptedInvitations(),
      this.accountRepo.getRejectedCohorts(),
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

  private _doLinkedAccountsContainReceivingAddress(
    linkedAccounts: LinkedAccount[],
    receivingAddress: AccountAddress | null,
  ): boolean {
    if (!receivingAddress) {
      return false;
    }

    return !!linkedAccounts.find(
      (ac) => ac.sourceAccountAddress == receivingAddress,
    );
  }

  private _getDefaultReceivingAddress(): ResultAsync<
    AccountAddress,
    PersistenceError
  > {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.accountRepo.getDefaultReceivingAddress(),
    ]).andThen(([linkedAccounts, defaultReceivingAddress]) => {
      if (
        !defaultReceivingAddress ||
        !this._doLinkedAccountsContainReceivingAddress(
          linkedAccounts,
          defaultReceivingAddress,
        )
      ) {
        return this.accountRepo
          .setDefaultReceivingAddress(linkedAccounts[0].sourceAccountAddress)
          .map(() => linkedAccounts[0].sourceAccountAddress);
      }

      return okAsync(defaultReceivingAddress);
    });
  }
}
