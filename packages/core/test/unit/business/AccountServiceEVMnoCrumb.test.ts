import "reflect-metadata";
import { ICryptoUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import {
  ICrumbsContract,
  IMinimalForwarderContract,
  IMinimalForwarderRequest,
} from "@snickerdoodlelabs/contracts-sdk";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AESEncryptedString,
  AESKey,
  BigNumberString,
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
  ITokenPriceRepository,
  LanguageCode,
  LinkedAccount,
  Signature,
  SolanaAccountAddress,
  TokenId,
  TokenUri,
} from "@snickerdoodlelabs/objects";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { AccountService } from "@core/implementations/business/index.js";
import { IAccountService } from "@core/interfaces/business/index.js";
import { IPermissionUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IBrowsingDataRepository,
  ICrumbsRepository,
  IDataWalletPersistence,
  ILinkedAccountRepository,
  IPortfolioBalanceRepository,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import { CoreContext, PublicEvents } from "@core/interfaces/objects/index.js";
import { IContractFactory } from "@core/interfaces/utilities/factory/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import { PermissionsUtilsMock } from "@core-tests/mock/business/utilities/index.js";
import {
  dataWalletAddress,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
} from "@core-tests/mock/mocks/index.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities/index.js";

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

const dataWalletBackupID = DataWalletBackupID("ceramicStream");

class AccountServiceMocks {
  public permissionsUtils: IPermissionUtils;
  public insightPlatformRepo: IInsightPlatformRepository;
  public crumbsRepo: ICrumbsRepository;
  public dataWalletPersistence: IDataWalletPersistence;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public dataWalletUtils: IDataWalletUtils;
  public cryptoUtils: ICryptoUtils;
  public contractFactory: IContractFactory;
  public tokenPriceRepo: ITokenPriceRepository;
  public accountRepo: ILinkedAccountRepository;
  public transactionRepo: ITransactionHistoryRepository;
  public browsingDataRepo: IBrowsingDataRepository;
  public balanceRepo: IPortfolioBalanceRepository;

  public minimalForwarderContract: IMinimalForwarderContract;
  public crumbsContract: ICrumbsContract;
  public logUtils: ILogUtils;

  public constructor(unlockInProgress = false, unlocked = false) {
    this.permissionsUtils = new PermissionsUtilsMock();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.crumbsRepo = td.object<ICrumbsRepository>();
    this.dataWalletPersistence = td.object<IDataWalletPersistence>();
    this.logUtils = td.object<ILogUtils>();
    this.tokenPriceRepo = td.object<ITokenPriceRepository>();
    this.accountRepo = td.object<ILinkedAccountRepository>();
    this.transactionRepo = td.object<ITransactionHistoryRepository>();
    this.browsingDataRepo = td.object<IBrowsingDataRepository>();
    this.balanceRepo = td.object<IPortfolioBalanceRepository>();

    // Setup the context an locked, none in progress
    this.contextProvider = new ContextProviderMock(
      new CoreContext(
        unlocked ? dataWalletAddress : null,
        unlocked ? dataWalletKey : null,
        unlockInProgress,
        new PublicEvents(),
        false,
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
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedCreateCrumbContent,
        evmAddCrumbMetatransactionSignature,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        solanaDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedCreateCrumbContent,
        solanaAddCrumbMetatransactionSignature,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        evmDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        evmDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        evmEncodedBurnCrumbContent,
        evmBurnCrumbMetatransactionSignature,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        solanaDerivedEVMAccount.accountAddress,
        crumbsContractAddress,
        solanaDerivedNonce,
        metatransactionValue,
        metatransactionGas,
        solanaEncodedBurnCrumbContent,
        solanaBurnCrumbMetatransactionSignature,
        dataWalletKey,
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
      this.permissionsUtils,
      this.insightPlatformRepo,
      this.crumbsRepo,
      this.contextProvider,
      this.configProvider,
      this.dataWalletUtils,
      this.cryptoUtils,
      this.contractFactory,
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
});
