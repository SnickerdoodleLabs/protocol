import { IConsentContractRepository } from "@core/interfaces/data/index.js";
import {
  IContractFactory,
  IContractFactoryType,
} from "@core/interfaces/utilities/factory/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";
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
  OptInInfo,
  Signature,
  TokenId,
  TokenUri,
  UninitializedError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  public constructor(
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IContractFactoryType)
    protected consentContractFactory: IContractFactory,
    @inject(IDataWalletUtilsType) protected dataWalletUtils: IDataWalletUtils,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getInvitationUrls(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    URLString[],
    BlockchainProviderError | UninitializedError | ConsentContractError
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

  public getAvailableOptInCount(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    number,
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return ResultUtils.combine([
          contract.totalSupply(),
          contract.getMaxCapacity(),
        ]);
      })
      .map(([totalSupply, maxCapacity]) => {
        const available = maxCapacity - totalSupply;

        // Crazy sanity check
        if (available < 0) {
          return 0;
        }

        return available;
      });
  }

  public getMetadataCID(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID,
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getConsentContract(consentContractAddress)
      .andThen((contract) => {
        return contract.baseURI();
      })
      .map((baseURI) => {
        return IpfsCID(baseURI);
      });
  }

  public getConsentToken(
    optInInfo: OptInInfo,
  ): ResultAsync<
    ConsentToken | null,
    ConsentContractError | UninitializedError | BlockchainProviderError
  > {
    return this.getConsentContract(optInInfo.consentContractAddress)
      .andThen((consentContract) => {
        return consentContract.getConsentToken(
          optInInfo.tokenId,
        ) as ResultAsync<ConsentToken | null, ConsentContractError>;
      })
      .orElse((e) => {
        this.logUtils.warning(
          `Cannot call ownerOf or agreementFlags for token ID ${optInInfo.tokenId} on consent contract ${optInInfo.consentContractAddress}. Assuming it does not exist!`,
          e,
        );
        return okAsync(null);
      });
  }

  public isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
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
        return consentContract.balanceOf(derivedAddress);
      })
      .map((numberOfTokens) => {
        return numberOfTokens > 0;
      });
  }

  public getLatestConsentTokenId(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    TokenId | null,
    ConsentContractError | UninitializedError | BlockchainProviderError
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
        return ResultUtils.combine([
          this.getConsentContract(consentContractAddress),
          this.dataWalletUtils.deriveOptInAccountAddress(
            consentContractAddress,
            context.dataWalletKey,
          ),
        ]);
      })
      .andThen(([consentContract, derivedAddress]) => {
        this.logUtils.debug(
          "consentContractRepo getTokenIdForOptedInCampaign derivedAddress " +
            derivedAddress,
        );
        return consentContract.getLatestTokenIdByOptInAddress(derivedAddress);
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

  public encodeOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getConsentContract(consentContractAddress).map((contract) => {
      return contract.encodeOptIn(
        tokenId,
        dataPermissions != null
          ? dataPermissions.getFlags()
          : DataPermissions.allPermissionsHexString,
      );
    });
  }

  public encodeRestrictedOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    signature: Signature,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getConsentContract(consentContractAddress).map((contract) => {
      return contract.encodeRestrictedOptIn(
        tokenId,
        signature,
        dataPermissions != null
          ? dataPermissions.getFlags()
          : DataPermissions.allPermissionsHexString,
      );
    });
  }

  public encodeAnonymousRestrictedOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    signature: Signature,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getConsentContract(consentContractAddress).map((contract) => {
      return contract.encodeAnonymousRestrictedOptIn(
        tokenId,
        signature,
        dataPermissions != null
          ? dataPermissions.getFlags()
          : DataPermissions.allPermissionsHexString,
      );
    });
  }

  public encodeOptOut(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getConsentContract(consentContractAddress).map((contract) => {
      return contract.encodeOptOut(tokenId);
    });
  }

  public getDeployedConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.consentContractFactory
      .factoryConsentFactoryContract()
      .andThen((consentFactoryContract) => {
        return consentFactoryContract.getDeployedConsents();
      });
  }

  public isOpenOptInDisabled(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    boolean,
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getConsentContract(consentContractAddres).andThen(
      (contract) => {
        return contract.openOptInDisabled();
      },
    );
  }

  public getSignerRoleMembers(
    consentContractAddres: EVMContractAddress,
  ): ResultAsync<
    EVMAccountAddress[],
    BlockchainProviderError | UninitializedError | ConsentContractError
  > {
    return this.getConsentContract(consentContractAddres).andThen(
      (contract) => {
        return contract.getSignerRoleMembers();
      },
    );
  }

  public getTokenURI(
    consentContractAddres: EVMContractAddress,
    tokenId: TokenId,
  ): ResultAsync<
    TokenUri | null,
    ConsentContractError | UninitializedError | BlockchainProviderError
  > {
    return this.getConsentContract(consentContractAddres).andThen(
      (contract) => {
        return contract.tokenURI(tokenId);
      },
    );
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
