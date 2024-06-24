import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterIdGatewayContractError,
  Signature,
  UnixTimestamp,
  FarcasterKeyGatewayContractError,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

import { BaseContract } from "@contracts-sdk/implementations/BaseContract.js";
import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import {
  ContractOverrides,
  IFarcasterKeyGatewayContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterKeyGatewayContract
  extends BaseContract<FarcasterKeyGatewayContractError>
  implements IFarcasterKeyGatewayContract
{
  constructor(
    protected providerOrSigner: ethers.Provider | ethers.Signer,
    protected contractAddress: EVMContractAddress,
  ) {
    super(
      providerOrSigner,
      contractAddress,
      ContractsAbis.FarcasterKeyGatewayAbi.abi,
    );
  }

  public add(
    key: string,
    metadata: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  > {
    // Based on the docs, only keyType and metadataType of 1 is supported at the moment
    // https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add
    return this.writeToContract("add", [1, key, 1, metadata], overrides);
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterKeyGatewayContractError {
    return new FarcasterKeyGatewayContractError(msg, e, transaction);
  }
}
