import {
  AccountAddress,
  BlockNumber,
  DomainName,
  EarnedReward,
  EBackupPriority,
  EVMContractAddress,
  Invitation,
  JSONString,
  LinkedAccount,
  PersistenceError,
  Signature,
  TokenId,
} from "@snickerdoodlelabs/objects";
import {
  EFieldKey,
  ERecordKey,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/persistence";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ILinkedAccountRepository } from "@core/interfaces/data/ILinkedAccountRepository.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/IDataWalletPersistence.js";

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
      .getField<JSONString>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
      .map((raw) => {
        const storedInvitations = JSON.parse(
          raw != null ? raw : JSONString("[]"),
        ) as InvitationForStorage[];

        return storedInvitations.map((storedInvitation) => {
          return InvitationForStorage.toInvitation(storedInvitation);
        });
      });
  }

  public addAcceptedInvitations(
    invitations: Invitation[],
  ): ResultAsync<void, PersistenceError> {
    return this.persistence
      .getField<JSONString>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
      .andThen((raw) => {
        const storedInvitations = JSON.parse(
          raw != null ? raw : JSONString("[]"),
        ) as InvitationForStorage[];

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
      .getField<JSONString>(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
      )
      .andThen((raw) => {
        const storedInvitations = JSON.parse(
          raw != null ? raw : JSONString("[]"),
        ) as InvitationForStorage[];

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
          new VolatileStorageMetadata(EBackupPriority.NORMAL, reward),
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
    return this.persistence
      .getField<JSONString>(EFieldKey.REJECTED_COHORTS, EBackupPriority.NORMAL)
      .andThen((raw) => {
        const saved = JSON.parse(raw ?? "[]") as EVMContractAddress[];
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
      .getField<JSONString>(EFieldKey.REJECTED_COHORTS, EBackupPriority.NORMAL)
      .map((raw) => {
        return JSON.parse(raw ?? "[]") as EVMContractAddress[];
      });
  }

  public setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    const metadata = new VolatileStorageMetadata<LatestBlockEntry>(
      EBackupPriority.NORMAL,
      {
        contract: contractAddress,
        block: blockNumber,
      },
    );
    return this.persistence.updateRecord(ERecordKey.LATEST_BLOCK, metadata);
  }

  public getLatestBlockNumber(
    contractAddress: EVMContractAddress,
  ): ResultAsync<BlockNumber, PersistenceError> {
    return this.persistence
      .getObject<LatestBlockEntry>(
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

interface LatestBlockEntry {
  contract: EVMContractAddress;
  block: BlockNumber;
}
