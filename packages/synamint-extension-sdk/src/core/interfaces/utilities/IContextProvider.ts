import {
  DataWalletAddress,
  EarnedReward,
  Invitation,
  LinkedAccount,
  SocialProfileLinkedEvent,
  UUID,
  EProfileFieldType,
  CloudStorageActivatedEvent,
  EVMContractAddress,
  IpfsCID,
  SDQLQueryRequest,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

import { AccountContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AppContext";
import {
  IInternalState,
  IExternalState,
} from "@synamint-extension-sdk/shared/interfaces/states";

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
  onCohortJoined(consentAddress: EVMContractAddress): void;
  onCohortLeft(consentAddress: EVMContractAddress): void;
  onLinkAccountRequested(): void 

  onCloudStorageActivated(event: CloudStorageActivatedEvent): void;
  onCloudStorageDeactivated(event: CloudStorageActivatedEvent): void;
  onQueryPosted(queryRequest: SDQLQueryRequest): void;
  onProfileFieldChanged(profileFieldType: EProfileFieldType, value: any): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
