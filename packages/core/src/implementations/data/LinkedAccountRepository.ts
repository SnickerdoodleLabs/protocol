import {
  AccountAddress,
  BlockNumber,
  DomainName,
  EarnedReward,
  EBackupPriority,
  EVMContractAddress,
  Invitation,
  InvitationForStorage,
  JSONString,
  LatestBlock,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
  RejectedCohort,
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

@injectable()
export class LinkedAccountRepository implements ILinkedAccountRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
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
      .getAll<InvitationForStorage>(ERecordKey.ACCEPTED_INVITATIONS)
      .map((invitations) => {
        return invitations.map((invitation) =>
          InvitationForStorage.toInvitation(invitation),
        );
      });
  }

  public addAcceptedInvitations(
    invitations: Invitation[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      invitations.map((invitation) => {
        return this.persistence.updateRecord(
          ERecordKey.ACCEPTED_INVITATIONS,
          new VolatileStorageMetadata<InvitationForStorage>(
            EBackupPriority.HIGH,
            InvitationForStorage.fromInvitation(invitation),
            InvitationForStorage.CURRENT_VERSION,
          ),
        );
      }),
    ).map(() => undefined);
  }

  public removeAcceptedInvitationsByContractAddress(
    addressesToRemove: EVMContractAddress[],
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine(
      addressesToRemove.map((address) => {
        return this.persistence
          .getAll<InvitationForStorage>(
            ERecordKey.ACCEPTED_INVITATIONS,
            "consentContractAddress",
            EBackupPriority.HIGH,
          )
          .andThen((invitations) => {
            return ResultUtils.combine(
              invitations.map((invitation) => {
                return this.persistence.deleteRecord(
                  ERecordKey.ACCEPTED_INVITATIONS,
                  [invitation.consentContractAddress, invitation.tokenId],
                  EBackupPriority.HIGH,
                );
              }),
            );
          });
      }),
    ).map(() => undefined);
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
    ).map(() => undefined);
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
    return ResultUtils.combine(
      consentContractAddresses.map((consentContractAddress) => {
        return this.persistence.updateRecord(
          ERecordKey.REJECTED_COHORTS,
          new VolatileStorageMetadata<RejectedCohort>(
            EBackupPriority.NORMAL,
            new RejectedCohort(consentContractAddress),
            RejectedCohort.CURRENT_VERSION,
          ),
        );
      }),
    ).map(() => undefined);
  }

  public getRejectedCohorts(): ResultAsync<
    EVMContractAddress[],
    PersistenceError
  > {
    return this.persistence.getAllKeys<EVMContractAddress>(
      ERecordKey.REJECTED_COHORTS,
    );
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
