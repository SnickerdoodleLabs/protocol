import { NobleEd25519Signer } from "@farcaster/hub-nodejs";
import {
  BlockchainCommonErrors,
  ED25519PublicKey,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultAsync } from "neverthrow";

import { IBaseContract } from "@contracts-sdk/interfaces/IBaseContract.js";

export interface IFarcasterBaseContract<TContractSpecificError>
  extends IBaseContract {}

export const IFarcasterBaseContractType = Symbol.for("IFarcasterBaseContract");
