import {
  EVMAccountAddress,
  ChainId,
  Signature,
  ChainInformation,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWalletProvider {
  isInstalled: boolean;
  connect(): ResultAsync<EVMAccountAddress, unknown>;
  getSignature(message: string): ResultAsync<Signature, unknown>;
  getChainInfo(): ResultAsync<ChainInformation, unknown>;
}
