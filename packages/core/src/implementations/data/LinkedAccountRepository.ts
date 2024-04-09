import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  AccountAddress,
  EarnedReward,
  EChain,
  EChainTechnology,
  EFieldKey,
  ERecordKey,
  EVMAccountAddress,
  EVMContractAddress,
  getChainInfoByChain,
  LinkedAccount,
  PersistenceError,
  ReceivingAccount,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { DataValidationUtils } from "@core/implementations/utilities/index.js";
import { ILinkedAccountRepository } from "@core/interfaces/data/index.js";
import {
  IDataWalletPersistence,
  IDataWalletPersistenceType,
} from "@core/interfaces/data/utilities/index.js";
import {
  IContextProviderType,
  IContextProvider,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class LinkedAccountRepository implements ILinkedAccountRepository {
  public constructor(
    @inject(IDataWalletPersistenceType)
    protected persistence: IDataWalletPersistence,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.persistence
      .getAll<LinkedAccount>(ERecordKey.ACCOUNT)
      .map((accounts) => {
        return accounts.map((account) => {
          account.sourceAccountAddress =
            DataValidationUtils.removeChecksumFromAccountAddress(
              account.sourceAccountAddress,
              account.sourceChain,
            );
          return account;
        });
      });
  }

  public getLinkedAccount(
    accountAddress: AccountAddress,
    chain: EChain,
  ): ResultAsync<LinkedAccount | null, PersistenceError> {
    const chainInfo = getChainInfoByChain(chain);
    return this.persistence
      .getAll<LinkedAccount>(ERecordKey.ACCOUNT)
      .map((accounts) => {
        const found = accounts
          .map((account) => {
            // If we're on an EVM chain, we need to make sure the account address is not checksum'd
            // Solana addresses are Base-58; lowercasing them will destroy them.
            account.sourceAccountAddress =
              DataValidationUtils.removeChecksumFromAccountAddress(
                account.sourceAccountAddress,
                account.sourceChain,
              );
            return account;
          })
          .find((account) => {
            return (
              account.sourceAccountAddress == accountAddress &&
              account.sourceChain == chain
            );
          });
        if (found == null) {
          return null;
        }
        return found;
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
    if (receivingAddress != null && receivingAddress != "") {
      return this.persistence.updateRecord(
        ERecordKey.RECEIVING_ADDRESSES,
        new ReceivingAccount(contractAddress, receivingAddress),
      );
    }

    this.logUtils.info(`Removing receiving address for ${contractAddress}`);
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
