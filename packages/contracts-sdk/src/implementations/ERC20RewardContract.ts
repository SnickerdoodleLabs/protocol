import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  ERC20ContractError,
  TokenAmount,
  DomainName,
} from "@snickerdoodlelabs/objects";
import { BigNumber, ethers, EventFilter } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERewardRoles } from "@contracts-sdk/interfaces/enums/index.js";
import {
  ContractOverrides,
  IERC20RewardContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class ERC20RewardContract
  extends BaseContract<ERC20ContractError>
  implements IERC20RewardContract
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
    ).map((decimalsBN) => {
      return decimalsBN.toNumber();
    });
  }

  public totalSupply(): ResultAsync<
    bigint,
    ERC20ContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.totalSupply() as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call totalSupply()");
      },
    ).map((totalSupplyBN) => {
      return BigInt(totalSupplyBN.toString());
    });
  }

  public balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, ERC20ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    ).map((balanceBN) => {
      return BigInt(balanceBN.toString());
    });
  }

  public allowance(
    owner: EVMAccountAddress | EVMContractAddress,
    spender: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, ERC20ContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.allowance(owner, spender) as Promise<BigNumber>,
      (e) => {
        return this.generateError(e, "Unable to call allowance()");
      },
    ).map((allowanceBN) => {
      return BigInt(allowanceBN.toString());
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

  public grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract(
      "grantRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public revokeRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract(
      "revokeRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public renounceRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract(
      "renounceRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public addDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract("addDomain", [domain], overrides);
  }

  public removeDomain(
    domain: DomainName,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | ERC20ContractError
  > {
    return this.writeToContract("removeDomain", [domain], overrides);
  }

  public getDomains(): ResultAsync<
    DomainName[],
    BlockchainCommonErrors | ERC20ContractError
  > {
    return ResultAsync.fromPromise(
      // returns array of domains
      this.contract.getDomains() as Promise<DomainName[]>,
      (e) => {
        return this.generateError(e, "Unable to call getDomains()");
      },
    );
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): ERC20ContractError {
    return new ERC20ContractError(msg, e, transaction);
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
