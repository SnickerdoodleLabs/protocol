import {
  AccountAddress,
  BlockNumber,
  DomainName,
  EarnedReward,
  EBackupPriority,
  EVMContractAddress,
  Invitation,
  JSONString,
  LatestBlock,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
  Signature,
  TokenId,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
import { EFieldKey, ERecordKey } from "@snickerdoodlelabs/persistence";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ILinkedAccountRepository } from "@core/interfaces/data/ILinkedAccountRepository.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/IDataWalletPersistence.js";
import { IContextProviderType, IContextProvider } from "@core/interfaces/utilities";

@injectable()
export class LinkedAccountRepository implements ILinkedAccountRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
  ) {}

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.persistence.getAll<LinkedAccount>(
      ERecordKey.ACCOUNT,
      undefined,
      EBackupPriority.HIGH,
    );
  }

  public getAcceptedInvitations(): ResultAsync<Invitation[], PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
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
      .getField<InvitationForStorage[]>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
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
          EBackupPriority.HIGH,
        );
      });
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<InvitationForStorage[]>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
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
          EBackupPriority.HIGH,
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
          new VolatileStorageMetadata(
            EBackupPriority.NORMAL,
            reward,
            EarnedReward.CURRENT_VERSION,
          ),
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
      EBackupPriority.NORMAL,
    );
  }

  public addRejectedCohorts(
    consentContractAddresses: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<EVMContractAddress[]>(
        EFieldKey.REJECTED_COHORTS,
        EBackupPriority.NORMAL,
      )
      .andThen((raw) => {
        const saved = raw ?? [];
        return this.persistence.updateField(
          EFieldKey.REJECTED_COHORTS,
          [...saved, ...consentContractAddresses],
          EBackupPriority.NORMAL,
        );
      });
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this.persistence
      .getField<EVMContractAddress[]>(
        EFieldKey.REJECTED_COHORTS,
        EBackupPriority.NORMAL,
      )
      .map((raw) => {
        return raw ?? [];
      });
  }

  public setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    const metadata = new VolatileStorageMetadata<LatestBlock>(
      EBackupPriority.NORMAL,
      new LatestBlock(contractAddress, blockNumber),
      LatestBlock.CURRENT_VERSION,
    );
    return this.persistence.updateRecord(ERecordKey.LATEST_BLOCK, metadata);
  }

  public getLatestBlockNumber(
    contractAddress: EVMContractAddress,
  ): ResultAsync<BlockNumber, PersistenceError> {
    return this.persistence
      .getObject<LatestBlock>(
        ERecordKey.LATEST_BLOCK,
        contractAddress.toString(),
        EBackupPriority.NORMAL,
      )
      .map((block) => {
        if (block == null) {
          return BlockNumber(-1);
        }
        return block.block;
      });
  }

  public addAccount(
    linkedAccount: LinkedAccount,
  ): ResultAsync<void, PersistenceError> {
    const metadata = new VolatileStorageMetadata<LinkedAccount>(
      EBackupPriority.HIGH,
      linkedAccount,
      LinkedAccount.CURRENT_VERSION,
    );
    return this.persistence.updateRecord(ERecordKey.ACCOUNT, metadata);
  }

  public removeAccount(
    accountAddress: AccountAddress,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.deleteRecord(
      ERecordKey.ACCOUNT,
      accountAddress,
      EBackupPriority.HIGH,
    );
  }

  public setDefaultReceivingAddress(
    receivingAddress: AccountAddress | null,
  ): ResultAsync<void, PersistenceError> {
    return this.persistence.updateField(
      EFieldKey.DEFAULT_RECEIVING_ADDRESS,
      !receivingAddress ? ("" as AccountAddress) : receivingAddress,
      EBackupPriority.NORMAL,
    );
  }

  public getDefaultReceivingAddress(): ResultAsync<
    AccountAddress | null,
    PersistenceError
  > {
    return this.persistence
      .getField<AccountAddress>(
        EFieldKey.DEFAULT_RECEIVING_ADDRESS,
        EBackupPriority.NORMAL,
      )
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
        new VolatileStorageMetadata(
          EBackupPriority.NORMAL,
          new ReceivingAccount(contractAddress, receivingAddress),
          ReceivingAccount.CURRENT_VERSION,
        ),
      );
    }

    return this.persistence.deleteRecord(
      ERecordKey.RECEIVING_ADDRESSES,
      contractAddress,
      EBackupPriority.NORMAL,
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
