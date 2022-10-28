/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  Invitation,
  EInvitationStatus,
  UninitializedError,
  PersistenceError,
  DataPermissions,
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
  MinimalForwarderContractError,
  DomainName,
  IPFSError,
  PageInvitation,
  ConsentFactoryContractError,
  IOpenSeaMetadata,
  IpfsCID,
  HexString32,
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { getDomain, parse } from "tldts";

import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentTokenUtils,
  IConsentTokenUtilsType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IDNSRepositoryType,
  IDNSRepository,
  IInvitationRepositoryType,
  IInvitationRepository,
  IMetatransactionForwarderRepositoryType,
  IMetatransactionForwarderRepository,
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
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
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
    return ResultUtils.combine([
      this.persistenceRepo.getRejectedCohorts(),
      this.consentRepo.isAddressOptedIn(invitation.consentContractAddress),
      this.consentRepo.getAvailableOptInCount(
        invitation.consentContractAddress,
      ),
    ]).andThen(([rejectedConsentContracts, optedIn, availableOptIns]) => {
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

      // Next up, if there are no slots available, then it's an Invalid invitation
      if (availableOptIns == 0) {
        return okAsync(EInvitationStatus.Invalid);
      }

      // Not rejected or already in the cohort, we need to verify the invitation
      return ResultUtils.combine([
        this.consentRepo.getInvitationUrls(invitation.consentContractAddress),
        this.getConsentContractAddressesFromDNS(invitation.domain),
      ]).map(([urls, consentContractAddresses]) => {
        // Derive a list of domains from a list of URLs
        console.log("urls", urls);
        console.log("consentContractAddresses", consentContractAddresses);
        console.log("invitation.domain", invitation.domain);

        const domains = urls
          .map((url) => {
            if (url.includes("https://") || url.includes("http://")) {
              return new URL(url).href;
            }
            return new URL(`http://${url}`).href;
          })
          .map((href) => getDomain(href));

        console.log("domains", domains);

        // We need to remove the subdomain so it would match with the saved domains in the blockchain
        const domainStr = getDomain(invitation.domain);
        // The contract must include the domain
        if (!domains.includes(domainStr)) {
          return EInvitationStatus.Invalid;
        }
        if (
          !consentContractAddresses.includes(invitation.consentContractAddress)
        ) {
          return EInvitationStatus.Invalid;
        }

        return EInvitationStatus.New;
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
              // Before optIn check TXT records to validate invitation
              return this.consentContractHasMatchingTXT(
                invitation.consentContractAddress,
              ).andThen((res) => {
                if (res) {
                  return okAsync({
                    optInData: this.consentRepo.encodeOptIn(
                      invitation.consentContractAddress,
                      invitation.tokenId,
                      dataPermissions,
                    ),
                    context,
                    optInPrivateKey,
                  });
                }
                return errAsync(
                  new ConsentError(
                    `${invitation.consentContractAddress} is not valid public consent contract`,
                  ),
                );
              });
            }
            return okAsync({
              optInData: this.consentRepo.encodeRestrictedOptIn(
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
          this.persistenceRepo.addAcceptedInvitations([invitation]),
        ])
          .andThen(([callData, nonce, config]) => {
            // We need to take the types, and send it to the account signer
            const request = new MetatransactionRequest(
              invitation.consentContractAddress, // Contract address for the metatransaction
              optInAddress, // EOA to run the transaction as (linked account, not derived)
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
                  context.dataWalletAddress!, // data wallet address
                  optInAddress, // account address
                  invitation.consentContractAddress, // contract address
                  BigNumberString(BigNumber.from(nonce).toString()),
                  BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                  BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                  callData,
                  metatransactionSignature,
                  context.dataWalletKey!,
                  config.defaultInsightPlatformBaseUrl,
                );
              })
              .orElse((e) => {
                // Metatransaction failed!
                // Need to do some cleanup
                return this.persistenceRepo
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
      return this.persistenceRepo
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
            return errAsync(
              new ConsentError(
                "Cannot opt out of consent contract, you were not opted in!",
              ),
            );
          }

          this.logUtils.debug("Existing consent token", consentToken);

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
                    context.dataWalletAddress!, // data wallet address
                    optInAccountAddress, // account address
                    consentContractAddress, // contract address
                    BigNumberString(BigNumber.from(nonce).toString()),
                    BigNumberString(BigNumber.from(0).toString()), // The amount of doodle token to pay. Should be 0.
                    BigNumberString(BigNumber.from(10000000).toString()), // The amount of gas to pay.
                    callData,
                    metatransactionSignature,
                    context.dataWalletKey!,
                    config.defaultInsightPlatformBaseUrl,
                  );
                });
            })
            .andThen(() => {
              return this.persistenceRepo.removeAcceptedInvitationsByContractAddress(
                [consentContractAddress],
              );
            })
            .map(() => {
              // Notify the world that we've opted in to the cohort
              context.publicEvents.onCohortLeft.next(consentContractAddress);
            });
        });
    });
  }

  public getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError> {
    return this.persistenceRepo.getAcceptedInvitations();
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
    return this.persistenceRepo
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
  ): ResultAsync<IOpenSeaMetadata, IPFSError> {
    return this.invitationRepo.getInvitationMetadataByCID(ipfsCID);
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
      this.consentRepo.getAvailableOptInCount(consentContractAddress),
    ]).andThen(([invitationUrls, ipfsCID, availableOptIns]) => {
      // If there's no slots, there's no invites
      if (availableOptIns == 0) {
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
            console.log("addressesWithCID", addressesWithCID);
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
  > {
    return ResultUtils.combine([
      // can be fetched via insight-platform API call
      // or indexing can be used to avoid this relatively expensive look through
      this.consentRepo.getDeployedConsentContractAddresses(),
      this.persistenceRepo.getAcceptedInvitations(),
      this.persistenceRepo.getRejectedCohorts(),
    ]).map(([consents, optInInfo, rejectedConsents]) => {
      return consents.filter(
        (consent) =>
          !optInInfo.find((oii) => oii.consentContractAddress == consent) &&
          !rejectedConsents.includes(consent),
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
}
