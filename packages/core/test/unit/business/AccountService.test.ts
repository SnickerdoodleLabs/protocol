// import "reflect-metadata";
// import { ICryptoUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
// import {
//   ICrumbsContract,
//   IMinimalForwarderContract,
// } from "@snickerdoodlelabs/contracts-sdk";
// import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
// import {
//   AESEncryptedString,
//   AESKey,
//   AjaxError,
//   BigNumberString,
//   BlockchainProviderError,
//   ChainId,
//   ComponentStatus,
//   DataWalletBackupID,
//   EChain,
//   EComponentStatus,
//   EncryptedString,
//   EVMAccountAddress,
//   EVMPrivateKey,
//   ExternallyOwnedAccount,
//   HexString,
//   ICrumbContent,
//   InitializationVector,
//   InvalidSignatureError,
//   ITokenPriceRepository,
//   LanguageCode,
//   LinkedAccount,
//   MinimalForwarderContractError,
//   PasswordString,
//   PersistenceError,
//   PublicEvents,
//   Signature,
//   SolanaAccountAddress,
//   TokenId,
//   TokenUri,
//   UninitializedError,
//   UnixTimestamp,
// } from "@snickerdoodlelabs/objects";
// import { errAsync, okAsync } from "neverthrow";
// import { Subject } from "rxjs";
// import * as td from "testdouble";

// import { AccountService } from "@core/implementations/business/index.js";
// import { IAccountService } from "@core/interfaces/business/index.js";
// import { IPermissionUtils } from "@core/interfaces/business/utilities/index.js";
// import {
//   IBrowsingDataRepository,
//   IDataWalletPersistence,
//   IEntropyRepository,
//   ILinkedAccountRepository,
//   IMetatransactionForwarderRepository,
//   IPortfolioBalanceRepository,
//   ITransactionHistoryRepository,
// } from "@core/interfaces/data/index.js";
// import {
//   CoreContext,
//   CrumbCallData,
//   PrivateEvents,
// } from "@core/interfaces/objects/index.js";
// import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
// import { PermissionsUtilsMock } from "@core-tests/mock/business/utilities/index.js";
// import {
//   controlChainInformation,
//   dataWalletAddress,
//   dataWalletKey,
//   defaultInsightPlatformBaseUrl,
//   testCoreConfig,
// } from "@core-tests/mock/mocks/index.js";
// import {
//   ConfigProviderMock,
//   ContextProviderMock,
// } from "@core-tests/mock/utilities/index.js";

// const metatransactionValue = BigNumberString("0");
// const metatransactionGas = BigNumberString("10000000");
// const tokenId1 = TokenId(BigInt(13));
// const tokenId2 = TokenId(BigInt(69));
// const tokenId3 = TokenId(BigInt(42));
// const evmDerivedNonce = BigNumberString("27");
// const solanaDerivedNonce = BigNumberString("28");
// const passwordDerivedNonce = BigNumberString("29");

// const evmAccountAddress = EVMAccountAddress("evmAccountAddress");
// const solanaAccountAddress = SolanaAccountAddress("solanaAccountAddress");
// const evmSignature = Signature("evmSignature");
// const solanaSignature = Signature("solanaSignature");

// const evmDerivedPrivateKey = EVMPrivateKey("evmDerivedPrivateKey");
// const solanaDerivedPrivateKey = EVMPrivateKey("solanaDerivedPrivateKey");
// const passwordDerivedPrivateKey = EVMPrivateKey("passwordDerivedPrivateKey");

// const evmDerivedEVMAccount = new ExternallyOwnedAccount(
//   EVMAccountAddress("derivedEVMAccountAddress1"),
//   evmDerivedPrivateKey,
// );
// const solanaDerivedEVMAccount = new ExternallyOwnedAccount(
//   EVMAccountAddress("derivedEVMAccountAddress2"),
//   solanaDerivedPrivateKey,
// );
// const passwordDerivedEVMAccount = new ExternallyOwnedAccount(
//   EVMAccountAddress("derivedEVMAccountAddress3"),
//   passwordDerivedPrivateKey,
// );
// const evmChain = EChain.DevDoodle;
// const solanaChain = EChain.Solana;
// const languageCode = LanguageCode("en");
// const unlockMessage = "Login to your Snickerdoodle data wallet"; // Needs to match result of getLinkAccountMessage(en)
// const evmEncryptedDataWallet = new AESEncryptedString(
//   EncryptedString("evmEncryptedDataWalletData"),
//   InitializationVector("evmEncryptedDataWalletIV"),
// );
// const solanaEncryptedDataWallet = new AESEncryptedString(
//   EncryptedString("solanaEncryptedDataWalletData"),
//   InitializationVector("solanaEncryptedDataWalletIV"),
// );
// const passwordEncryptedDataWallet = new AESEncryptedString(
//   EncryptedString("passwordEncryptedDataWalletData"),
//   InitializationVector("passwordEncryptedDataWalletIV"),
// );

