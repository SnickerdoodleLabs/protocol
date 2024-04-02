import {
  IBigNumberUtilsType,
  IBigNumberUtils,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  ConsentContractError,
  ConsentFactoryContractError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  TokenId,
  UninitializedError,
  URLString,
  BlockNumber,
  BlockchainCommonErrors,
  Commitment,
  InvalidParametersError,
  DomainName,
  EWalletDataType,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IConsentContractRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  public constructor(
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IContractFactoryType)
    protected consentContractFactory: IContractFactory,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(IBigNumberUtilsType) protected bigNumberUtils: IBigNumberUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  protected queryHorizonCache = new Map<
    EVMContractAddress,
    BlockNumber | null
  >();

  public checkDomain(
    consentContractAddress: EVMContractAddress,
    domain: DomainName,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (contract) => {
        return contract.checkDomain(domain);
      },
    );
  }

  public getQuestionnaires(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID[],
    UninitializedError | ConsentContractError | BlockchainCommonErrors
  > {
    /**
     * This method now works on a different principle- the consent contract does not maintain a list
     * of questionnaires it's interested in. Instead, we use the marketplace data and do a reverse lookup-
     * we get the list of all the questionnaires that this consent contract has staked, and use the amount
     * of the stake to establish the order.
     */
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.getTagArray();
      })
      .map((tags) => {
        return tags.reduce<IpfsCID[]>((acc, tag) => {
          if (tag.tag != null && tag.tag.startsWith("Questionnaire:")) {
            const cid = tag.tag.split(":")[1];
            acc.push(IpfsCID(cid));
          }
          return acc;
        }, []);
      });
  }

  public getVirtualQuestionnaires(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    EWalletDataType[],
    UninitializedError | ConsentContractError | BlockchainCommonErrors
  > {
    /**
     * This method now works on a different principle- the consent contract does not maintain a list
     * of questionnaires it's interested in. Instead, we use the marketplace data and do a reverse lookup-
     * we get the list of all the questionnaires that this consent contract has staked, and use the amount
     * of the stake to establish the order.
     */
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.getTagArray();
      })
      .map((tags) => {
        return tags.reduce<EWalletDataType[]>((acc, tag) => {
          if (tag.tag != null && tag.tag.startsWith("VirtualQuestionnaire:")) {
            const typeString = tag.tag.split(":")[1];

            const dataType =
              EWalletDataType[typeString as keyof typeof EWalletDataType];

            if (dataType !== undefined) {
              acc.push(dataType);
            }
          }
          return acc;
        }, []);
      });
  }



  public getMetadataCID(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.baseURI();
      })
      .map((baseURI) => {
        return IpfsCID(baseURI);
      });
  }

  public getCommitmentIndex(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    number,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  > {
    return this.contextProvider
      .getContext()
      .andThen((context) => {
        if (context.dataWalletKey == null) {
          return errAsync(
            new UninitializedError(
              "No data wallet key provided and core uninitialized in isAddressOptedIn",
            ),
          );
        }
        // The commitment is derivable from the data wallet key and consent contract address
        return ResultUtils.combine([
          this.getConsentContract(consentContractAddress),
          this.dataWalletUtils.deriveOptInInfo(
            consentContractAddress,
            context.dataWalletKey,
          ),
        ]);
      })
      .andThen(([consentContract, optInInfo]) => {
        // Need to convert to a commitment
        return consentContract
          .checkCommitments([optInInfo.commitment])
          .mapErr((e) => {
            // Almost always, you get an error, "Unable to call "balanceOf", which is
            // correct but not helpful; our goal here is to figure out if the address
            // is opted in or not- the method we use to check that, "balanceOf", is not
            // super relevant. Adding a specific error log to help understand what's going
            // on.
            this.logUtils.error(
              `While checking if the commitment ${optInInfo.commitment} is included in consent contract ${consentContractAddress}, got an error from checkCommitments(), which usually means the control chain cannot be reached or that the consent contract does not exist. Most commonly this is a result of the doodlechain being reset.`,
            );
            return e;
          });
      })
      .map((commitmentsIncluded) => {
        // The index from the blockchain uses 0 to mean not found. But that's weird in JS, so we convert to -1.
        return commitmentsIncluded[0] - 1;
      });
  }

  public isNonceUsed(
    consentContractAddress: EVMContractAddress,
    nonce: TokenId,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((consentContract) => {
        return consentContract.checkNonces([nonce]);
      })
      .map((noncesIncluded) => {
        return noncesIncluded[0];
      });
  }

  public getConsentContracts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.consentContractFactory
      .factoryConsentContracts(consentContractAddresses)
      .map((consentContracts) => {
        return new Map(
          consentContracts.map((consentContract) => {
            return [consentContract.getContractAddress(), consentContract];
          }),
        );
      });
  }

  public getDeployedConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.consentContractFactory
      .factoryConsentFactoryContract()
      .andThen((consentFactoryContract) => {
        return consentFactoryContract.getDeployedConsents();
      });
  }

  // #region Questionnaires
  public getDefaultQuestionnaires(): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.consentContractFactory
      .factoryConsentFactoryContract()
      .andThen((consentFactoryContract) => {
        return consentFactoryContract.getQuestionnaires();
        // lookup slots order by slots ?
      });
  }
  // #endregion Questionnaires

  public isOpenOptInDisabled(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (contract) => {
        return contract.openOptInDisabled();
      },
    );
  }

  public getSignerRoleMembers(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (contract) => {
        return contract.getSignerRoleMembers();
      },
    );
  }

  public getQueryHorizon(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    BlockNumber,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    // Check if the query horizon is in the cache
    const cachedQueryHorizon = this.queryHorizonCache.get(
      consentContractAddress,
    );

    if (cachedQueryHorizon != null) {
      return okAsync(cachedQueryHorizon);
    }

    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.getQueryHorizon();
      })
      .map((queryHorizon) => {
        // Set the cache entry
        this.queryHorizonCache.set(consentContractAddress, queryHorizon);

        return queryHorizon;
      });
  }

  public getCommitmentCount(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    number,
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (contract) => {
        return contract.totalSupply();
      },
    );
  }

  public getAnonymitySet(
    consentContractAddress: EVMContractAddress,
    start: number,
    count: number,
  ): ResultAsync<
    Commitment[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.fetchAnonymitySet(
          this.bigNumberUtils.BNToBNS(BigInt(start)),
          this.bigNumberUtils.BNToBNS(BigInt(start + count)),
        );
      })
      .andThen((commitments) => {
        if (commitments.length != count) {
          return errAsync(
            new InvalidParametersError(
              `Insufficient commitments found to fullfil request for anonymity set. Requested ${count} commitments starting at index ${start}, but returned only ${commitments.length} commitments.`,
            ),
          );
        }
        return okAsync(commitments);
      });
  }

  protected getConsentContract(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentContract,
    BlockchainProviderError | UninitializedError
  > {
    return this.consentContractFactory
      .factoryConsentContracts([consentContractAddress])
      .map(([consentContract]) => {
        return consentContract;
      });
  }
}
