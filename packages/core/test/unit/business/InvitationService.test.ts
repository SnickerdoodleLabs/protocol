import { BigNumber } from "ethers";
import { okAsync } from "neverthrow";
import "reflect-metadata";
import * as td from "testdouble";

import {
  consentContractAddress1,
  dataWalletAddress,
  dataWalletKey,
  defaultInsightPlatformBaseUrl,
  externalAccountAddress1,
} from "@core-tests/mock/mocks/commonValues.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities";
import { InvitationService } from "@core/implementations/business/index.js";
import { IInvitationService } from "@core/interfaces/business/index.js";
import { IConsentTokenUtils } from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IDNSRepository,
  IInvitationRepository,
  ILinkedAccountRepository,
  IMetatransactionForwarderRepository,
} from "@core/interfaces/data/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import { ICryptoUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  BigNumberString,
  ConsentError,
  ConsentToken,
  DataPermissions,
  DomainName,
  EVMAccountAddress,
  EVMPrivateKey,
  HexString,
  HexString32,
  Invitation,
  InvitationDomain,
  IpfsCID,
  Signature,
  TokenId,
  URLString,
} from "@snickerdoodlelabs/objects";

const metatransactionNonce = BigNumberString("123456789");
const metatransactionValue = BigNumberString("0");
const metatransactionGas = BigNumberString("gas");
const optInCallData = HexString("0xOptIn");
const optOutCallData = HexString("0xOptOut");
const optInSignature = Signature("OptInSignature");
const optOutSignature = Signature("OptOutSignature");
const optInPrivateKey = EVMPrivateKey("optInPrivateKey");
const optInAccountAddress = EVMAccountAddress("optInAccountAddress");
const domain = DomainName("phoebe.com");
const url1 = URLString("phoebe.com/cute");
const url2 = URLString("phoebe.com/loud");
const ipfsCID = IpfsCID("ipfscid");
const tokenId1 = TokenId(BigInt(13));
const tokenId2 = TokenId(BigInt(69));
const permissionsHex = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
);
const dataPermissions = new DataPermissions(permissionsHex);
const newPermissionsHex = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000001",
);
const encodedUpdateAgreementFlagsContent = HexString(
  "encodedUpdateAgreementFlagsContent",
);
const updateAgreementFlagsMetatransactionSignature = Signature(
  "updateAgreementFlagsMetatransactionSignature",
);

const invitationDomain = new InvitationDomain(
  domain,
  "Domain Title",
  "Domain Description",
  URLString("Image"),
  "RewardName",
  URLString("nftClaimedImage"),
);

const acceptedInvitation = new Invitation(
  domain,
  consentContractAddress1,
  tokenId1,
  null,
);

const consentToken1 = new ConsentToken(
  consentContractAddress1,
  externalAccountAddress1,
  tokenId1,
  dataPermissions,
);

class InvitationServiceMocks {
  public consentTokenUtils: IConsentTokenUtils;
  public consentRepo: IConsentContractRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public dnsRepository: IDNSRepository;
  public invitationRepo: IInvitationRepository;
  public forwarderRepo: IMetatransactionForwarderRepository;
  public dataWalletUtils: IDataWalletUtils;
  public cryptoUtils: ICryptoUtils;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public logUtils: ILogUtils;
  public accountRepo: ILinkedAccountRepository;

