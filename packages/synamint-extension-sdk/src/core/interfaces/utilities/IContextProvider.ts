import {
  DataWalletAddress,
  EarnedReward,
  EVMContractAddress,
  Invitation,
  LinkedAccount,
  SocialProfileLinkedEvent,
  UUID,
  EProfileFieldType,
} from "@snickerdoodlelabs/objects";
import { AccountContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AppContext";
import {
  IInternalState,
  IExternalState,
} from "@synamint-extension-sdk/shared/interfaces/states";
import { Subject } from "rxjs";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getErrorSubject(): Subject<Error>;
  getInternalState(): IInternalState;
  getExterenalState(): IExternalState;
  addInvitation(invitation: Invitation): UUID;
  getInvitation(id: UUID): Invitation | undefined;
  setAccountContext(dataWalletAddress: DataWalletAddress): void;
  // port notification emitters
  onAccountAdded(accountAddress: LinkedAccount): void;
  onAccountRemoved(accountAddress: LinkedAccount): void;
  onEarnedRewardsAdded(rewards: EarnedReward[]): void;
  onSocialProfileLinked(event: SocialProfileLinkedEvent): void;
  onProfileFieldChanged(profileFieldType: EProfileFieldType): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
