import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  OFT20RewardContractError,
  TokenAmount,
  Signature,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { ERC7529Contract } from "@contracts-sdk/implementations/ERC7529Contract.js";
import { ERewardRoles } from "@contracts-sdk/interfaces/enums/index.js";
import {
  ContractOverrides,
  IOFT20RewardContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class OFT20RewardContract
  extends ERC7529Contract<OFT20RewardContractError>
  implements IOFT20RewardContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(providerOrSigner, contractAddress, ContractsAbis.OFT20Reward.abi);
  }

  public name(): ResultAsync<
    string,
    OFT20RewardContractError | BlockchainCommonErrors
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
    OFT20RewardContractError | BlockchainCommonErrors
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
    OFT20RewardContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.decimals() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call decimals()");
      },
    ).map((decimalsBN) => {
      return Number(decimalsBN);
    });
  }

  public totalSupply(): ResultAsync<
    bigint,
    OFT20RewardContractError | BlockchainCommonErrors
  > {
    return ResultAsync.fromPromise(
      this.contract.totalSupply() as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call totalSupply()");
      },
    );
  }

  public balanceOf(
    address: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, OFT20RewardContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.balanceOf(address) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call balanceOf()");
      },
    );
  }

  public allowance(
    owner: EVMAccountAddress | EVMContractAddress,
    spender: EVMAccountAddress | EVMContractAddress,
  ): ResultAsync<bigint, OFT20RewardContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.allowance(owner, spender) as Promise<bigint>,
      (e) => {
        return this.generateError(e, "Unable to call allowance()");
      },
    );
  }

  public approve(
    spender: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  > {
    return this.writeToContract("approve", [spender, amount], overrides);
  }

  public transfer(
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  > {
    return this.writeToContract("transfer", [recipient, amount], overrides);
  }

  public transferFrom(
    sender: EVMAccountAddress | EVMContractAddress,
    recipient: EVMAccountAddress | EVMContractAddress,
    amount: TokenAmount,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  > {
    return this.writeToContract("transferFrom", [
      sender,
      recipient,
      amount,
      overrides,
    ]);
  }

  public hasRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
  ): ResultAsync<boolean, OFT20RewardContractError | BlockchainCommonErrors> {
    return ResultAsync.fromPromise(
      this.contract.hasRole(ERewardRoles[role], address) as Promise<boolean>,
      (e) => {
        return this.generateError(e, "Unable to call hasRole()");
      },
    );
  }

  public grantRole(
    role: keyof typeof ERewardRoles,
    address: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
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
    BlockchainCommonErrors | OFT20RewardContractError
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
    BlockchainCommonErrors | OFT20RewardContractError
  > {
    return this.writeToContract(
      "renounceRole",
      [ERewardRoles[role], address],
      overrides,
    );
  }

  public redeem(
    account: EVMAccountAddress,
    amount: TokenAmount,
    signature: Signature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | OFT20RewardContractError
  > {
    return this.writeToContract(
      "redeem",
      [account, amount, signature],
      overrides,
    );
  }

  // TODO: Add crossChain function call when feature is needed.

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): OFT20RewardContractError {
    return new OFT20RewardContractError(msg, e, transaction);
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
