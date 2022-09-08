import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  BlockchainProviderError,
  EVMAccountAddress,
  EVMContractAddress,
  UninitializedError,
  ConsentToken,
  ConsentContractError,
  AjaxError,
  ConsentContractRepositoryError,
  ConsentFactoryContractError,
  DataPermissions,
  HexString,
  TokenId,
  TokenUri,
  URLString,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IBlockchainProvider,
  IBlockchainProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";
import {
  IContractFactoryType,
  IContractFactory,
} from "@core/interfaces/utilities/factory/index.js";

@injectable()
export class ConsentContractRepository implements IConsentContractRepository {
  public constructor(
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IBlockchainProviderType)
    protected blockchainProvider: IBlockchainProvider,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IContractFactoryType)
    protected consentContractFactory: IContractFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getConsentTokens(
    consentContractAddress: EVMContractAddress,
    ownerAddress: EVMAccountAddress,
  ): ResultAsync<
    ConsentToken[],
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return this.getConsentContract(consentContractAddress).andThen(
      (consentContract) => {
        return consentContract.getConsentTokensOfAddress(ownerAddress);
      },
    );
  }

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

  public getCurrentConsentToken(
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    ConsentToken | null,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.getConsentContract(consentContractAddress),
    ]).andThen(([context, consentContract]) => {
      if (context.dataWalletAddress == null) {
        return errAsync(new UninitializedError());
      }
      return consentContract.getCurrentConsentTokenOfAddress(
        EVMAccountAddress(context.dataWalletAddress),
      );
    });
  }

  public isAddressOptedIn(
    consentContractAddress: EVMContractAddress,
    address?: EVMAccountAddress,
  ): ResultAsync<
    boolean,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
  > {
    return ResultUtils.combine([
      this.getConsentContract(consentContractAddress),
      this.contextProvider.getContext(),
    ])
      .andThen(([consentContract, context]) => {
        // We will use the data wallet address if another address is not provided
        if (address == null) {
          if (context.dataWalletAddress == null) {
            return errAsync(
              new UninitializedError(
                "No data wallet address provided and core uninitialized in isAddressOptedIn",
              ),
            );
          }
          address = EVMAccountAddress(context.dataWalletAddress);
        }
        return consentContract.balanceOf(address);
      })
      .map((numberOfTokens) => {
        return numberOfTokens > 0;
      });
  }

  public getConsentContracts(): ResultAsync<
    Map<EVMContractAddress, IConsentContract>,
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return this.getOptedInConsentContractAddresses()
      .andThen((contractAddresses) => {
        return this.consentContractFactory.factoryConsentContracts(
          contractAddresses,
        );
      })
      .map((consentContracts) => {
        return new Map(
          consentContracts.map((consentContract) => {
            return [consentContract.getContractAddress(), consentContract];
          }),
        );
      });
  }

  public getOptedInConsentContractAddresses(): ResultAsync<
    EVMContractAddress[],
    BlockchainProviderError | UninitializedError | ConsentFactoryContractError
  > {
    return ResultUtils.combine([
      this.consentContractFactory.factoryConsentFactoryContract(),
      this.contextProvider.getContext(),
    ]).andThen(([consentFactoryContract, context]) => {
      if (context.dataWalletAddress == null) {
        return errAsync(new UninitializedError());
      }
      return consentFactoryContract.getOptedInConsentContractAddressForAccount(
        EVMAccountAddress(context.dataWalletAddress),
      );
    });
  }

  public encodeOptIn(
    consentContractAddress: EVMContractAddress,
    tokenId: TokenId,
    dataPermissions: DataPermissions | null,
  ): ResultAsync<HexString, BlockchainProviderError | UninitializedError> {
    return this.getConsentContract(consentContractAddress).map((contract) => {
      return contract.encodeOptIn(tokenId, TokenUri("ConsentConditionsGoHere")); // TODO: add data permissions param
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
