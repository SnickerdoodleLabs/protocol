import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterUserId,
  FarcasterKeyGatewayContractError,
  FarcasterAddSignature,
  FarcasterSignedKeyRequestSignature,
  UnixTimestamp,
  FarcasterKey,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ContractOverrides,
  SignedKeyRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";
import { IFarcasterBaseContract } from "@contracts-sdk/interfaces/farcaster/IFarcasterBaseContract.js";

export interface IFarcasterKeyGatewayContract
  extends IFarcasterBaseContract<FarcasterKeyGatewayContractError> {
  nonces(
    address: EVMAccountAddress,
  ): ResultAsync<
    bigint,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  add(
    key: string,
    metadata: string,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  addFor(
    fidOwnerAddress: EVMAccountAddress,
    keyToAdd: string,
    encodedMetadata: string,
    deadline: UnixTimestamp,
    signature: FarcasterAddSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterAddSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterUserId,
    ownerEVMAddress: EVMAccountAddress,
    keyToAdd: ED25519PublicKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedKeyRequest,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getSignedKeyRequestSignature(
    ownerFid: FarcasterUserId,
    keyToAdd: ED25519PublicKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterSignedKeyRequestSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;
}
