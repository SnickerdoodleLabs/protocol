import {
  BlockchainProviderError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IConsentContractService {
  initializeConsentContracts(): ResultAsync<
    void,
    BlockchainProviderError | UninitializedError
  >;
}

export const IConsentContractServiceType = Symbol.for(
  "IConsentContractService",
);
