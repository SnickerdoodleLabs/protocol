import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  SmartWalletContractError,
  TokenAmount,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  WrappedTransactionResponse,
  ISmartWalletContract,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class SmartWalletContract
  extends BaseContract<SmartWalletContractError>
  implements ISmartWalletContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.SmartWalletAbi.abi);
  }

  public getOwner(): ResultAsync<
    string,
    SmartWalletContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.getOwner() as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call getOwner()");
      },
    );
  }

  public withdrawAllNativeTokenBalance(
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  > {
    return this.writeToContract("withdraw", [], overrides);
  }

  public transferERC20(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  > {
    return this.writeToContract(
      "transferERC20",
      [tokenAddress, to, amount],
      overrides,
    );
  }

  public transferERC721(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    tokenId: TokenId,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  > {
    return this.writeToContract(
      "transferERC20",
      [tokenAddress, to, tokenId],
      overrides,
    );
  }

  public transferERC1155(
    tokenAddress: EVMContractAddress,
    to: EVMAccountAddress | EVMContractAddress,
    tokenId: TokenId,
    amount: TokenAmount,
    data: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | SmartWalletContractError
  > {
    return this.writeToContract(
      "transferERC20",
      [tokenAddress, to, tokenId, amount, data],
      overrides,
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): SmartWalletContractError {
    return new SmartWalletContractError(msg, e, transaction);
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): ethers.DeferredTopicFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };
}
