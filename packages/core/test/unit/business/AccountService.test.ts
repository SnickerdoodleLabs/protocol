import "reflect-metadata";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  AESEncryptedString,
  AESKey,
  BigNumberString,
  ComponentStatus,
  DataWalletBackupID,
  EChain,
  EComponentStatus,
  EncryptedString,
  EVMAccountAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  HexString,
  InitializationVector,
  ITokenPriceRepository,
  LanguageCode,
  LinkedAccount,
  PasswordString,
  PublicEvents,
  Signature,
  SolanaAccountAddress,
  TokenId,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { AccountService } from "@core/implementations/business/index.js";
import { IAccountService } from "@core/interfaces/business/index.js";
import { IPermissionUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IAuthenticatedStorageRepository,
  IBrowsingDataRepository,
  IDataWalletPersistence,
  IEntropyRepository,
  ILinkedAccountRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import { CoreContext, PrivateEvents } from "@core/interfaces/objects/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import { PermissionsUtilsMock } from "@core-tests/mock/business/utilities/index.js";
import {
  dataWalletAddress,
  dataWalletKey,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const evmAccountAddress = EVMAccountAddress("evmAccountAddress");
const solanaAccountAddress = SolanaAccountAddress("solanaAccountAddress");
const evmSignature = Signature("evmSignature");
const solanaSignature = Signature("solanaSignature");
const externalSignature = Signature("externalSignature");

const evmDerivedPrivateKey = EVMPrivateKey("evmDerivedPrivateKey");
const solanaDerivedPrivateKey = EVMPrivateKey("solanaDerivedPrivateKey");
const passwordDerivedPrivateKey = EVMPrivateKey("passwordDerivedPrivateKey");

const evmDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress1"),
  evmDerivedPrivateKey,
);
const solanaDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress2"),
  solanaDerivedPrivateKey,
);
const passwordDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress3"),
  passwordDerivedPrivateKey,
);
const evmChain = EChain.DevDoodle;
const solanaChain = EChain.Solana;
const languageCode = LanguageCode("en");
const unlockMessage = "Login to your Snickerdoodle data wallet"; // Needs to match result of getLinkAccountMessage(en)
const externalMessage = "Signed message from some other stupid DApp";

const evmDerivedEncryptionKey = AESKey("evmDerivedEncryptionKey");
const solanaDerivedEncryptionKey = AESKey("solanaDerivedEncryptionKey");
const passwordDerivedEncryptionKey = AESKey("passwordDerivedEncryptionKey");

const dataWalletBackupID = DataWalletBackupID("dataWalletBackup");

const testPassword = PasswordString("BatteryHorseStaple");

class AccountServiceMocks {
  public authenticatedStorageRepo: IAuthenticatedStorageRepository;
  public entropyRepo: IEntropyRepository;
  public permissionsUtils: IPermissionUtils;
  public dataWalletPersistence: IDataWalletPersistence;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public dataWalletUtils: IDataWalletUtils;
  public logUtils: ILogUtils;
  public accountRepo: ILinkedAccountRepository;
  public tokenPriceRepo: ITokenPriceRepository;
  public transactionRepo: ITransactionHistoryRepository;
  public balanceRepo: IPortfolioBalanceRepository;
  public browsingDataRepo: IBrowsingDataRepository;

