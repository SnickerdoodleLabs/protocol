import {SnickerdoodleCore} from '@snickerdoodlelabs/core';
import Crypto from 'crypto';
import {
  AccountAddress,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  CrumbsContractError,
  DataPermissions,
  DataWalletAddress,
  DomainName,
  EChain,
  EInvitationStatus,
  EVMContractAddress,
  IConfigOverrides,
  InvalidSignatureError,
  Invitation,
  IpfsCID,
  ISnickerdoodleCore,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  PersistenceError,
  ProviderUrl,
  Signature,
  TokenId,
  UninitializedError,
  UnsupportedLanguageError,
  URLString,
} from '@snickerdoodlelabs/objects';
import {Container} from 'inversify';
import {okAsync, ResultAsync} from 'neverthrow';
import {MobileStorageUtils} from './implementations/utils/MobileStorageUtils';
import { MemoryVolatileStorage } from '@snickerdoodlelabs/persistence';

export class MobileCore {
  protected iocContainer: Container;
  protected core: ISnickerdoodleCore;
  constructor() {
    const modelAliases = {
      definitions: {
        backupIndex:
          'kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k',
      },
      schemas: {
        DataWalletBackup:
          'ceramic://k3y52l7qbv1fryeqpnu3xx9st37h6soh7cosvpskp59r6wj8ag4zl2n3u3283xrsw',
        BackupIndex:
          'ceramic://k3y52l7qbv1fryk2h9xhsf2mai9wsiga2eld67pn8vgo3845yad3bn9plleei53pc',
      },
      tiles: {},
    };
    this.iocContainer = new Container();

    const SIX_HOURS_MS = 21600000;

    // These values are the defaults in the config provider
    const UNREALISTIC_BUT_WORKING_POLL_INTERVAL = 5000;
    const UNREALISTIC_BUT_WORKING_BACKUP_INTERVAL = 10000;

    const coreConfig = {
      controlChainId: ChainId(43113),
      supportedChains: [ChainId(43113), ChainId(1)],
      ipfsFetchBaseUrl: URLString(
        'https://ipfs-gateway.snickerdoodle.com/ipfs/',
      ),
      defaultInsightPlatformBaseUrl: URLString(
        'https://insight-api.snickerdoodle.com/v0/',
      ),
      requestForDataCheckingFrequency: 30000,
      accountIndexingPollingIntervalMS: 25000,
      accountBalancePollingIntervalMS: 20000,
      accountNFTPollingIntervalMS: 18000,
      dataWalletBackupIntervalMS: 15000,
    } as IConfigOverrides;

    this.core = new SnickerdoodleCore(
      coreConfig,
      new MobileStorageUtils(),
      new MemoryVolatileStorage(),
      undefined,
    );
    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
  }

  public unlock(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ) {
    console.log('accountAddress', accountAddress);
    console.log('signature', signature);
    console.log('languageCode', languageCode);
    console.log('chain', chain);
    this.core.unlock(accountAddress, signature, languageCode, chain);
  }

  public getDataWalletForAccount(
    accountAddress: AccountAddress,
    signature: Signature,
    languageCode: LanguageCode,
    chain: EChain,
  ): ResultAsync<
    DataWalletAddress | null,
    | PersistenceError
    | UninitializedError
    | BlockchainProviderError
    | CrumbsContractError
    | InvalidSignatureError
    | UnsupportedLanguageError
  > {
    return this.core.getDataWalletForAccount(
      accountAddress,
      signature,
      languageCode,
      chain,
    );
  }

  public getAccounts(): ResultAsync<LinkedAccount[], PersistenceError> {
    return this.core.getAccounts();
  }
  public isDataWalletAddressInitialized() {
    return this.core.isDataWalletAddressInitialized();
  }
  public getAccountBalances() {
    return this.core.getAccountBalances();
  }
  public getAccountNFTs() {
    return this.core.getAccountNFTs();
  }
  public checkInvitationStatus(
    consentAddress: EVMContractAddress,
    signature?: Signature,
    tokenId?: BigNumberString,
  ): ResultAsync<EInvitationStatus, Error> {
    const invitation = new Invitation(
      '' as DomainName,
      consentAddress,
      TokenId(BigInt(281474976710655)),
      signature ?? null,
    );
    return this.core.checkInvitationStatus(invitation);
  }
  public getConsentContractCID(consentAddress: EVMContractAddress) {
    return this.core.getConsentContractCID(consentAddress);
  }
  public getInvitationMetadataByCID(ipfsCID: IpfsCID) {
    return this.core.getInvitationMetadataByCID(ipfsCID);
  }
  public getUnlockMessage(): ResultAsync<string, UnsupportedLanguageError> {
    return this.core.getUnlockMessage('en' as LanguageCode);
  }

  public acceptInvitation(
    invitation: Invitation,
    dataPermissions: DataPermissions | null,
  ) {
    return this.core.acceptInvitation(invitation, dataPermissions);
  }
}
