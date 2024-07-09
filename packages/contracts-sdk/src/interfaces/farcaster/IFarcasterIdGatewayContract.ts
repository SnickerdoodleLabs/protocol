import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterIdGatewayContractError,
  FarcasterIDGatewayRegisterIdSignature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ContractOverrides,
  IFarcasterBaseContract,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";

export interface IFarcasterIdGatewayContract
  extends IFarcasterBaseContract<FarcasterIdGatewayContractError> {
  /**
   * @notice Calculate the total price to register, equal to 1 storage unit or with extra storage
   *
   * @return Total price in wei.
   */
  price(
    extraStorage?: bigint,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Get the next unused nonce for an address. Used for generating an EIP-712 Register signature for registerFor.
   *
   * @return Next unused nonce for address
   *
   *  https://optimistic.etherscan.io/address/0x00000000fc25870c6ed6b6c7e41fb078b7656f69#code#F16#L18
   */
  nonces(
    address: EVMAccountAddress,
  ): ResultAsync<
    bigint,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to the caller. The caller must not have an fid.
   *
   * @param recovery Address which can recover the fid. Set to zero to disable recovery.
   *
   * @return fid registered FID.
   */
  register(
    recoveryAddress: EVMAccountAddress,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to the caller and rent additional storage.
   *         The caller must not have an fid.
   *
   * @param recovery     Address which can recover the fid. Set to zero to disable recovery.
   * @param extraStorage Number of additional storage units to rent.
   *
   * @return fid registered FID.
   */
  registerWithExtraStorage(
    recoveryAddress: EVMAccountAddress,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    BlockchainCommonErrors | FarcasterIdGatewayContractError
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to any address. A signed message from the address
   *         must be provided which approves both the to and the recovery. The address must not
   *         have an fid.
   *
   * @param to       Address which will own the fid.
   * @param recovery Address which can recover the fid. Set to zero to disable recovery.
   * @param deadline Expiration timestamp of the signature.
   * @param sig      EIP-712 Register signature signed by the to address.
   *
   * @return fid registered FID.
   */
  registerFor(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: FarcasterIDGatewayRegisterIdSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Register a new Farcaster ID (fid) to any address and rent additional storage.
   *         A signed message from the address must be provided which approves both the to
   *         and the recovery. The address must not have an fid.
   *
   * @param to           Address which will own the fid.
   * @param recovery     Address which can recover the fid. Set to zero to disable recovery.
   * @param deadline     Expiration timestamp of the signature.
   * @param sig          EIP-712 Register signature signed by the to address.
   * @param extraStorage Number of additional storage units to rent.
   *
   * @return fid registered FID.
   */
  registerForWithExtraStorage(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    deadline: UnixTimestamp,
    signature: FarcasterIDGatewayRegisterIdSignature,
    extraStorage: bigint,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Returns a signature of the Register function signed by the function caller
   *         https://docs.farcaster.xyz/reference/contracts/reference/id-gateway#register-signature
   *
   * @param ownerAddress Address which will own the fid.
   * @param recovery     Address which can recover the fid. Set to zero to disable recovery.
   * @param nonce        The next unused nonce on the Id Gateway contract, obtained via nonces()
   * @param deadline     Expiration timestamp of the signature.
   *
   * @return Signature of a the Register function call.
   */
  getRegisterSignature(
    ownerAddress: EVMAccountAddress,
    recoveryAddress: EVMAccountAddress,
    nonce: bigint,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterIDGatewayRegisterIdSignature,
    FarcasterIdGatewayContractError | BlockchainCommonErrors
  >;
}

export const IFarcasterIdGatewayContractType = Symbol.for(
  "IFarcasterIdGatewayContract",
);
