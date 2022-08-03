/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IConsentContract,
  IMinimalForwarderRequest,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  Invitation,
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
  DomainName,
  IpfsCID,
  IPFSError,
  URLString,
  PageInvitation,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IInvitationService } from "@core/interfaces/business";
import {
  IInsightPlatformRepositoryType,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
  IDNSRepositoryType,
  IDNSRepository,
  IInvitationRepositoryType,
  IInvitationRepository,
} from "@core/interfaces/data";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
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
export class InvitationService implements IInvitationService {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
    @inject(IConsentContractRepositoryType)
    protected consentRepo: IConsentContractRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IDNSRepositoryType) protected dnsRepository: IDNSRepository,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContractFactoryType)
    protected contractFactory: IContractFactory,
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
            contract.getDomains(), // This actually returns URLs
            this.getConsentContractAddressesFromDNS(invitation.domain),
          ]);
        })
        .map(([urls, consentContractAddresses]) => {
          // Derive a list of domains from a list of URLs
          console.debug("urls", urls);
          console.debug("consentContractAddresses", consentContractAddresses);

          const domains = urls.map((url) => {
            return new URL(`http://${url}`).hostname;
          });

          console.debug("domains", domains);

          // The contract must include the domain
          if (!domains.includes(invitation.domain)) {
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
    });
  }

  public acceptInvitation(
    invitation: Invitation,
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
        .andThen((consentToken) => {
          console.log(consentToken);

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
    return this.blockchainProvider.initialize().andThen(() => {
      return this.getConsentContractAddressesFromDNS(domain)
        .andThen((contractAddresses) => {
          // Now, for each contract that the domain lists, get stuff
          return this.contractFactory
            .factoryConsentContracts(contractAddresses)
            .andThen((consentContracts) => {
              return ResultUtils.combine(
                consentContracts.map((consentContract) => {
                  return this.getInvitationsFromConsentContract(
                    domain,
                    consentContract,
                  );
                }),
              );
            });
        })
        .map((invitations) => {
          return invitations.flat();
        });
    });
  }

  protected getInvitationsFromConsentContract(
    domain: DomainName,
    consentContract: IConsentContract,
  ): ResultAsync<PageInvitation[], ConsentContractError | IPFSError> {
    return ResultUtils.combine([
      consentContract.getDomains(),
      consentContract.baseURI(),
    ]).andThen(([invitationUrls, baseUri]) => {
      // The baseUri is an IPFS CID
      return this.invitationRepo
        .getInvitationDomainByCID(IpfsCID(baseUri), domain)
        .andThen((invitationDomain) => {
          if (invitationDomain == null) {
            return errAsync(
              new IPFSError(
                `No invitation details could be found at IPFS CID ${baseUri}`,
              ),
            );
          }
          return ResultUtils.combine(
            invitationUrls.map((invitationUrl) => {
              return this.cryptoUtils.getTokenId().map((tokenId) => {
                return new PageInvitation(
                  URLString(invitationUrl), // getDomains() is actually misnamed, it returns URLs now
                  new Invitation(
                    domain,
                    consentContract.getContractAddress(),
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

  protected getConsentContractAddressesFromDNS(
    domain: DomainName,
  ): ResultAsync<EVMContractAddress[], AjaxError> {
    return this.dnsRepository.fetchTXTRecords(domain).map((txtRecords) => {
      // search for TXT records that start with consentContracts:
      const relevantTxts = txtRecords.filter((val) => {
        return val.startsWith("consentContracts:");
      });

      // Take those, string off the prefix, and split them to get a complete list of consent
      // contract addresses
      const contractAddresses = relevantTxts
        .map((val) => {
          const contractAddresses = val.replace(/^(consentContracts:)/, "");
          return contractAddresses.split(",");
        })
        .flat()
        .map((contractAddressString) => {
          return EVMContractAddress(contractAddressString);
        });

      return contractAddresses;
    });
  }
}
