import {
  AccountAddress,
  DomainName,
  EarnedReward,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  Invitation,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ILinkedAccountRepository } from "@core/interfaces/data/ILinkedAccountRepository.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/IDataWalletPersistence.js";
import { IContextProviderType, IContextProvider } from "@core/interfaces/utilities/index.js";

@injectable()
export class LinkedAccountRepository implements ILinkedAccountRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.persistence.getAll<LinkedAccount>(ERecordKey.ACCOUNT);
  }

  public getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
      .map((storedInvitations) => {
        if (storedInvitations == null) {
          return [];
        }

        return storedInvitations.map((storedInvitation) => {
          return InvitationForStorage.toInvitation(storedInvitation);
        });
      });
  }

  public addAcceptedInvitations(
    invitations: Invitation[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
      .andThen((storedInvitations) => {
        if (storedInvitations == null) {
          storedInvitations = [];
        }

        const allInvitations = storedInvitations.concat(
          invitations.map((invitation) => {
            return InvitationForStorage.fromInvitation(invitation);
          }),
        );

        return this.persistence.updateField(
          EFieldKey.ACCEPTED_INVITATIONS,
          allInvitations,
        );
      });
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(EFieldKey.ACCEPTED_INVITATIONS)
      .andThen((storedInvitations) => {
        if (storedInvitations == null) {
          storedInvitations = [];
        }

        const invitations = storedInvitations.filter((optIn) => {
          return !addressesToRemove.includes(optIn.consentContractAddress);
        });

        return this.persistence.updateField(
          EFieldKey.ACCEPTED_INVITATIONS,
          invitations,
        );
      });
  }

  public addEarnedRewards(
    rewards: EarnedReward[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      rewards.map((reward) => {
        return this.persistence.updateRecord<EarnedReward>(
          ERecordKey.EARNED_REWARDS,
          reward,
        );
      }),
    ).andThen(() => {
      return this.contextProvider.getContext().map((context) => {
        context.publicEvents.onEarnedRewardsAdded.next(rewards);
      });
    });
  }

  public getEarnedRewards(): ResultAsync<EarnedReward[], PersistenceError> {
    return this.persistence.getAll<EarnedReward>(
      ERecordKey.EARNED_REWARDS,
      undefined,
    );
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<EVMContractAddress[]>(EFieldKey.REJECTED_COHORTS)
      .andThen((raw) => {
        const saved = raw ?? [];
        return this.persistence.updateField(EFieldKey.REJECTED_COHORTS, [
          ...saved,
          ...consentContractAddresses,
        ]);
      });
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this.persistence
      .getField<EVMContractAddress[]>(EFieldKey.REJECTED_COHORTS)
      .map((raw) => {
        return raw ?? [];
      });
  }

  public addAccount(
    linkedAccount: LinkedAccount,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateRecord(ERecordKey.ACCOUNT, linkedAccount);
  }

  public removeAccount(
    accountAddress: AccountAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(ERecordKey.ACCOUNT, accountAddress);
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.DEFAULT_RECEIVING_ADDRESS,
      !receivingAddress ? ("" as AccountAddress) : receivingAddress,
    );
  }

  public getDefaultReceivingAddress(): ResultAsync<
    AccountAddress | null,
    PersistenceError
  > {
    return this.persistence
      .getField<AccountAddress>(EFieldKey.DEFAULT_RECEIVING_ADDRESS)
      .map((val) => (val == "" ? null : val));
  }

  // TODO: would rename this to setOrRemove
  public setReceivingAddress(
    contractAddress: EVMContractAddress,
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    if (receivingAddress && receivingAddress != "") {
      return this.persistence.updateRecord(
        ERecordKey.RECEIVING_ADDRESSES,
        new ReceivingAccount(contractAddress, receivingAddress),
      );
    }

    return this.persistence.deleteRecord(
      ERecordKey.RECEIVING_ADDRESSES,
      contractAddress,
    );
  }

  public getReceivingAddress(
    contractAddress: EVMContractAddress,
  ): ResultAsync<AccountAddress | null, PersistenceError> {
    return this.persistence
      .getObject<ReceivingAccount>(
        ERecordKey.RECEIVING_ADDRESSES,
        contractAddress,
      )
      .map((entry) => (!entry ? null : entry.receivingAddress));
  }
}

class InvitationForStorage {
  public constructor(
    public domain: DomainName,
    public consentContractAddress: EVMContractAddress,
    public tokenId: string,
    public businessSignature: Signature | null,
  ) {}

  static toInvitation(src: InvitationForStorage): Invitation {
    return new Invitation(
      src.domain,
      src.consentContractAddress,
      TokenId(BigInt(src.tokenId)),
      src.businessSignature,
    );
  }

  static fromInvitation(src: Invitation): InvitationForStorage {
    return new InvitationForStorage(
      src.domain,
      src.consentContractAddress,
      src.tokenId.toString(),
      src.businessSignature,
    );
  }
}
