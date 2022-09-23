import "reflect-metadata";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  ICrumbsContract,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  AESEncryptedString,
  AESKey,
  AjaxError,
  BigNumberString,
  BlockchainProviderError,
  ChainId,
  EChain,
  EncryptedString,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  ExternallyOwnedAccount,
  HexString,
  ICrumbContent,
  IDataWalletPersistence,
  InitializationVector,
  InvalidSignatureError,
  LanguageCode,
  LinkedAccount,
  MinimalForwarderContractError,
  PersistenceError,
  Signature,
  SolanaAccountAddress,
  TokenId,
  TokenUri,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

import {
  dataWalletAddress,
  dataWalletKey,
  externalAccountAddress1,
  consentContractAddress1,
} from "@core-tests/mock/mocks/commonValues";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";
import { AccountService } from "@core/implementations/business/index.js";
import { IAccountService } from "@core/interfaces/business/index.js";
import {
  IInsightPlatformRepository,
  ICrumbsRepository,
} from "@core/interfaces/data/index.js";
import { CoreContext, PublicEvents } from "@core/interfaces/objects/index.js";
import { IContractFactory } from "@core/interfaces/utilities/factory/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";

const crumbsContractAddress = EVMContractAddress("crumbsContractAddress");
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
const evmDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress1"),
  EVMPrivateKey("derivedEVMPrivateKey1"),
);
const solanaDerivedEVMAccount = new ExternallyOwnedAccount(
  EVMAccountAddress("derivedEVMAccountAddress2"),
  EVMPrivateKey("derivedEVMPrivateKey2"),
);
const evmChain = EChain.LocalDoodle;
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

class AccountServiceMocks {
  public insightPlatformRepo: IInsightPlatformRepository;
  public crumbsRepo: ICrumbsRepository;
  public dataWalletPersistence: IDataWalletPersistence;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public dataWalletUtils: IDataWalletUtils;
  public cryptoUtils: ICryptoUtils;
  public contractFactory: IContractFactory;

  public minimalForwarderContract: IMinimalForwarderContract;
  public crumbsContract: ICrumbsContract;

