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
} from "@snickerdoodlelabs/objects";
import { Block } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "../IBaseContract";

import {
  ContractOverrides,
  SignedKeyRequest,
  WrappedTransactionResponse,
} from "@contracts-sdk/index";

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
    signature: FarcasterAddSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: EVMAccountAddress,
    encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterAddSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterUserId,
    keyToAdd: FarcasterKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedKeyRequest,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getSignedKeyRequestSignature(
    ownerFid: FarcasterUserId,
    keyToAdd: FarcasterKey, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<
    FarcasterSignedKeyRequestSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;
}
