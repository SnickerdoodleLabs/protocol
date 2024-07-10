import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterUserId,
  FarcasterKeyGatewayContractError,
  FarcasterKeyGatewayAddKeySignature,
  FarcasterSignedKeyRequestSignature,
  UnixTimestamp,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import {
  ContractOverrides,
  IBaseContract,
  SignedKeyRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/index.js";
export interface IFarcasterKeyGatewayContract extends IBaseContract {
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
    signature: FarcasterKeyGatewayAddKeySignature,
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
    FarcasterKeyGatewayAddKeySignature,
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

export const IFarcasterKeyGatewayContractType = Symbol.for(
  "IFarcasterKeyGatewayContract",
);
