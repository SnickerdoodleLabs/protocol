import { NobleEd25519Signer } from "@farcaster/hub-nodejs";
import {
  BlockchainCommonErrors,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";

export interface IFarcasterBaseContract<TContractSpecificError>
  extends IBaseContract {
  // To expose the ED25519 capability to all Farcaster wrappers
  getNobleED25519Signer(
    ownerWallet: ethers.Wallet,
  ): ResultAsync<
    NobleEd25519Signer,
    TContractSpecificError | BlockchainCommonErrors
  >;
  getNobleED25519SignerPublicKKey(
    ownerWallet: ethers.Wallet,
  ): ResultAsync<
    ED25519PublicKey,
    TContractSpecificError | BlockchainCommonErrors
  >;
}
