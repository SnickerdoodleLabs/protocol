import "reflect-metadata";
import { ICryptoUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ICrumbsContract,
  IMinimalForwarderContract,
} from "@snickerdoodlelabs/contracts-sdk";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AESEncryptedString,
  AESKey,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  DataWalletBackupID,
  EChain,
  EncryptedString,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  HexString,
  ICrumbContent,
  InitializationVector,
  InvalidSignatureError,
  ITokenPriceRepository,
  LanguageCode,
  LinkedAccount,
  MinimalForwarderContractError,
  PersistenceError,
  Signature,
  SolanaAccountAddress,
  TokenId,
  TokenUri,
  UninitializedError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import { Subject } from "rxjs";
import * as td from "testdouble";

import { AccountService } from "@core/implementations/business/index.js";
import { IAccountService } from "@core/interfaces/business/index.js";
import { IPermissionUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IBrowsingDataRepository,
  ICrumbsRepository,
  IDataWalletPersistence,
  ILinkedAccountRepository,
  IMetatransactionForwarderRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import {
  CoreContext,
  CrumbCallData,
  PublicEvents,
} from "@core/interfaces/objects/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import { PermissionsUtilsMock } from "@core-tests/mock/business/utilities/index.js";
import {
  controlChainInformation,
  dataWalletAddress,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

const metatransactionValue = BigNumberString("0");
const metatransactionGas = BigNumberString("10000000");
const tokenId1 = TokenId(BigInt(13));
const tokenId2 = TokenId(BigInt(69));
const evmDerivedNonce = BigNumberString("27");
const solanaDerivedNonce = BigNumberString("28");

const evmAccountAddress = EVMAccountAddress("evmAccountAddress");
const solanaAccountAddress = SolanaAccountAddress("solanaAccountAddress");
const evmSignature = Signature("evmSignature");
const solanaSignature = Signature("solanaSignature");

const evmDerivedPrivateKey = EVMPrivateKey("evmDerivedPrivateKey");
const solanaDerivedPrivateKey = EVMPrivateKey("solanaDerivedPrivateKey");

const evmDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress1"),
  evmDerivedPrivateKey,
);
const solanaDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress2"),
  solanaDerivedPrivateKey,
);
const evmChain = EChain.DevDoodle;
const solanaChain = EChain.Solana;
const languageCode = LanguageCode("en");
const unlockMessage = "Login to your Snickerdoodle data wallet"; // Needs to match result of getUnlockMessage(en)
const evmEncryptedDataWallet = new AESEncryptedString(
  EncryptedString("evmEncryptedDataWalletData"),
  InitializationVector("evmEncryptedDataWalletIV"),
);
const solanaEncryptedDataWallet = new AESEncryptedString(
  EncryptedString("solanaEncryptedDataWalletData"),
  InitializationVector("solanaEncryptedDataWalletIV"),
);
const evmDerivedEncryptionKey = AESKey("evmDerivedEncryptionKey");
const solanaDerivedEncryptionKey = AESKey("solanaDerivedEncryptionKey");

const evmEncodedCreateCrumbContent = HexString("evmEncodedCreateCrumbContent");
const solanaEncodedCreateCrumbContent = HexString(
  "solanaEncodedCreateCrumbContent",
);
const evmEncodedBurnCrumbContent = HexString("evmEncodedBurnCrumbContent");
const solanaEncodedBurnCrumbContent = HexString(
  "solanaEncodedBurnCrumbContent",
);

const evmAddCrumbMetatransactionSignature = Signature(
  "evmAddCrumbMetatransactionSignature",
);
const solanaAddCrumbMetatransactionSignature = Signature(
  "solanaAddCrumbMetatransactionSignature",
);
const evmBurnCrumbMetatransactionSignature = Signature(
  "evmBurnCrumbMetatransactionSignature",
);
const solanaBurnCrumbMetatransactionSignature = Signature(
  "solanaBurnCrumbMetatransactionSignature",
);

const dataWalletBackupID = DataWalletBackupID("dataWalletBackup");

class AccountServiceMocks {
  public permissionsUtils: IPermissionUtils;
  public insightPlatformRepo: IInsightPlatformRepository;
  public crumbsRepo: ICrumbsRepository;
  public metatransactionForwarderRepo: IMetatransactionForwarderRepository;
  public dataWalletPersistence: IDataWalletPersistence;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public dataWalletUtils: IDataWalletUtils;
  public cryptoUtils: ICryptoUtils;
  public logUtils: ILogUtils;
  public accountRepo: ILinkedAccountRepository;
  public tokenPriceRepo: ITokenPriceRepository;
  public transactionRepo: ITransactionHistoryRepository;
  public balanceRepo: IPortfolioBalanceRepository;
  public browsingDataRepo: IBrowsingDataRepository;

