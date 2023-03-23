import {
  AccountAddress,
  BlockNumber,
  DomainName,
  EarnedReward,
  EBackupPriority,
  EFieldKey,
  ERecordKey,
  EVMContractAddress,
  Invitation,
  LatestBlock,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
  Signature,
  TokenId,
  VolatileStorageMetadata,
} from "@snickerdoodlelabs/objects";
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
          new VolatileStorageMetadata(reward),
        );
      }),
    ).map(() => undefined);
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

  public setLatestBlockNumber(
    contractAddress: EVMContractAddress,
    blockNumber: BlockNumber,
  ): ResultAsync<void, PersistenceError> {
    const metadata = new VolatileStorageMetadata<LatestBlock>(
      new LatestBlock(contractAddress, blockNumber),
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
    const metadata = new VolatileStorageMetadata<LinkedAccount>(linkedAccount);
    return this.persistence.updateRecord(ERecordKey.ACCOUNT, metadata);
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
        new VolatileStorageMetadata(
          new ReceivingAccount(contractAddress, receivingAddress),
        ),
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