  public constructor() {
    this.consentTokenUtils = td.object<IConsentTokenUtils>();
    this.consentRepo = td.object<IConsentContractRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.dnsRepository = td.object<IDNSRepository>();
    this.invitationRepo = td.object<IInvitationRepository>();
    this.forwarderRepo = td.object<IMetatransactionForwarderRepository>();
    this.contextProvider = new ContextProviderMock();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.configProvider = new ConfigProviderMock();
    this.logUtils = td.object<ILogUtils>();
    this.accountRepo = td.object<ILinkedAccountRepository>();

    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        EVMAccountAddress(dataWalletAddress),
        consentContractAddress1,
        metatransactionNonce,
        metatransactionValue,
        metatransactionGas,
        optInCallData,
        optInSignature,
        optInPrivateKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(this.dnsRepository.fetchTXTRecords(domain)).thenReturn(
      okAsync([`"${consentContractAddress1}"`]),
    );

    // ConsentRepo ---------------------------------------------------------------
    td.when(
      this.consentRepo.getInvitationUrls(consentContractAddress1),
    ).thenReturn(okAsync([url1, url2]));
    td.when(
      this.consentRepo.getMetadataCID(consentContractAddress1),
    ).thenReturn(okAsync(ipfsCID));
    td.when(
      this.consentRepo.getConsentCapacity(consentContractAddress1),
    ).thenReturn(okAsync({ availableOptInCount: 10, maxCapacity: 10 }));
    td.when(this.consentRepo.getConsentToken(acceptedInvitation)).thenReturn(
      okAsync(consentToken1),
    );
    td.when(
      this.consentRepo.encodeUpdateAgreementFlags(
        consentContractAddress1,
        tokenId1,
        td.matchers.contains({
          agreementFlags: newPermissionsHex,
        }),
      ),
    ).thenReturn(okAsync(encodedUpdateAgreementFlagsContent));

    // InvitationRepo -------------------------------------------------------
    td.when(
      this.invitationRepo.getInvitationDomainByCID(ipfsCID, domain),
    ).thenReturn(okAsync(invitationDomain));
    td.when(this.invitationRepo.getAcceptedInvitations()).thenReturn(
      okAsync([acceptedInvitation]),
    );
    td.when(
      this.invitationRepo.removeAcceptedInvitationsByContractAddress([
        consentContractAddress1,
      ]),
    ).thenReturn(okAsync(undefined));

    // CryptoUtils ----------------------------------------------------------
    // Will return different nonces each time, just in case
    td.when(this.cryptoUtils.getTokenId()).thenReturn(
      okAsync(tokenId1),
      okAsync(tokenId2),
    );
    td.when(
      this.cryptoUtils.getEthereumAccountAddressFromPrivateKey(optInPrivateKey),
    ).thenReturn(optInAccountAddress as never);

    // AccountRepo ------------------------------------------------

    // DataWalletUtils --------------------------------------------
    td.when(
      this.dataWalletUtils.deriveOptInPrivateKey(
        consentContractAddress1,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(optInPrivateKey));

    // ForwarderRepo -----------------------------------------------
    td.when(this.forwarderRepo.getNonce(optInAccountAddress)).thenReturn(
      okAsync(metatransactionNonce),
    );

    td.when(
      this.forwarderRepo.signMetatransactionRequest(
        td.matchers.contains({
          to: consentContractAddress1,
          from: optInAccountAddress,
          data: encodedUpdateAgreementFlagsContent, // The actual bytes of the request, encoded as a hex string
        }),
        optInPrivateKey,
      ),
    ).thenReturn(okAsync(updateAgreementFlagsMetatransactionSignature));

    // InsightPlatformRepo -----------------------------------------------------
    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        optInAccountAddress, // account address
        consentContractAddress1, // contract address
        metatransactionNonce,
        metatransactionValue,
        BigNumberString(
          BigNumber.from(
            this.configProvider.config.gasAmounts.updateAgreementFlagsGas,
          ).toString(),
        ),
        encodedUpdateAgreementFlagsContent,
        updateAgreementFlagsMetatransactionSignature,
        optInPrivateKey,
        this.configProvider.config.defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
  }

  public factory(): IInvitationService {
    return new InvitationService(
      this.consentTokenUtils,
      this.consentRepo,
      this.insightPlatformRepo,
      this.dnsRepository,
      this.invitationRepo,
      this.forwarderRepo,
      this.dataWalletUtils,
      this.cryptoUtils,
      this.contextProvider,
      this.configProvider,
      this.logUtils,
      this.accountRepo,
    );
  }
}

describe("InvitationService tests", () => {
  test("getInvitationsByDomain happy path", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.getInvitationsByDomain(domain);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const pageInvitations = result._unsafeUnwrap();
    expect(pageInvitations.length).toBe(2);

    expect(pageInvitations[0].url).toBe(url1);
    expect(pageInvitations[0].domainDetails).toBe(invitationDomain);
    expect(pageInvitations[0].invitation.businessSignature).toBeNull();
    expect(pageInvitations[0].invitation.consentContractAddress).toBe(
      consentContractAddress1,
    );
    expect(pageInvitations[0].invitation.domain).toBe(domain);
    expect(pageInvitations[0].invitation.tokenId).toBe(tokenId1);

    expect(pageInvitations[1].url).toBe(url2);
    expect(pageInvitations[1].domainDetails).toBe(invitationDomain);
    expect(pageInvitations[1].invitation.businessSignature).toBeNull();
    expect(pageInvitations[1].invitation.consentContractAddress).toBe(
      consentContractAddress1,
    );
    expect(pageInvitations[1].invitation.domain).toBe(domain);
    expect(pageInvitations[1].invitation.tokenId).toBe(tokenId2);
  });

  test("getInvitationsByDomain no available slots", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();

    td.when(
      mocks.consentRepo.getConsentCapacity(consentContractAddress1),
    ).thenReturn(okAsync({ availableOptInCount: 0, maxCapacity: 10 }));

    const service = mocks.factory();

    // Act
    const result = await service.getInvitationsByDomain(domain);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    const pageInvitations = result._unsafeUnwrap();
    expect(pageInvitations.length).toBe(0);
  });
});

describe("InvitationService.updateDataPermissions() tests", () => {
  test("Happy Path", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.updateDataPermissions(
      consentContractAddress1,
      new DataPermissions(newPermissionsHex),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();
    mocks.contextProvider.assertEventCounts({
      onDataPermissionsUpdated: 1,
    });
  });

  test("No invitation found in persistence, fails", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();

    td.when(mocks.invitationRepo.getAcceptedInvitations()).thenReturn(
      okAsync([]),
    );

    const service = mocks.factory();

    // Act
    const result = await service.updateDataPermissions(
      consentContractAddress1,
      new DataPermissions(newPermissionsHex),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(ConsentError);
    mocks.contextProvider.assertEventCounts({
      onDataPermissionsUpdated: 0,
    });
  });

  test("No consent token but invitation exists in persistence, removes invite from persistence, fails", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();

    td.when(mocks.consentRepo.getConsentToken(acceptedInvitation)).thenReturn(
      okAsync(null),
    );

    const service = mocks.factory();

    // Act
    const result = await service.updateDataPermissions(
      consentContractAddress1,
      new DataPermissions(newPermissionsHex),
    );

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeTruthy();
    const err = result._unsafeUnwrapErr();
    expect(err).toBeInstanceOf(ConsentError);
    mocks.contextProvider.assertEventCounts({
      onDataPermissionsUpdated: 0,
    });
  });
});
