import "reflect-metadata";
import { ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  BigNumberString,
  DataWalletAddress,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  HexString,
  IDataWalletPersistence,
  InvitationDomain,
  IpfsCID,
  Signature,
  TokenId,
  UninitializedError,
  URLString,
} from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";

import {
  dataWalletAddress,
  dataWalletKey,
  externalAccountAddress1,
  consentContractAddress1,
  defaultInsightPlatformBaseUrl,
} from "@core-tests/mock/mocks/commonValues.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities";
import { InvitationService } from "@core/implementations/business/index.js";
import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IDNSRepository,
  IInvitationRepository,
  IMetatransactionForwarderRepository,
} from "@core/interfaces/data/index.js";
import { IContextProvider } from "@core/interfaces/utilities/index.js";

const metatransactionNonce = BigNumberString("nonce");
const metatransactionValue = BigNumberString("value");
const metatransactionGas = BigNumberString("gas");
const optInCallData = HexString("0xOptIn");
const optOutCallData = HexString("0xOptOut");
const optInSignature = Signature("OptInSignature");
const optOutSignature = Signature("OptOutSignature");
const domain = DomainName("phoebe.com");
const url1 = URLString("phoebe.com/cute");
const url2 = URLString("phoebe.com/loud");
const ipfsCID = IpfsCID("ipfscid");
const tokenId1 = TokenId(BigInt(13));
const tokenId2 = TokenId(BigInt(69));

const invitationDomain = new InvitationDomain(
  domain,
  "Domain Title",
  "Domain Description",
  URLString("Image"),
  "RewardName",
  URLString("nftClaimedImage"),
);

class InvitationServiceMocks {
  public persistenceRepo: IDataWalletPersistence;
  public consentRepo: IConsentContractRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public dnsRepository: IDNSRepository;
  public invitationRepo: IInvitationRepository;
  public forwarderRepo: IMetatransactionForwarderRepository;
  public cryptoUtils: ICryptoUtils;
  public contextProvider: IContextProvider;
  public configProvider: ConfigProviderMock;

  public constructor() {
    this.persistenceRepo = td.object<IDataWalletPersistence>();
    this.consentRepo = td.object<IConsentContractRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.dnsRepository = td.object<IDNSRepository>();
    this.invitationRepo = td.object<IInvitationRepository>();
    this.forwarderRepo = td.object<IMetatransactionForwarderRepository>();
    this.contextProvider = new ContextProviderMock();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.configProvider = new ConfigProviderMock();

    td.when(
      this.insightPlatformRepo.executeMetatransaction(
        dataWalletAddress,
        EVMAccountAddress(dataWalletAddress),
        consentContractAddress1,
        metatransactionNonce,
        metatransactionValue,
        metatransactionGas,
        optInCallData,
        optInSignature,
        dataWalletKey,
        defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));

    td.when(this.dnsRepository.fetchTXTRecords(domain)).thenReturn(
      okAsync([`"${consentContractAddress1}"`]),
    );

    td.when(
      this.consentRepo.getInvitationUrls(consentContractAddress1),
    ).thenReturn(okAsync([url1, url2]));
    td.when(
      this.consentRepo.getMetadataCID(consentContractAddress1),
    ).thenReturn(okAsync(ipfsCID));

    td.when(
      this.invitationRepo.getInvitationDomainByCID(ipfsCID, domain),
    ).thenReturn(okAsync(invitationDomain));

    // Will return different nonces each time, just in case
    td.when(this.cryptoUtils.getTokenId()).thenReturn(
      okAsync(tokenId1),
      okAsync(tokenId2),
    );
  }

  public factory(): IInvitationService {
    return new InvitationService(
      this.persistenceRepo,
      this.consentRepo,
      this.insightPlatformRepo,
      this.dnsRepository,
      this.invitationRepo,
      this.forwarderRepo,
      this.cryptoUtils,
      this.contextProvider,
      this.configProvider,
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
});
