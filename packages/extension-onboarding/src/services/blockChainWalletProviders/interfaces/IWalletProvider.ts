import { AccountAddress, Signature } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IWalletProvider {
  isInstalled: boolean;
  connect(): ResultAsync<AccountAddress, unknown>;
  getSignature(message: string): ResultAsync<Signature, unknown>;
}