  public constructor(unlockInProgress = false, unlocked = false) {
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.crumbsRepo = td.object<ICrumbsRepository>();
    this.dataWalletPersistence = td.object<IDataWalletPersistence>();

    // Setup the context an locked, none in progress
    this.contextProvider = new ContextProviderMock(
      new CoreContext(
        unlocked ? dataWalletAddress : null,
        unlocked ? dataWalletKey : null,
        unlockInProgress,
        new PublicEvents(),
      ),
    );

    this.configProvider = new ConfigProviderMock();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.contractFactory = td.object<IContractFactory>();

    this.minimalForwarderContract = td.object<IMinimalForwarderContract>();
    this.crumbsContract = td.object<ICrumbsContract>();

    // InsightPlatformRepo --------------------------------------------------
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        dataWalletAddress,
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        dataWalletAddress,
        solanaDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedCreateCrumbContent,
        solanaAddCrumbMetatransactionSignature,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        dataWalletAddress,
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedBurnCrumbContent,
        evmBurnCrumbMetatransactionSignature,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        dataWalletAddress,
        solanaDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedBurnCrumbContent,
        solanaBurnCrumbMetatransactionSignature,
        dataWalletKey,
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
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(evmSignature),
    ).thenReturn(okAsync(evmDerivedEncryptionKey));
    td.when(
      this.dataWalletUtils.deriveEncryptionKeyFromSignature(solanaSignature),
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
    td.when(
      this.cryptoUtils.signTypedData(
        getMinimalForwarderSigningDomain(
          this.configProvider.config.controlChainInformation.chainId,
          this.configProvider.config.controlChainInformation
            .metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        td.matchers.contains({
          to: crumbsContractAddress, // Contract address for the metatransaction
          from: evmDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: evmEncodedCreateCrumbContent, // The actual bytes of the request, encoded as a hex string
        } as IMinimalForwarderRequest),
        evmDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(evmAddCrumbMetatransactionSignature));
    td.when(
      this.cryptoUtils.signTypedData(
        getMinimalForwarderSigningDomain(
          this.configProvider.config.controlChainInformation.chainId,
          this.configProvider.config.controlChainInformation
            .metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        td.matchers.contains({
          to: crumbsContractAddress, // Contract address for the metatransaction
          from: solanaDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: solanaEncodedCreateCrumbContent, // The actual bytes of the request, encoded as a hex string
        } as IMinimalForwarderRequest),
        solanaDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(solanaAddCrumbMetatransactionSignature));
    td.when(
      this.cryptoUtils.signTypedData(
        getMinimalForwarderSigningDomain(
          this.configProvider.config.controlChainInformation.chainId,
          this.configProvider.config.controlChainInformation
            .metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        td.matchers.contains({
          to: crumbsContractAddress, // Contract address for the metatransaction
          from: evmDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: evmEncodedBurnCrumbContent, // The actual bytes of the request, encoded as a hex string
        } as IMinimalForwarderRequest),
        evmDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(evmBurnCrumbMetatransactionSignature));
    td.when(
      this.cryptoUtils.signTypedData(
        getMinimalForwarderSigningDomain(
          this.configProvider.config.controlChainInformation.chainId,
          this.configProvider.config.controlChainInformation
            .metatransactionForwarderAddress,
        ),
        forwardRequestTypes,
        td.matchers.contains({
          to: crumbsContractAddress, // Contract address for the metatransaction
          from: solanaDerivedEVMAccount.accountAddress, // EOA to run the transaction as
          data: solanaEncodedBurnCrumbContent, // The actual bytes of the request, encoded as a hex string
        } as IMinimalForwarderRequest),
        solanaDerivedEVMAccount.privateKey,
      ),
    ).thenReturn(okAsync(solanaBurnCrumbMetatransactionSignature));

    // Data Wallet Persistence --------------------------------------------------
    td.when(this.dataWalletPersistence.unlock(dataWalletKey)).thenReturn(
      okAsync(undefined),
    );
    td.when(
      this.dataWalletPersistence.addAccount(
        td.matchers.contains({
          sourceChain: evmChain,
          sourceAccountAddress: evmAccountAddress,
          derivedAccountAddress: evmDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.dataWalletPersistence.addAccount(
        td.matchers.contains({
          sourceChain: solanaChain,
          sourceAccountAddress: solanaAccountAddress,
          derivedAccountAddress: solanaDerivedEVMAccount.accountAddress,
        }),
      ),
    ).thenReturn(okAsync(undefined));
    td.when(this.dataWalletPersistence.getAccounts()).thenReturn(
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
    td.when(
      this.dataWalletPersistence.removeAccount(evmAccountAddress),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.dataWalletPersistence.removeAccount(solanaAccountAddress),
    ).thenReturn(okAsync(undefined));

    // ContractFactory --------------------------------------------------
    td.when(this.contractFactory.factoryMinimalForwarderContract()).thenReturn(
      okAsync(this.minimalForwarderContract),
    );
    td.when(this.contractFactory.factoryCrumbsContract()).thenReturn(
      okAsync(this.crumbsContract),
    );

    // Minimal Forwarder Contract --------------------------------------------------
    td.when(
      this.minimalForwarderContract.getNonce(
        evmDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(okAsync(evmDerivedNonce));
    td.when(
      this.minimalForwarderContract.getNonce(
        solanaDerivedEVMAccount.accountAddress,
      ),
    ).thenReturn(okAsync(solanaDerivedNonce));

    // Crumbs Contract --------------------------------------------------
    td.when(
      this.crumbsContract.encodeCreateCrumb(
        tokenId1,
        TokenUri(
          JSON.stringify({
            [languageCode]: {
              d: evmEncryptedDataWallet.data,
              iv: evmEncryptedDataWallet.initializationVector,
            },
          } as ICrumbContent),
        ),
      ),
    ).thenReturn(evmEncodedCreateCrumbContent as never);
    td.when(
      this.crumbsContract.encodeCreateCrumb(
        tokenId1,
        TokenUri(
          JSON.stringify({
            [languageCode]: {
              d: solanaEncryptedDataWallet.data,
              iv: solanaEncryptedDataWallet.initializationVector,
            },
          } as ICrumbContent),
        ),
      ),
    ).thenReturn(solanaEncodedCreateCrumbContent as never);
    td.when(this.crumbsContract.encodeBurnCrumb(tokenId1)).thenReturn(
      evmEncodedBurnCrumbContent as never,
    );
    td.when(this.crumbsContract.encodeBurnCrumb(tokenId2)).thenReturn(
      solanaEncodedBurnCrumbContent as never,
    );
    this.crumbsContract.contractAddress = crumbsContractAddress;
  }

  public factory(): IAccountService {
    return new AccountService(
      this.insightPlatformRepo,
      this.crumbsRepo,
      this.dataWalletPersistence,
      this.contextProvider,
      this.configProvider,
      this.dataWalletUtils,
      this.cryptoUtils,
      this.contractFactory,
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
      mocks.dataWalletPersistence.addAccount(
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

  test("unlock() fails when we can't factory the MinimalFowarder", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(mocks.contractFactory.factoryMinimalForwarderContract()).thenReturn(
      errAsync(new BlockchainProviderError(ChainId(evmChain))),
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

  test("unlock() fails when we can't factory the CrumbsContract", async () => {
    // Arrange
    const mocks = new AccountServiceMocks();

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(mocks.contractFactory.factoryCrumbsContract()).thenReturn(
      errAsync(new BlockchainProviderError(ChainId(evmChain))),
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
      mocks.minimalForwarderContract.getNonce(
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
        dataWalletAddress,
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        dataWalletKey,
      ),
    ).thenReturn(errAsync(new AjaxError()));

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

  test("addAccount() fails when we can't factory the MinimalFowarder", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(mocks.contractFactory.factoryMinimalForwarderContract()).thenReturn(
      errAsync(new BlockchainProviderError(ChainId(evmChain))),
    );

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

    mocks.contextProvider.assertEventCounts({ onInitialized: 0 });
    expect(mocks.contextProvider.setContextValues.length).toBe(0);
  });

  test("addAccount() fails when we can't factory the CrumbsContract", async () => {
    // Arrange
    const mocks = new AccountServiceMocks(false, true);

    // No existing crumb
    td.when(
      mocks.crumbsRepo.getCrumb(
        evmDerivedEVMAccount.accountAddress,
        languageCode,
      ),
    ).thenReturn(okAsync(null));

    td.when(mocks.contractFactory.factoryCrumbsContract()).thenReturn(
      errAsync(new BlockchainProviderError(ChainId(evmChain))),
    );

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
      mocks.minimalForwarderContract.getNonce(
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
        dataWalletAddress,
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        dataWalletKey,
      ),
    ).thenReturn(errAsync(new AjaxError()));

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
      mocks.dataWalletPersistence.addAccount(
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
