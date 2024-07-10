import {
  BlockchainCommonErrors,
  FarcasterUserId,
  FarcasterKeyRegistryContractError,
  EFarcasterKeyState,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/index.js";

export interface IFarcasterKeyRegistryContract extends IBaseContract {
  /**
   * @notice Return number of active keys for a given fid.
   *
   * @param fid the fid associated with the keys.
   * @param keyState Filter count for keys Added or Removed, https://docs.farcaster.xyz/reference/contracts/reference/key-registry#totalkeys
   *
   * @return uint256 total number of active keys associated with the fid.
   */
  totalKeys(
    fid: FarcasterUserId,
    keyState: EFarcasterKeyState,
  ): ResultAsync<
    bigint,
    FarcasterKeyRegistryContractError | BlockchainCommonErrors
  >;

  /**
   * @notice Return an array of all active keys for a given fid.
   * @dev    WARNING: This function will copy the entire key set to memory,
   *         which can be quite expensive. This is intended to be called
   *         offchain with eth_call, not onchain.
   *
   * @param fid the fid associated with the keys.
   * @param keyState Filter count for keys Added or Removed, https://docs.farcaster.xyz/reference/contracts/reference/key-registry#totalkeys
   *
   * @return bytes[] Array of all keys.
   */
  keysOf(
    fid: FarcasterUserId,
    keyState: EFarcasterKeyState,
  ): ResultAsync<
    ED25519PublicKey[],
    FarcasterKeyRegistryContractError | BlockchainCommonErrors
  >;
}

export const IFarcasterKeyRegistryContractType = Symbol.for(
  "IFarcasterKeyRegistryContract",
);
