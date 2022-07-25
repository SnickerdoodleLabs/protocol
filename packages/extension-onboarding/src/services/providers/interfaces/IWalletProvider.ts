import { ResultAsync } from "neverthrow";
import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";

export interface IWalletProvider {
  isInstalled: boolean;
  connect(): ResultAsync<EVMAccountAddress, unknown>;
  getSignature(message: string): ResultAsync<Signature, unknown>;
  getChainInfo(): ResultAsync<ChainInformation, unknown>;
}
