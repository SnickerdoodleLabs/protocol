import { AccountAddress } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IAccountService {
  handleAddAccountSuggestion(
    accountAddress: AccountAddress,
  ): ResultAsync<void, Error>;
}

export const IAccountServiceType = Symbol.for("IAccountService");