  public minimalForwarderContract: IMinimalForwarderContract;

  public constructor(unlockInProgress = false, unlocked = false) {
    this.permissionsUtils = new PermissionsUtilsMock();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.crumbsRepo = td.object<ICrumbsRepository>();
    this.metatransactionForwarderRepo =
      td.object<IMetatransactionForwarderRepository>();
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
        unlockInProgress,
        new PublicEvents(),
        false,
        new Subject<void>(), // heartbeat,
        UnixTimestamp(0), // startTime,
        {}, // apiCalls
      ),
    );

    this.configProvider = new ConfigProviderMock();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.logUtils = td.object<ILogUtils>();

    this.minimalForwarderContract = td.object<IMinimalForwarderContract>();

    // InsightPlatformRepo --------------------------------------------------
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        evmDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        evmDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        solanaDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedCreateCrumbContent,
        solanaAddCrumbMetatransactionSignature,
        solanaDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        evmDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedBurnCrumbContent,
        evmBurnCrumbMetatransactionSignature,
        evmDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        solanaDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedBurnCrumbContent,
        solanaBurnCrumbMetatransactionSignature,
        solanaDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));

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
    td.when(this.dataWalletUtils.createDataWalletKey()).thenReturn(
      okAsync(dataWalletKey),
    );

    // CrumbsRepository --------------------------------------------------
    // There is a crumb by default
    td.when(
      this.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(evmEncryptedDataWallet));
    td.when(
      this.crumbsRepo.getCrumb(
        solanaDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(solanaEncryptedDataWallet));
    td.when(
      this.crumbsRepo.getCrumbTokenId(evmDerivedEVMAccount.accountAddress),
    ).thenReturn(okAsync(tokenId1));
    td.when(
      this.crumbsRepo.getCrumbTokenId(solanaDerivedEVMAccount.accountAddress),
    ).thenReturn(okAsync(tokenId2));
    td.when(
      this.crumbsRepo.encodeCreateCrumb(languageCode, evmEncryptedDataWallet),
    ).thenReturn(
      okAsync(new CrumbCallData(evmEncodedCreateCrumbContent, tokenId1)),
    );
    td.when(
      this.crumbsRepo.encodeCreateCrumb(
        languageCode,
        solanaEncryptedDataWallet,
      ),
    ).thenReturn(
      okAsync(new CrumbCallData(solanaEncodedCreateCrumbContent, tokenId1)),
    );
    td.when(this.crumbsRepo.encodeBurnCrumb(tokenId1)).thenReturn(
      okAsync(evmEncodedBurnCrumbContent),
    );
    td.when(this.crumbsRepo.encodeBurnCrumb(tokenId2)).thenReturn(
      okAsync(solanaEncodedBurnCrumbContent),
    );
    td.when(this.crumbsRepo.getURI(tokenId1)).thenReturn(
      okAsync(
        TokenUri(
          JSON.stringify({
            [languageCode]: {
              d: evmEncryptedDataWallet.data,
              iv: evmEncryptedDataWallet.initializationVector,
            },
          } as ICrumbContent),
        ),
      ),
    );
    td.when(this.crumbsRepo.getURI(tokenId2)).thenReturn(
      okAsync(
        TokenUri(
          JSON.stringify({
            [languageCode]: {
              d: solanaEncryptedDataWallet.data,
              iv: solanaEncryptedDataWallet.initializationVector,
            },
          } as ICrumbContent),
        ),
      ),
    );

    // CryptoUtils --------------------------------------------------
    td.when(
      this.cryptoUtils.decryptAESEncryptedString(
        evmEncryptedDataWallet,
        evmDerivedEncryptionKey,
      ),
    ).thenReturn(okAsync(dataWalletKey));
    td.when(
      this.cryptoUtils.decryptAESEncryptedString(
        solanaEncryptedDataWallet,
        solanaDerivedEncryptionKey,
      ),
    ).thenReturn(okAsync(dataWalletKey));
    td.when(
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(dataWalletKey),
    ).thenReturn(EVMAccountAddress(dataWalletAddress) as never); // No idea why I need the "as never"
    td.when(
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
        evmDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(evmDerivedEVMAccount.accountAddress as never);
    td.when(
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(
        solanaDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(solanaDerivedEVMAccount.accountAddress as never);
    td.when(
      this.cryptoUtils.encryptString(dataWalletKey, evmDerivedEncryptionKey),
    ).thenReturn(okAsync(evmEncryptedDataWallet));
    td.when(
      this.cryptoUtils.encryptString(dataWalletKey, solanaDerivedEncryptionKey),
    ).thenReturn(okAsync(solanaEncryptedDataWallet));
    // Will return different nonces each time, just in case
    td.when(this.cryptoUtils.getTokenId()).thenReturn(
      okAsync(tokenId1),
      okAsync(tokenId2),
    );

    // Data Wallet Persistence --------------------------------------------------
    td.when(this.dataWalletPersistence.unlock(dataWalletKey)).thenReturn(
      okAsync(undefined),
    );
    td.when(
      this.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: evmChain,
          sourceAccountAddress: evmAccountAddress,
          derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: solanaChain,
          sourceAccountAddress: solanaAccountAddress,
          derivedAccountAddress: solanaDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(this.accountRepo.getAccounts()).thenReturn(
      okAsync([
        new LinkedAccount(
          evmChain,
          evmAccountAddress,
          evmDerivedEVMAccount.accountAddress,
        ),
        new LinkedAccount(
          solanaChain,
          solanaAccountAddress,
          solanaDerivedEVMAccount.accountAddress,
        ),
      ]),
    );
    td.when(this.accountRepo.removeAccount(evmAccountAddress)).thenReturn(
      okAsync(undefined),
    );
    td.when(this.accountRepo.removeAccount(solanaAccountAddress)).thenReturn(
      okAsync(undefined),
    );
    td.when(this.dataWalletPersistence.postBackups()).thenReturn(
      okAsync([dataWalletBackupID]),
    );

    // metatransactionForwarderRepo
    td.when(
      this.metatransactionForwarderRepo.getNonce(
        evmDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(okAsync(evmDerivedNonce));
    td.when(
      this.metatransactionForwarderRepo.getNonce(
        solanaDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(okAsync(solanaDerivedNonce));

    td.when(
      this.metatransactionForwarderRepo.signMetatransactionRequest(
        td.matchers.contains({
          to: controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
          from: evmDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: evmEncodedCreateCrumbContent, // The actual bytes of the request, encoded as a hex string
        }),
        evmDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(evmAddCrumbMetatransactionSignature));

    td.when(
      this.metatransactionForwarderRepo.signMetatransactionRequest(
        td.matchers.contains({
          to: controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
          from: solanaDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: solanaEncodedCreateCrumbContent, // The actual bytes of the request, encoded as a hex string
        }),
        solanaDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(solanaAddCrumbMetatransactionSignature));

    td.when(
      this.metatransactionForwarderRepo.signMetatransactionRequest(
        td.matchers.contains({
          to: controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
          from: evmDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: evmEncodedBurnCrumbContent, // The actual bytes of the request, encoded as a hex string
        }),
        evmDerivedPrivateKey,
      ),
    ).thenReturn(okAsync(evmBurnCrumbMetatransactionSignature));

    td.when(
      this.metatransactionForwarderRepo.signMetatransactionRequest(
        td.matchers.contains({
          to: controlChainInformation.crumbsContractAddress, // Contract address for the metatransaction
          from: solanaDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: solanaEncodedBurnCrumbContent, // The actual bytes of the request, encoded as a hex string
        }),
        solanaDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(solanaBurnCrumbMetatransactionSignature));
  }

  public factory(): IAccountService {
    return new AccountService(
      this.permissionsUtils,
      this.insightPlatformRepo,
      this.crumbsRepo,
      this.metatransactionForwarderRepo,
      this.contextProvider,
      this.configProvider,
      this.dataWalletUtils,
      this.cryptoUtils,
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

describe("AccountService unlock() tests", () => {
  test("unlock() with EVM based account works with no existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onInitialized: 1,
      onAccountAdded: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
      dataWalletKey,
    );
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      dataWalletAddress,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() with Solana based account works with no existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        solanaDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      solanaAccountAddress,
      solanaSignature,
      languageCode,
      solanaChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onInitialized: 1,
      onAccountAdded: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
      dataWalletKey,
    );
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      dataWalletAddress,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() with EVM based account works with an existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({ onInitialized: 1 });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
      dataWalletKey,
    );
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      dataWalletAddress,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails with an invalid signature", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    td.when(
      mocks.dataWalletUtils.verifySignature(
        evmChain,
        evmAccountAddress,
        evmSignature,
        unlockMessage,
      ),
    ).thenReturn(okAsync(false));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(InvalidSignatureError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("unlock() fails if we can't check for the crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(errAsync(new BlockchainProviderError(ChainId(evmChain))));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(BlockchainProviderError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(1);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails if we are already doing an unlock", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(true);
    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(InvalidSignatureError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(1);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails if we are already unlocked", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);
    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(InvalidSignatureError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(1);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails when we can't unlock the data persistence", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    td.when(mocks.dataWalletPersistence.unlock(dataWalletKey)).thenReturn(
      errAsync(new PersistenceError()),
    );

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(PersistenceError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(3);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );

    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
      dataWalletKey,
    );
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      dataWalletAddress,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );

    expect(mocks.contextProvider.setContextValues[2].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[2].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[2].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails when we can't add an account", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: evmChain,
          sourceAccountAddress: evmAccountAddress,
          derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(errAsync(new PersistenceError()));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(PersistenceError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(3);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );

    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(
      dataWalletKey,
    );
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      dataWalletAddress,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );

    expect(mocks.contextProvider.setContextValues[2].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[2].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[2].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails when we can't encode the crumb data", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.crumbsRepo.encodeCreateCrumb(languageCode, evmEncryptedDataWallet),
    ).thenReturn(errAsync(new BlockchainProviderError(ChainId(evmChain))));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(BlockchainProviderError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );

    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails when we can't get a nonce from the minimal forwarder", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.metatransactionForwarderRepo.getNonce(
        evmDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(errAsync(new MinimalForwarderContractError()));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(MinimalForwarderContractError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );

    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });

  test("unlock() fails when we can't execute the metatransaction on the insight platform", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.insightPlatformRepo.executeMetatransaction(
        evmDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        evmDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(errAsync(new AjaxError("Error", 500)));

    const service = mocks.factory();

    // Act
    const result = await service.unlock(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(AjaxError);

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(2);
    expect(mocks.contextProvider.setContextValues[0].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[0].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[0].unlockInProgress).toBe(
      true,
    );

    expect(mocks.contextProvider.setContextValues[1].dataWalletKey).toBe(null);
    expect(mocks.contextProvider.setContextValues[1].dataWalletAddress).toBe(
      null,
    );
    expect(mocks.contextProvider.setContextValues[1].unlockInProgress).toBe(
      false,
    );
  });
});

describe("AccountService addAccount() tests", () => {
  test("addAccount() with EVM based account works with no existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

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
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() with Solana based account works with no existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        solanaDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    const service = mocks.factory();

    // Act
    const result = await service.addAccount(
      solanaAccountAddress,
      solanaSignature,
      languageCode,
      solanaChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onAccountAdded: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() with EVM based account works with an existing crumb", async () => {
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
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails with an invalid signature", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    td.when(
      mocks.dataWalletUtils.verifySignature(
        evmChain,
        evmAccountAddress,
        evmSignature,
        unlockMessage,
      ),
    ).thenReturn(okAsync(false));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(InvalidSignatureError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails if the wallet is not already unlocked", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, false);

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(UninitializedError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails if we can't check for the crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(errAsync(new BlockchainProviderError(ChainId(evmChain))));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(BlockchainProviderError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails when we can't encode the crumbs data", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.crumbsRepo.encodeCreateCrumb(languageCode, evmEncryptedDataWallet),
    ).thenReturn(errAsync(new BlockchainProviderError(ChainId(evmChain))));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(BlockchainProviderError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails when we can't get a nonce from the minimal forwarder", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.metatransactionForwarderRepo.getNonce(
        evmDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(errAsync(new MinimalForwarderContractError()));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(MinimalForwarderContractError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails when we can't execute the metatransaction on the insight platform", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.insightPlatformRepo.executeMetatransaction(
        evmDerivedEVMAccount.accountAddress,
        controlChainInformation.crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        evmDerivedPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(errAsync(new AjaxError("Error", 500)));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(AjaxError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails when we can't add an account", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(
      mocks.accountRepo.addAccount(
        td.matchers.contains({
          sourceChain: evmChain,
          sourceAccountAddress: evmAccountAddress,
          derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(errAsync(new PersistenceError()));

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
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(PersistenceError);

    mocks.contextProvider.assertEventCounts({ onAccountAdded: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });
});

describe("AccountService unlinkAccount() tests", () => {
  test("unlinkAccount() with EVM based account works", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    const service = mocks.factory();

    // Act
    const result = await service.unlinkAccount(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onAccountRemoved: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("unlinkAccount() with Solana based account works", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    const service = mocks.factory();

    // Act
    const result = await service.unlinkAccount(
      solanaAccountAddress,
      solanaSignature,
      languageCode,
      solanaChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onAccountRemoved: 1,
    });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });
});

describe("AccountService getDataWalletForAccount() tests", () => {
  test("getDataWalletForAccount() with EVM based account works with no existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    const service = mocks.factory();

    // Act
    const result = await service.getDataWalletForAccount(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onInitialized: 0,
      onAccountAdded: 0,
    });

    const dataWalletAddress = result._unsafeUnwrap();
    expect(dataWalletAddress).toBeNull();
  });

  test("getDataWalletForAccount() with EVM based account works with an existing crumb", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.getDataWalletForAccount(
      evmAccountAddress,
      evmSignature,
      languageCode,
      evmChain,
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onInitialized: 0,
      onAccountAdded: 0,
    });

    const dataWalletAddress = result._unsafeUnwrap();
    expect(dataWalletAddress).toBe(dataWalletAddress);
  });
});
