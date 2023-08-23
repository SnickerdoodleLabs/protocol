import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import {
  ContractOverrides,
  IERC20Contract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";
import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  ERC20ContractError,
  TokenAmount,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers, EventFilter } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class ERC20Contract
  extends BaseContract<ERC20ContractError>
  implements IERC20Contract
{
  constructor(
    protected providerOrSigner:
      | ethers.providers.Provider
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.ERC20.abi);
  }

  public name(): ResultAsync<
    string,
    ERC20ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.name() as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call name()");
      },
    );
  }

  public symbol(): ResultAsync<
    string,
    ERC20ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.symbol() as Promise<string>,
      (e) => {
        return this.generateError(e, "Unable to call symbol()");
      },
    );
  }

  public decimals(): ResultAsync<
    number,
    ERC20ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.decimals() as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call decimals()");
      },
    ).map((bnDecimals) => {
      return bnDecimals.toNumber();
    });
  }

  public totalSupply(): ResultAsync<
    number,
    ERC20ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.totalSupply() as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call totalSupply()");
      },
    ).map((bnTotalSupply) => {
      return bnTotalSupply.toNumber();
    });
  }

  public balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<number, ERC20ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    ).map((bnBalance) => {
      return bnBalance.toNumber();
    });
  }

  public allowance(
    owner: EVMAccountAddress | EVMContractAddress,
    spender: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<number, ERC20ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.allowance(owner, spender) as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call allowance()");
      },
    ).map((bnAllowance) => {
      return bnAllowance.toNumber();
    });
  }

  public approve(
    spender: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract("approve", [spender, amount, overrides]);
  }

  public transfer(
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract("transfer", [recipient, amount, overrides]);
  }

  public transferFrom(
    sender: EVMAccountAddress | EVMContractAddress,
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract("transferFrom", [
      sender,
      recipient,
      amount,
      overrides,
    ]);
  }

  protected generateContractSpecificError(
    msg: string,
    reason: string | undefined,
    e: unknown,
  ): ERC20ContractError {
    return new ERC20ContractError(msg, reason, e);
  }

  public filters = {
    Transfer: (
      fromAddress: EVMAccountAddress | null,
      toAddress: EVMAccountAddress | null,
    ): EventFilter => {
      return this.contract.filters.Transfer(fromAddress, toAddress);
    },
  };
}
