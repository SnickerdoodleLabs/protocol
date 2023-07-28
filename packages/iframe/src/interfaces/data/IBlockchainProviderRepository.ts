import { AccountAddress, EChain, Signature } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IBlockchainProviderRepository {
  connect(): ResultAsync<AccountAddress, Error>;
  getSignature(message: string): ResultAsync<Signature, Error>;
  requestPermissionChange(): ResultAsync<AccountAddress, Error>;
  getCurrentAccount(): ResultAsync<AccountAddress, Error>;
  getCurrentChain(): ResultAsync<EChain, Error>;
}

export const IBlockchainProviderRepositoryType = Symbol.for(
  "IBlockchainProviderRepository",
);
