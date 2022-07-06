import { ResultAsync } from "neverthrow";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";

export interface IWalletProvider {
  connect(): ResultAsync<EVMAccountAddress, unknown>;
  getSignature(): ResultAsync<Signature, unknown>;
  getChainInfo(): ResultAsync<ChainInformation, unknown>;
}
