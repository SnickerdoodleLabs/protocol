import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentFactoryContractError,
  ConsentToken,
  DataPermissions,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  IpfsCID,
  Signature,
  TokenId,
  TokenUri,
  IConsentCapacity,
  UninitializedError,
  URLString,
  BlockNumber,
  BlockchainCommonErrors,
  Commitment,
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
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  protected queryHorizonCache = new Map<
    EVMContractAddress,
    BlockNumber | null
  >();

  public getInvitationUrls(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    URLString[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.getDomains();
      })
      .map((domains) => {
        return domains.map((domain) => {
          return URLString(domain);
        });
      });
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

  public getCommitment(
    consentContractAddress: EVMContractAddress,
    commitment: Commitment,
  ): ResultAsync<
    boolean,
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
        // The opt-in token is not assigned to the data wallet address itself, it is assigned
        // to a derived address
        return ResultUtils.combine([
          this.getConsentContract(consentContractAddress),
          this.dataWalletUtils.deriveOptInAccountAddress(
            consentContractAddress,
            context.dataWalletKey,
          ),
        ]);
      })
      .andThen(([consentContract, derivedAddress]) => {
        return consentContract.balanceOf(derivedAddress).mapErr((e) => {
          // Almost always, you get an error, "Unable to call "balanceOf", which is
          // correct but not helpful; our goal here is to figure out if the address
          // is opted in or not- the method we use to check that, "balanceOf", is not
          // super relevant. Adding a specific error log to help understand what's going
          // on.
          this.logUtils.error(
            `While checking if derived address ${derivedAddress} is opted in to consent contract ${consentContractAddress}, got an error from balanceOf(), which usually means the control chain cannot be reached or that the consent contract does not exist. Most commony this is a result of the doodlechain being reset.`,
          );
          return e;
        });
      })
      .map((numberOfTokens) => {
        return numberOfTokens > 0;
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
