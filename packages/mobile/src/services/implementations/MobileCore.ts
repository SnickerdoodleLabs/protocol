import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AccountAddress,
  AdSignatureMigrator,
  ChainId,
  ChainTransactionMigrator,
  ClickDataMigrator,
  CountryCode,
  DataWalletAddress,
  DataPermissions,
  DomainCredentialMigrator,
  DomainName,
  EarnedRewardMigrator,
  EBackupPriority,
  EChain,
  EligibleAdMigrator,
  EmailAddressString,
  ERecordKey,
  EVMContractAddress,
  EWalletDataType,
  FamilyName,
  Gender,
  GivenName,
  HexString32,
  Invitation,
  IpfsCID,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  LanguageCode,
  LatestBlockMigrator,
  LinkedAccountMigrator,
  QueryStatusMigrator,
  ReceivingAccountMigrator,
  RestoredBackupMigrator,
  Signature,
  SiteVisitMigrator,
  SocialGroupProfileMigrator,
  SocialProfileMigrator,
  TokenAddress,
  TokenInfoMigrator,
  UnixTimestamp,
  VersionedObject,
} from "@snickerdoodlelabs/objects";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
  MemoryVolatileStorage,
  NullCloudStorage,
  VolatileTableIndex,
} from "@snickerdoodlelabs/persistence";
import { Container, inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IAccountServiceType,
  IAccountService,
} from "../interfaces/business/IAccountService";
import {
  IInvitationServiceType,
  IInvitationService,
} from "../interfaces/business/IInvitationService";
import {
  IPIIServiceType,
  IPIIService,
} from "../interfaces/business/IPIIService";
import {
  ITokenPriceServiceType,
  ITokenPriceService,
} from "../interfaces/business/ITokenPriceService";
import {
  IAccountStorageRepository,
  IAccountStorageRepositoryType,
} from "../interfaces/data/IAccountStorageRepository";
import {
  IDataPermissionsRepository,
  IDataPermissionsRepositoryType,
} from "../interfaces/data/IDataPermissionsRepository";
import { coreConfig } from "../interfaces/objects/Config";

import { mobileCoreModule } from "./MobileCore.module";
import { MobileStorageUtils } from "./utils/MobileStorageUtils";
import {
  IConfigProvider,
  IConfigProviderType,
} from "@snickerdoodlelabs/core/dist/interfaces/utilities";

export class MobileCore {
  protected iocContainer: Container;
  protected core: ISnickerdoodleCore;

