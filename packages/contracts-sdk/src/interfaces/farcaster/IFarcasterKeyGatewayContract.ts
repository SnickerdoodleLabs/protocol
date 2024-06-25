import {
  BlockchainCommonErrors,
  EVMAccountAddress,
  EncodedSignedKeyRequestMetadata,
  FarcasterId,
  FarcasterKeyGatewayContractError,
  SignedAddSignature,
  SignedKeyRequestSignature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
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
    signature: SignedAddSignature,
    overrides?: ContractOverrides,
  ): ResultAsync<
    WrappedTransactionResponse,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getAddSignature(
    ownerAddress: EVMAccountAddress,
    keyToAdd: EVMAccountAddress,
    encodedMetadata: EncodedSignedKeyRequestMetadata,
    deadline: UnixTimestamp,
  ): ResultAsync<
    SignedAddSignature,
    FarcasterKeyGatewayContractError | BlockchainCommonErrors
  >;

  getSignedKeyRequestSignatureAndEncodedMetadata(
    ownerFid: FarcasterId,
    keyToAdd: EVMAccountAddress, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<SignedKeyRequest, FarcasterKeyGatewayContractError>;

  getSignedKeyRequestSignature(
    ownerFid: FarcasterId,
    keyToAdd: EVMAccountAddress, // key to be tied to account
    deadline: UnixTimestamp,
  ): ResultAsync<SignedKeyRequestSignature, FarcasterKeyGatewayContractError>;
}
