import {
  ID_GATEWAY_EIP_712_TYPES,
  ID_GATEWAY_ADDRESS,
} from "@farcaster/hub-nodejs";
import {
  EVMAccountAddress,
  EVMContractAddress,
  BlockchainCommonErrors,
  FarcasterIdGatewayContractError,
  UnixTimestamp,
  FarcasterRegisterSignature,
} from "@snickerdoodlelabs/objects";
import { TypedDataField, ethers } from "ethers";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IEthersContractError } from "@contracts-sdk/implementations/BlockchainErrorMapper.js";
import { FarcasterBaseContract } from "@contracts-sdk/implementations/farcaster/FarcasterBaseContract.js";
import {
  ContractOverrides,
  IFarcasterIdGatewayContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/interfaces/index.js";
import { ContractsAbis } from "@contracts-sdk/interfaces/objects/index.js";

@injectable()
export class FarcasterIdGatewayContract
  extends FarcasterBaseContract<FarcasterIdGatewayContractError>
  implements IFarcasterIdGatewayContract
{
  constructor(protected providerOrSigner: ethers.Provider | ethers.Signer) {
    super(
      providerOrSigner,
      EVMContractAddress(ID_GATEWAY_ADDRESS),
      ContractsAbis.FarcasterIdGatewayAbi.abi,
    );
  }

  public price(
    extraStorage?: bigint,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    // If extraStorage was provided, call price with it, otherwise call without
    // https://optimistic.etherscan.io/address/0x00000000fc25870c6ed6b6c7e41fb078b7656f69#code#F2#L64
    return this.ensureOptimism().andThen(() => {
      return ResultAsync.fromPromise(
        extraStorage != undefined
          ? (this.contract.price(extraStorage) as Promise<bigint>)
          : (this.contract.price() as Promise<bigint>),
        (e) => {
          return this.generateError(e, "Unable to call price()");
        },
      );
    });
  }

  public nonces(
    address: EVMAccountAddress,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return this.ensureOptimism().andThen(() => {
      return ResultAsync.fromPromise(
        this.contract.nonces(address) as Promise<bigint>,
        (e) => {
          return this.generateError(e, "Unable to call nonces()");
        },
      );
    });
  }

  public register(
    recoveryAddress: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("register"),
    ]).andThen(() => {
      return this.writeToContract("register", [recoveryAddress], overrides);
    });
  }

  public registerWithExtraStorage(
    recoveryAddress: EVMAccountAddress,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("register"),
    ]).andThen(() => {
      return this.writeToContract(
        "register",
        [recoveryAddress, extraStorage],
        overrides,
      );
    });
  }

  // Called by Admin EW to register for on behalf of a user's EW
  public registerFor(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: FarcasterRegisterSignature, // EIP-712 'Register' signature from fidOwner obtained from getRegisterSignature()
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("registerFor"),
    ]).andThen(() => {
      return this.price().andThen((registerPrice) => {
        // If there overrides provided, update its value to registerPrice.
        // If no override passed, create a new one ContractOverrides and update its value with registerPrice.
        const overridesToUpdate = overrides
          ? overrides
          : ({} as ContractOverrides);

        overridesToUpdate.value = registerPrice;

        return this.writeToContract(
          "registerFor",
          [ownerAddress, recoveryAddress, deadline, signature],
          overridesToUpdate,
        );
      });
    });
  }

  // Called by Admin EW to register for on behalf of a user's EW
  public registerForWithExtraStorage(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: FarcasterRegisterSignature, // EIP-712 'Register' signature from fidOwner obtained from getRegisterSignature()
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("registerFor"),
    ]).andThen(() => {
      return this.price(extraStorage).andThen((registerPrice) => {
        // If overrides provided, update its value to registerPrice.
        // If no override passed, create a new ContractOverrides and update its value with registerPrice.
        const overridesToUpdate = overrides
          ? overrides
          : ({} as ContractOverrides);

        overridesToUpdate.value = registerPrice;
        return this.writeToContract(
          "registerFor",
          [ownerAddress, recoveryAddress, deadline, signature, extraStorage],
          overrides,
        );
      });
    });
  }

  // Called by the owner's EW to sign a 'Register' signature
  public getRegisterSignature(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    nonce: bigint,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterRegisterSignature,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  > {
    return ResultUtils.combine([
      this.ensureOptimism(),
      this.ensureHasSigner("getRegisterSignature"),
    ]).andThen(() => {
      // message should be RegistrationParams struct
      //    https://docs.farcaster.xyz/reference/contracts/reference/id-gateway#register-signature
      //    Needs to be a EIP712 signature
      const message = {
        to: ownerAddress,
        recovery: recoveryAddress,
        nonce: nonce,
        deadline: deadline,
      };

      return ResultAsync.fromPromise(
        (this.providerOrSigner as ethers.Signer).signTypedData(
          ID_GATEWAY_EIP_712_TYPES.domain,
          this.removeReadonlyFromReadonlyTypes(ID_GATEWAY_EIP_712_TYPES.types),
          message,
        ) as Promise<FarcasterRegisterSignature>,
        (e) => {
          return e as FarcasterIdGatewayContractError;
        },
      );
    });
  }

  protected removeReadonlyFromReadonlyTypes<T>(
    obj: T,
  ): Record<string, TypedDataField[]> {
    return obj as Record<string, TypedDataField[]>;
  }

  protected generateContractSpecificError(
    msg: string,
    e: IEthersContractError,
    transaction: ethers.Transaction | null,
  ): FarcasterIdGatewayContractError {
    return new FarcasterIdGatewayContractError(msg, e, transaction);
  }
}