// const evmDerivedEncryptionKey = AESKey("evmDerivedEncryptionKey");
// const solanaDerivedEncryptionKey = AESKey("solanaDerivedEncryptionKey");
// const passwordDerivedEncryptionKey = AESKey("passwordDerivedEncryptionKey");

// const evmEncodedCreateCrumbContent = HexString("evmEncodedCreateCrumbContent");
// const solanaEncodedCreateCrumbContent = HexString(
//   "solanaEncodedCreateCrumbContent",
// );
// const passwordEncodedCreateCrumbContent = HexString(
//   "passwordEncodedCreateCrumbContent",
// );
// const evmEncodedBurnCrumbContent = HexString("evmEncodedBurnCrumbContent");
// const solanaEncodedBurnCrumbContent = HexString(
//   "solanaEncodedBurnCrumbContent",
// );
// const passwordEncodedBurnCrumbContent = HexString(
//   "passwordEncodedBurnCrumbContent",
// );

// const evmAddCrumbMetatransactionSignature = Signature(
//   "evmAddCrumbMetatransactionSignature",
// );
// const solanaAddCrumbMetatransactionSignature = Signature(
//   "solanaAddCrumbMetatransactionSignature",
// );
// const passwordAddCrumbMetatransactionSignature = Signature(
//   "passwordAddCrumbMetatransactionSignature",
// );
// const evmBurnCrumbMetatransactionSignature = Signature(
//   "evmBurnCrumbMetatransactionSignature",
// );
// const solanaBurnCrumbMetatransactionSignature = Signature(
//   "solanaBurnCrumbMetatransactionSignature",
// );
// const passwordBurnCrumbMetatransactionSignature = Signature(
//   "passwordBurnCrumbMetatransactionSignature",
// );

// const dataWalletBackupID = DataWalletBackupID("dataWalletBackup");

// const testPassword = PasswordString("BatteryHorseStaple");

// class AccountServiceMocks {
//   public entropyRepo: IEntropyRepository;
//   public permissionsUtils: IPermissionUtils;
//   public dataWalletPersistence: IDataWalletPersistence;
//   public contextProvider: ContextProviderMock;
//   public configProvider: ConfigProviderMock;
//   public dataWalletUtils: IDataWalletUtils;
//   public logUtils: ILogUtils;
//   public accountRepo: ILinkedAccountRepository;
//   public tokenPriceRepo: ITokenPriceRepository;
//   public transactionRepo: ITransactionHistoryRepository;
//   public balanceRepo: IPortfolioBalanceRepository;
//   public browsingDataRepo: IBrowsingDataRepository;

//   public minimalForwarderContract: IMinimalForwarderContract;

//   public constructor(initializeInProgress = false, unlocked = false) {
//     this.entropyRepo = td.object<IEntropyRepository>();
//     this.permissionsUtils = new PermissionsUtilsMock();
//     this.dataWalletPersistence = td.object<IDataWalletPersistence>();
//     this.accountRepo = td.object<ILinkedAccountRepository>();
//     this.tokenPriceRepo = td.object<ITokenPriceRepository>();
//     this.transactionRepo = td.object<ITransactionHistoryRepository>();
//     this.balanceRepo = td.object<IPortfolioBalanceRepository>();
//     this.browsingDataRepo = td.object<IBrowsingDataRepository>();

//     // Setup the context an locked, none in progress
//     this.contextProvider = new ContextProviderMock(
//       new CoreContext(
//         unlocked ? dataWalletAddress : null,
//         unlocked ? dataWalletKey : null,
//         initializeInProgress,
//         new PublicEvents(), // publicEvents
//         new PrivateEvents(), // privateEvents
//         false, // restoreInProgress
//         UnixTimestamp(0), // startTime,
//         new ComponentStatus(
//           EComponentStatus.TemporarilyDisabled,
//           EComponentStatus.TemporarilyDisabled,
//           new Map<EChain, EComponentStatus>(),
//           new Map<EChain, EComponentStatus>(),
//           new Map<EChain, EComponentStatus>(),
//           new Map<EChain, EComponentStatus>(),
//           new Map<EChain, EComponentStatus>(),
//           [],
//         ), // components
//       ),
//     );

//     this.configProvider = new ConfigProviderMock();
//     this.dataWalletUtils = td.object<IDataWalletUtils>();
//     this.logUtils = td.object<ILogUtils>();

//     this.minimalForwarderContract = td.object<IMinimalForwarderContract>();

//     // EntropyRepository --------------------------------------------------

