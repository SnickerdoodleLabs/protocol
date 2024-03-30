import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  AccountAddress,
  ChainId,
  CountryCode,
  DataWalletAddress,
  DomainName,
  EChain,
  EmailAddressString,
  EWalletDataType,
  FamilyName,
  Gender,
  GivenName,
  HexString32,
  ISnickerdoodleCore,
  ISnickerdoodleCoreEvents,
  ISnickerdoodleCoreType,
  LanguageCode,
  LinkedAccount,
  Signature,
  TokenAddress,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { Container } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IAccountServiceType,
  IAccountService,
} from "../interfaces/business/IAccountService";
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
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";

export class MobileCore {
  protected iocContainer: Container;
  protected core: ISnickerdoodleCore;

  public accountService: IAccountService;
  public tokenPriceService: ITokenPriceService;
  public piiService: IPIIService;
  public accountStorage: IAccountStorageRepository;
  public dataPermissionUtils: IDataPermissionsRepository;
  constructor() {
    this.iocContainer = new Container();
    this.iocContainer.load(...[mobileCoreModule]);

    this.core = new SnickerdoodleCore(
      coreConfig,
      new MobileStorageUtils(),
      undefined,
    );

    // TODO: This is horrible, don't do this
    this.core.initialize().mapErr((e) => {
      console.error(e);
    });

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

    this.accountService = {
      addAccount: (
        accountAddress: AccountAddress,
        signature: Signature,
        languageCode: LanguageCode,
        chain: EChain,
        sourceDomain: DomainName | undefined,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.addAccount(
          accountAddress,
          signature,
          languageCode,
          chain,
          sourceDomain,
        );
      },
      getLinkAccountMessage: (
        languageCode: LanguageCode,
        sourceDomain: DomainName | undefined,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getLinkAccountMessage(
          languageCode,
          sourceDomain,
        );
      },
      getAccounts: (sourceDomain: DomainName | undefined) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getAccounts(sourceDomain);
      },
      getAccountBalances: (sourceDomain: DomainName | undefined) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getAccountBalances(sourceDomain);
      },
      getNfts: (
        benchmark: UnixTimestamp | undefined,
        chains: EChain[] | undefined,
        accounts: LinkedAccount[] | undefined,
        sourceDomain: DomainName | undefined,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getNfts(
          benchmark,
          chains,
          accounts,
          sourceDomain,
        );
      },
      isDataWalletAddressInitialized: (
        sourceDomain: DomainName | undefined,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.isDataWalletAddressInitialized(sourceDomain);
      },
      unlinkAccount: (
        account: AccountAddress,
        chain: EChain,
        sourceDomain: DomainName | undefined,
      ) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.unlinkAccount(account, chain, sourceDomain);
      },

      getEarnedRewards: (sourceDomain: DomainName | undefined) => {
        const _accountService =
          this.iocContainer.get<IAccountService>(IAccountServiceType);
        return _accountService.getEarnedRewards(sourceDomain);
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