  public constructor(initializeInProgress = false, unlocked = false) {
    this.authenticatedStorageRepo =
      td.object<IAuthenticatedStorageRepository>();
    this.entropyRepo = td.object<IEntropyRepository>();
    this.permissionsUtils = new PermissionsUtilsMock();
    this.dataWalletPersistence = td.object<IDataWalletPersistence>();
    this.accountRepo = td.object<ILinkedAccountRepository>();
    this.tokenPriceRepo = td.object<ITokenPriceRepository>();
    this.transactionRepo = td.object<ITransactionHistoryRepository>();
    this.balanceRepo = td.object<IPortfolioBalanceRepository>();
    this.browsingDataRepo = td.object<IBrowsingDataRepository>();

    // Setup the context an locked, none in progress
    this.contextProvider = new ContextProviderMock(
      new CoreContext(
        unlocked ? dataWalletAddress : null,
        unlocked ? dataWalletKey : null,
        initializeInProgress,
        new PublicEvents(), // publicEvents
        new PrivateEvents(), // privateEvents
        false, // restoreInProgress
        UnixTimestamp(0), // startTime,
        new ComponentStatus(
          EComponentStatus.TemporarilyDisabled,
          EComponentStatus.TemporarilyDisabled,
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
          new Map<EChain, EComponentStatus>(),
        ), // components
      ),
    );

    this.configProvider = new ConfigProviderMock();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.logUtils = td.object<ILogUtils>();

    // EntropyRepository --------------------------------------------------

    // DataWalletUtils --------------------------------------------------
    // EVM and Solana signatures verify by default
    td.when(
      this.dataWalletUtils.verifySignature(
        evmChain,
        evmAccountAddress,
        evmSignature,
        unlockMessage,
      ),
    ).thenReturn(okAsync(true));
    td.when(
      this.dataWalletUtils.verifySignature(
        solanaChain,
        solanaAccountAddress,
        solanaSignature,
        unlockMessage,
      ),
    ).thenReturn(okAsync(true));
    td.when(
      this.dataWalletUtils.verifySignature(
        evmChain,
        evmAccountAddress,
        externalSignature,
        externalMessage,
      ),
    ).thenReturn(okAsync(true));

    // Derived account 1 is for EVM, 2 for Solana
    td.when(
      this.dataWalletUtils.getDerivedEVMAccountFromSignature(
        evmAccountAddress,
        evmSignature,
      ),
    ).thenReturn(okAsync(evmDerivedEVMAccount));
    td.when(
      this.dataWalletUtils.getDerivedEVMAccountFromSignature(
        solanaAccountAddress,
        solanaSignature,
      ),
    ).thenReturn(okAsync(solanaDerivedEVMAccount));
    td.when(
      this.dataWalletUtils.getDerivedEVMAccountFromPassword(testPassword),
    ).thenReturn(okAsync(passwordDerivedEVMAccount));
    td.when(
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(
        evmAccountAddress,
        evmSignature,
      ),
    ).thenReturn(okAsync(evmDerivedEncryptionKey));
    td.when(
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(
        solanaAccountAddress,
        solanaSignature,
      ),
    ).thenReturn(okAsync(solanaDerivedEncryptionKey));
    td.when(
      this.dataWalletUtils.deriveEncryptionKeyFromPassword(testPassword),
    ).thenReturn(okAsync(passwordDerivedEncryptionKey));
    td.when(this.dataWalletUtils.createDataWalletKey()).thenReturn(
      okAsync(dataWalletKey),
    );

    // AccountRepository --------------------------------------------------
    td.when(
      this.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: evmChain,
          sourceAccountAddress: evmAccountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: solanaChain,
          sourceAccountAddress: solanaAccountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(this.accountRepo.getAccounts()).thenReturn(
      okAsync([
        new LinkedAccount(evmChain, evmAccountAddress),
        new LinkedAccount(solanaChain, solanaAccountAddress),
      ]),
    );
    td.when(
      this.accountRepo.getLinkedAccount(evmAccountAddress, evmChain),
    ).thenReturn(okAsync(null));
    td.when(this.accountRepo.removeAccount(evmAccountAddress)).thenReturn(
      okAsync(undefined),
    );
    td.when(this.accountRepo.removeAccount(solanaAccountAddress)).thenReturn(
      okAsync(undefined),
    );

    // Data Wallet Persistence --------------------------------------------------
    td.when(this.dataWalletPersistence.postBackups()).thenReturn(
      okAsync([dataWalletBackupID]),
    );
  }

  public factory(): IAccountService {
    return new AccountService(
      this.authenticatedStorageRepo,
      this.entropyRepo,
      this.permissionsUtils,
      this.contextProvider,
      this.configProvider,
      this.dataWalletUtils,
      this.logUtils,
      this.dataWalletPersistence,
      this.tokenPriceRepo,
      this.accountRepo,
      this.transactionRepo,
      this.browsingDataRepo,
      this.balanceRepo,
    );
  }
}

describe("AccountService addAccount() tests", () => {
  test("addAccount() with EVM based account works with no existing linked account", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    const service = mocks.factory();

    // Act
    const result = await service.addAccount(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onAccountAdded: 1,
      postBackupsRequested: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccountWithExternalSignature() with EVM based account works with no existing linked account", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    const service = mocks.factory();

    // Act
    const result = await service.addAccountWithExternalSignature(
      evmAccountAddress,
      externalMessage,
      externalSignature,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onAccountAdded: 1,
      postBackupsRequested: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  //   test("addAccount() with Solana based account works with no existing crumb", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         solanaDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       solanaAccountAddress,
  //       solanaSignature,
  //       languageCode,
  //       solanaChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onAccountAdded: 1,
  //     });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() with EVM based account works with an existing crumb", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onAccountAdded: 1,
  //     });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails with an invalid signature", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     td.when(
  //       mocks.dataWalletUtils.verifySignature(
  //         evmChain,
  //         evmAccountAddress,
  //         evmSignature,
  //         unlockMessage,
  //       ),
  //     ).thenReturn(okAsync(false));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(InvalidSignatureError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails if the wallet is not already unlocked", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, false);

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(UninitializedError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails if we can't check for the crumb", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(
  //       errAsync(
  //         new BlockchainProviderError(
  //           ChainId(evmChain),
  //           `BlockchainProviderError`,
  //         ),
  //       ),
  //     );

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(BlockchainProviderError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails when we can't encode the crumbs data", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     td.when(
  //       mocks.crumbsRepo.encodeCreateCrumb(languageCode, evmEncryptedDataWallet),
  //     ).thenReturn(
  //       errAsync(
  //         new BlockchainProviderError(
  //           ChainId(evmChain),
  //           `BlockchainProviderError`,
  //         ),
  //       ),
  //     );

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(BlockchainProviderError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails when we can't get a nonce from the minimal forwarder", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     td.when(
  //       mocks.metatransactionForwarderRepo.getNonce(
  //         evmDerivedEVMAccount.accountAddress,
  //       ),
  //     ).thenReturn(errAsync(new MinimalForwarderContractError()));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(MinimalForwarderContractError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails when we can't execute the metatransaction on the insight platform", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     td.when(
  //       mocks.insightPlatformRepo.executeMetatransaction(
  //         evmDerivedEVMAccount.accountAddress,
  //         controlChainInformation.crumbsContractAddress,
  //         evmDerivedNonce,
  //         metatransactionValue,
  //         metatransactionGas,
  //         evmEncodedCreateCrumbContent,
  //         evmAddCrumbMetatransactionSignature,
  //         evmDerivedPrivateKey,
  //         defaultInsightPlatformBaseUrl,
  //       ),
  //     ).thenReturn(errAsync(new AjaxError("Error", 500)));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(AjaxError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("addAccount() fails when we can't add an account", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     td.when(
  //       mocks.accountRepo.addAccount(
  //         td.matchers.contains({
  //           sourceChain: evmChain,
  //           sourceAccountAddress: evmAccountAddress,
  //           derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
  //         }),
  //       ),
  //     ).thenReturn(errAsync(new PersistenceError(`PersistenceError`)));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.addAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeTruthy();
  //     const err = result._unsafeUnwrapErr();
  //     expect(err).toBeInstanceOf(PersistenceError);

  //     mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });
  // });

  // describe("AccountService unlinkAccount() tests", () => {
  //   test("unlinkAccount() with EVM based account works", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.unlinkAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onAccountRemoved: 1,
  //     });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });

  //   test("unlinkAccount() with Solana based account works", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks(false, true);

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.unlinkAccount(
  //       solanaAccountAddress,
  //       solanaSignature,
  //       languageCode,
  //       solanaChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onAccountRemoved: 1,
  //     });
  //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
  //   });
  // });

  // describe("AccountService getDataWalletForAccount() tests", () => {
  //   test("getDataWalletForAccount() with EVM based account works with no existing crumb", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks();

  //     // No existing crumb
  //     td.when(
  //       mocks.crumbsRepo.getCrumb(
  //         evmDerivedEVMAccount.accountAddress,
  //         languageCode,
  //       ),
  //     ).thenReturn(okAsync(null));

  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.getDataWalletForAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onInitialized: 0,
  //       onAccountAdded: 0,
  //     });

  //     const dataWalletAddress = result._unsafeUnwrap();
  //     expect(dataWalletAddress).toBeNull();
  //   });

  //   test("getDataWalletForAccount() with EVM based account works with an existing crumb", async () => {
  //     // Arrange
  //     const mocks = new AccountServiceMocks();
  //     const service = mocks.factory();

  //     // Act
  //     const result = await service.getDataWalletForAccount(
  //       evmAccountAddress,
  //       evmSignature,
  //       languageCode,
  //       evmChain,
  //     );

  //     // Assert
  //     expect(result).toBeDefined();
  //     expect(result.isErr()).toBeFalsy();

  //     mocks.contextProvider.assertEventCounts({
  //       onInitialized: 0,
  //       onAccountAdded: 0,
  //     });

  //     const dataWalletAddress = result._unsafeUnwrap();
  //     expect(dataWalletAddress).toBe(dataWalletAddress);
  //   });
});