//     // DataWalletUtils --------------------------------------------------
//     // EVM and Solana signatures verify by default
//     td.when(
//       this.dataWalletUtils.verifySignature(
//         evmChain,
//         evmAccountAddress,
//         evmSignature,
//         unlockMessage,
//       ),
//     ).thenReturn(okAsync(true));
//     td.when(
//       this.dataWalletUtils.verifySignature(
//         solanaChain,
//         solanaAccountAddress,
//         solanaSignature,
//         unlockMessage,
//       ),
//     ).thenReturn(okAsync(true));

//     // Derived account 1 is for EVM, 2 for Solana
//     td.when(
//       this.dataWalletUtils.getDerivedEVMAccountFromSignature(
//         evmAccountAddress,
//         evmSignature,
//       ),
//     ).thenReturn(okAsync(evmDerivedEVMAccount));
//     td.when(
//       this.dataWalletUtils.getDerivedEVMAccountFromSignature(
//         solanaAccountAddress,
//         solanaSignature,
//       ),
//     ).thenReturn(okAsync(solanaDerivedEVMAccount));
//     td.when(
//       this.dataWalletUtils.getDerivedEVMAccountFromPassword(testPassword),
//     ).thenReturn(okAsync(passwordDerivedEVMAccount));
//     td.when(
//       this.dataWalletUtils.deriveEncryptionKeyFromSignature(
//         evmAccountAddress,
//         evmSignature,
//       ),
//     ).thenReturn(okAsync(evmDerivedEncryptionKey));
//     td.when(
//       this.dataWalletUtils.deriveEncryptionKeyFromSignature(
//         solanaAccountAddress,
//         solanaSignature,
//       ),
//     ).thenReturn(okAsync(solanaDerivedEncryptionKey));
//     td.when(
//       this.dataWalletUtils.deriveEncryptionKeyFromPassword(testPassword),
//     ).thenReturn(okAsync(passwordDerivedEncryptionKey));
//     td.when(this.dataWalletUtils.createDataWalletKey()).thenReturn(
//       okAsync(dataWalletKey),
//     );

//     // Data Wallet Persistence --------------------------------------------------
//     td.when(this.dataWalletPersistence.unlock(dataWalletKey)).thenReturn(
//       okAsync(undefined),
//     );
//     td.when(
//       this.accountRepo.addAccount(
//         td.matchers.contains({
//           sourceChain: evmChain,
//           sourceAccountAddress: evmAccountAddress,
//           derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
//         }),
//       ),
//     ).thenReturn(okAsync(undefined));
//     td.when(
//       this.accountRepo.addAccount(
//         td.matchers.contains({
//           sourceChain: solanaChain,
//           sourceAccountAddress: solanaAccountAddress,
//           derivedAccountAddress: solanaDerivedEVMAccount.accountAddress,
//         }),
//       ),
//     ).thenReturn(okAsync(undefined));
//     td.when(this.accountRepo.getAccounts()).thenReturn(
//       okAsync([
//         new LinkedAccount(evmChain, evmAccountAddress),
//         new LinkedAccount(solanaChain, solanaAccountAddress),
//       ]),
//     );
//     td.when(this.accountRepo.removeAccount(evmAccountAddress)).thenReturn(
//       okAsync(undefined),
//     );
//     td.when(this.accountRepo.removeAccount(solanaAccountAddress)).thenReturn(
//       okAsync(undefined),
//     );
//     td.when(this.dataWalletPersistence.postBackups()).thenReturn(
//       okAsync([dataWalletBackupID]),
//     );
//   }

//   public factory(): IAccountService {
//     return new AccountService(
//       this.entropyRepo,
//       this.permissionsUtils,
//       this.contextProvider,
//       this.configProvider,
//       this.dataWalletUtils,
//       this.logUtils,
//       this.dataWalletPersistence,
//       this.tokenPriceRepo,
//       this.accountRepo,
//       this.transactionRepo,
//       this.browsingDataRepo,
//       this.balanceRepo,
//     );
//   }
// }

// // describe("AccountService unlock() tests", () => {
// //   test("unlock() with EVM based account works with no existing crumb", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeFalsy();

// //     mocks.contextProvider.assertEventCounts({
// //       onInitialized: 1,
// //       onAccountAdded: 1,
// //     });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
// //       dataWalletKey,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       dataWalletAddress,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() with Solana based account works with no existing crumb", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         solanaDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       solanaAccountAddress,
// //       solanaSignature,
// //       languageCode,
// //       solanaChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeFalsy();