  public invitationService: IInvitationService;
  public accountService: IAccountService;
  public tokenPriceService: ITokenPriceService;
  public piiService: IPIIService;
  public accountStorage: IAccountStorageRepository;
  public dataPermissionUtils: IDataPermissionsRepository;
  constructor() {
    this.iocContainer = new Container();
    this.iocContainer.load(...[mobileCoreModule]);

    const provider = new Map<ERecordKey, VolatileTableIndex<VersionedObject>>([
      [
        ERecordKey.ACCOUNT,
        new VolatileTableIndex(
          ERecordKey.ACCOUNT,
          "sourceAccountAddress",
          false,
          new LinkedAccountMigrator(),
          EBackupPriority.HIGH,
          160000,
          0, // auto push
          [["sourceChain", false]],
        ),
      ],
      [
        ERecordKey.TRANSACTIONS,
        new VolatileTableIndex(
          ERecordKey.TRANSACTIONS,
          "hash",
          false,
          new ChainTransactionMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [
            ["timestamp", false],
            ["chainId", false],
            ["value", false],
            ["to", false],
            ["from", false],
          ],
        ),
      ],
      [
        ERecordKey.SITE_VISITS,
        new VolatileTableIndex(
          ERecordKey.SITE_VISITS,
          VolatileTableIndex.DEFAULT_KEY,
          true,
          new SiteVisitMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [
            ["url", false],
            ["startTime", false],
            ["endTime", false],
          ],
        ),
      ],
      [
        ERecordKey.CLICKS,
        new VolatileTableIndex(
          ERecordKey.CLICKS,
          VolatileTableIndex.DEFAULT_KEY,
          true,
          new ClickDataMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [
            ["url", false],
            ["timestamp", false],
            ["element", false],
          ],
        ),
      ],
      [
        ERecordKey.LATEST_BLOCK,
        new VolatileTableIndex(
          ERecordKey.LATEST_BLOCK,
          "contract",
          false,
          new LatestBlockMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
        ),
      ],
      [
        ERecordKey.EARNED_REWARDS,
        new VolatileTableIndex(
          ERecordKey.EARNED_REWARDS,
          ["queryCID", "name", "contractAddress", "chainId"],
          false,
          new EarnedRewardMigrator(),
          EBackupPriority.NORMAL,
          0, // instant push
          160000,
          [["type", false]],
        ),
      ],
      [
        ERecordKey.ELIGIBLE_ADS,
        new VolatileTableIndex(
          ERecordKey.ELIGIBLE_ADS,
          ["queryCID", "key"],
          false,
          new EligibleAdMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [["type", false]],
        ),
      ],
      [
        ERecordKey.AD_SIGNATURES,
        new VolatileTableIndex(
          ERecordKey.AD_SIGNATURES,
          ["queryCID", "adKey"],
          false,
          new AdSignatureMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [["type", false]],
        ),
      ],
      [
        ERecordKey.COIN_INFO,
        new VolatileTableIndex(
          ERecordKey.COIN_INFO,
          ["chain", "address"],
          false,
          new TokenInfoMigrator(),
          EBackupPriority.DISABLED,
          160000,
          200000,
          undefined,
        ),
      ],
      [
        ERecordKey.RESTORED_BACKUPS,
        new VolatileTableIndex(
          ERecordKey.RESTORED_BACKUPS,
          VolatileTableIndex.DEFAULT_KEY,
          false,
          new RestoredBackupMigrator(),
          EBackupPriority.DISABLED,
          160000,
          200000,
          undefined,
        ),
      ],
      [
        ERecordKey.RECEIVING_ADDRESSES,
        new VolatileTableIndex(
          ERecordKey.RECEIVING_ADDRESSES,
          "contractAddress",
          false,
          new ReceivingAccountMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
        ),
      ],
      [
        ERecordKey.QUERY_STATUS,
        new VolatileTableIndex(
          ERecordKey.QUERY_STATUS,
          "queryCID",
          false,
          new QueryStatusMigrator(),
          EBackupPriority.HIGH,
          160000,
          200000,
        ),
      ],
      [
        ERecordKey.DOMAIN_CREDENTIALS,
        new VolatileTableIndex(
          ERecordKey.DOMAIN_CREDENTIALS,
          "domain",
          false,
          new DomainCredentialMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
        ),
      ],
      [
        ERecordKey.SOCIAL_PROFILE,
        new VolatileTableIndex(
          ERecordKey.SOCIAL_PROFILE,
          "pKey",
          false,
          new SocialProfileMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [["type", false]],
        ),
      ],
      [
        ERecordKey.SOCIAL_GROUP,
        new VolatileTableIndex(
          ERecordKey.SOCIAL_GROUP,
          "pKey",
          false,
          new SocialGroupProfileMigrator(),
          EBackupPriority.NORMAL,
          160000,
          200000,
          [
            ["type", false],
            ["ownerId", false],
          ],
        ),
      ],
    ]);

    this.core = new SnickerdoodleCore(
      coreConfig,
      new MobileStorageUtils(),
      new MemoryVolatileStorage("SD_Wallet", Array.from(provider.values())),
      undefined,
    );

    console.log("thhis", this.core);

    this.iocContainer.bind(ISnickerdoodleCoreType).toConstantValue(this.core);
    this.dataPermissionUtils = {
      defaultFlags: this.iocContainer.get<IDataPermissionsRepository>(
        IDataPermissionsRepositoryType,
      ).defaultFlags,
      applyDefaultPermissionsOption:
        this.iocContainer.get<IDataPermissionsRepository>(
          IDataPermissionsRepositoryType,
        ).applyDefaultPermissionsOption,
      DefaultDataPermissions: this.iocContainer.get<IDataPermissionsRepository>(
        IDataPermissionsRepositoryType,
      ).DefaultDataPermissions,

      getPermissions: () => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.getPermissions();
      },
      setPermissions: (walletDataTypes: EWalletDataType[]) => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        _dataPermissionUtils.setPermissions(walletDataTypes);
      },
      setApplyDefaultPermissionsOption: (option: boolean) => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.setApplyDefaultPermissionsOption(option);
      },
      setDefaultFlagsWithDataTypes: (dataTypes: EWalletDataType[]) => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.setDefaultFlagsWithDataTypes(dataTypes);
      },
      setDefaultFlagsToAll: () => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.setDefaultFlagsToAll();
      },
      generateDataPermissionsClassWithDataTypes: (
        dataTypes: EWalletDataType[],
      ) => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.generateDataPermissionsClassWithDataTypes(
          dataTypes,
        );
      },
      getDataTypesFromFlagsString: (flags: HexString32) => {
        const _dataPermissionUtils =
          this.iocContainer.get<IDataPermissionsRepository>(
            IDataPermissionsRepositoryType,
          );
        return _dataPermissionUtils.getDataTypesFromFlagsString(flags);
      },
    };

    this.invitationService = {
      checkInvitationStatus: (invitation: Invitation) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.checkInvitationStatus(invitation);
      },
      acceptInvitation: (
        invitation: Invitation,
        dataTypes: DataPermissions | null,
      ) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.acceptInvitation(invitation, dataTypes);
      },
      rejectInvitation: (invitation: Invitation) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.rejectInvitation(invitation);
      },
      leaveCohort: (consentContractAddress: EVMContractAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.leaveCohort(consentContractAddress);
      },

      getAcceptedInvitationsCID: () => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getAcceptedInvitationsCID();
      },
      getInvitationMetadataByCID: (ipfsCID: IpfsCID) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getInvitationMetadataByCID(ipfsCID);
      },
      getAvailableInvitationsCID: () => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getAvailableInvitationsCID();
      },

      getConsentContractCID: (consentAddress: EVMContractAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getConsentContractCID(consentAddress);
      },
      getReceivingAddress: (contractAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getReceivingAddress(contractAddress);
      },
      getAgreementFlags: (contractAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getAgreementFlags(contractAddress);
      },
      getConsentCapacity: (contractAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getConsentCapacity(contractAddress);
      },
      getInvitationsByDomain: (domain) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.getInvitationsByDomain(domain);
      },
      setReceivingAddress: (contractAddress, receivingAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.setReceivingAddress(
          contractAddress,
          receivingAddress,
        );
      },
      setDefaultReceivingAddress: (receivingAddress) => {
        const _invitationService = this.iocContainer.get<IInvitationService>(
          IInvitationServiceType,
        );
        return _invitationService.setDefaultReceivingAddress(receivingAddress);
      },
    };

    this.accountService = {
      addAccount: (
        account: AccountAddress,
        signature: Signature,
        chain: EChain,
        languageCode: LanguageCode,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.addAccount(
          account,
          signature,
          chain,
          languageCode,
        );
      },
      unlock: (
        account: AccountAddress,
        signature: Signature,
        chain: EChain,
        languageCode: LanguageCode,
        calledWithCookie?: boolean,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.unlock(
          account,
          signature,
          chain,
          languageCode,
          calledWithCookie,
        );
      },
      getUnlockMessage: (languageCode: LanguageCode) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getUnlockMessage(languageCode);
      },
      getAccounts: () => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getAccounts();
      },
      getAccountBalances: () => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getAccountBalances();
      },
      getAccountNFTs: () => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getAccountNFTs();
      },
      isDataWalletAddressInitialized: () => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.isDataWalletAddressInitialized();
      },
      unlinkAccount: (
        account: AccountAddress,
        signature: Signature,
        chain: EChain,
        languageCode: LanguageCode,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.unlinkAccount(
          account,
          signature,
          chain,
          languageCode,
        );
      },
      getDataWalletForAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getDataWalletForAccount(
          accountAddress,
          signature,
          languageCode,
          chain,
        );
      },
      getEarnedRewards: () => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getEarnedRewards();
      },
    };

    this.tokenPriceService = {
      getTokenPrice: (
        chainId: ChainId,
        address: TokenAddress | null,
        timestamp?: UnixTimestamp,
      ) => {
        const _tokenPriceService = this.iocContainer.get<ITokenPriceService>(
          ITokenPriceServiceType,
        );
        return _tokenPriceService.getTokenPrice(chainId, address, timestamp);
      },
      getTokenMarketData: (ids: string[]) => {
        const _tokenPriceService = this.iocContainer.get<ITokenPriceService>(
          ITokenPriceServiceType,
        );
        return _tokenPriceService.getTokenMarketData(ids);
      },
      getTokenInfo: (
        chainId: ChainId,
        contractAddress: TokenAddress | null,
      ) => {
        const _tokenPriceService = this.iocContainer.get<ITokenPriceService>(
          ITokenPriceServiceType,
        );
        return _tokenPriceService.getTokenInfo(chainId, contractAddress);
      },
    };

    this.piiService = {
      getAge: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getAge();
      },
      setGivenName: (name: GivenName) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setGivenName(name);
      },
      getGivenName: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getGivenName();
      },
      setFamilyName: (name: FamilyName) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setFamilyName(name);
      },
      getFamilyName: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getFamilyName();
      },
      setBirthday: (birthday: UnixTimestamp) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setBirthday(birthday);
      },
      getBirthday: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getBirthday();
      },
      setGender: (gender: Gender) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setGender(gender);
      },
      getGender: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getGender();
      },
      setEmail: (email: EmailAddressString) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setEmail(email);
      },
      getEmail: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getEmail();
      },
      setLocation: (location: CountryCode) => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.setLocation(location);
      },
      getLocation: () => {
        const _piiService = this.iocContainer.get<IPIIService>(IPIIServiceType);
        return _piiService.getLocation();
      },
    };
    this.accountStorage = {
      writeAccountInfoToStorage: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
      ) => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.writeAccountInfoToStorage(
          accountAddress,
          signature,
          languageCode,
          chain,
        );
      },
      readAccountInfoStorage: () => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.readAccountInfoStorage();
      },
      removeAccountInfoStorage: (accountAddress: AccountAddress) => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.removeAccountInfoStorage(accountAddress);
      },
      writeDataWalletAddressToStorage: (
        dataWalletAddress: DataWalletAddress,
      ) => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.writeDataWalletAddressToStorage(
          dataWalletAddress,
        );
      },
      readDataWalletAddressFromstorage: () => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.readDataWalletAddressFromstorage();
      },
      removeDataWalletAddressFromstorage: () => {
        const _accountStorage =
          this.iocContainer.get<IAccountStorageRepository>(
            IAccountStorageRepositoryType,
          );
        return _accountStorage.removeDataWalletAddressFromstorage();
      },
    };
  }

  public getCore() {
    return this.core;
  }
  public getCyrptoUtils() {
    return this.iocContainer.get<ICryptoUtils>(ICryptoUtilsType);
  }
  public getEvents(): ResultAsync<ISnickerdoodleCoreEvents, never> {
    return this.core.getEvents();
  }
}