// //     mocks.contextProvider.assertEventCounts({
// //       onInitialized: 1,
// //       onAccountAdded: 1,
// //     });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
// //       dataWalletKey,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       dataWalletAddress,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() with EVM based account works with an existing crumb", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();
// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeFalsy();

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 1 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
// //       dataWalletKey,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       dataWalletAddress,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails with an invalid signature", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     td.when(
// //       mocks.dataWalletUtils.verifySignature(
// //         evmChain,
// //         evmAccountAddress,
// //         evmSignature,
// //         unlockMessage,
// //       ),
// //     ).thenReturn(okAsync(false));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(InvalidSignatureError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(0);
// //   });

// //   test("unlock() fails if we can't check for the crumb", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(
// //       errAsync(
// //         new BlockchainProviderError(
// //           ChainId(evmChain),
// //           `BlockchainProviderError`,
// //         ),
// //       ),
// //     );

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(BlockchainProviderError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(1);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails if we are already doing an unlock", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks(true);
// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(InvalidSignatureError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(1);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails if we are already unlocked", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks(false, true);
// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(InvalidSignatureError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(1);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails when we can't unlock the data persistence", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     td.when(mocks.dataWalletPersistence.unlock(dataWalletKey)).thenReturn(
// //       errAsync(new PersistenceError(`PersistenceError`)),
// //     );

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(PersistenceError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(3);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );

// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
// //       dataWalletKey,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       dataWalletAddress,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );

// //     expect(mocks.contextProvider.setContextValues[2].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[2].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[2].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails when we can't add an account", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     td.when(
// //       mocks.accountRepo.addAccount(
// //         td.matchers.contains({
// //           sourceChain: evmChain,
// //           sourceAccountAddress: evmAccountAddress,
// //           derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
// //         }),
// //       ),
// //     ).thenReturn(errAsync(new PersistenceError(`PersistenceError`)));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(PersistenceError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(3);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );

// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
// //       dataWalletKey,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       dataWalletAddress,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );

// //     expect(mocks.contextProvider.setContextValues[2].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[2].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[2].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails when we can't encode the crumb data", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     td.when(
// //       mocks.crumbsRepo.encodeCreateCrumb(languageCode, evmEncryptedDataWallet),
// //     ).thenReturn(
// //       errAsync(
// //         new BlockchainProviderError(
// //           ChainId(evmChain),
// //           `BlockchainProviderError`,
// //         ),
// //       ),
// //     );

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(BlockchainProviderError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );

// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails when we can't get a nonce from the minimal forwarder", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     td.when(
// //       mocks.metatransactionForwarderRepo.getNonce(
// //         evmDerivedEVMAccount.accountAddress,
// //       ),
// //     ).thenReturn(errAsync(new MinimalForwarderContractError()));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(MinimalForwarderContractError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );

// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });

// //   test("unlock() fails when we can't execute the metatransaction on the insight platform", async () => {
// //     // Arrange
// //     const mocks = new AccountServiceMocks();

// //     // No existing crumb
// //     td.when(
// //       mocks.crumbsRepo.getCrumb(
// //         evmDerivedEVMAccount.accountAddress,
// //         languageCode,
// //       ),
// //     ).thenReturn(okAsync(null));

// //     td.when(
// //       mocks.insightPlatformRepo.executeMetatransaction(
// //         evmDerivedEVMAccount.accountAddress,
// //         controlChainInformation.crumbsContractAddress,
// //         evmDerivedNonce,
// //         metatransactionValue,
// //         metatransactionGas,
// //         evmEncodedCreateCrumbContent,
// //         evmAddCrumbMetatransactionSignature,
// //         evmDerivedPrivateKey,
// //         defaultInsightPlatformBaseUrl,
// //       ),
// //     ).thenReturn(errAsync(new AjaxError("Error", 500)));

// //     const service = mocks.factory();

// //     // Act
// //     const result = await service.unlock(
// //       evmAccountAddress,
// //       evmSignature,
// //       languageCode,
// //       evmChain,
// //     );

// //     // Assert
// //     expect(result).toBeDefined();
// //     expect(result.isErr()).toBeTruthy();
// //     const err = result._unsafeUnwrapErr();
// //     expect(err).toBeInstanceOf(AjaxError);

// //     mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
// //     expect(mocks.contextProvider.setContextValues.length).toBe(2);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[0].initializeInProgress).toBe(
// //       true,
// //     );

// //     expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
// //     expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
// //       null,
// //     );
// //     expect(mocks.contextProvider.setContextValues[1].initializeInProgress).toBe(
// //       false,
// //     );
// //   });
// // });

// describe("AccountService addAccount() tests", () => {
//   test("addAccount() with EVM based account works with no existing crumb", async () => {
//     // Arrange
//     const mocks = new AccountServiceMocks(false, true);

//     // No existing crumb
//     td.when(
//       mocks.crumbsRepo.getCrumb(
//         evmDerivedEVMAccount.accountAddress,
//         languageCode,
//       ),
//     ).thenReturn(okAsync(null));

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
// });
