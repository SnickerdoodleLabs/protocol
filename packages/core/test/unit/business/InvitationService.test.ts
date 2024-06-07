import "reflect-metadata";
import { ILogUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  ConsentError,
  DataPermissions,
  DomainName,
  EColorMode,
  EVMContractAddress,
  HexString32,
  IUserAgreement,
  Invitation,
  IpfsCID,
  OptInInfo,
  TokenId,
  URLString,
} from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import * as td from "testdouble";

import { InvitationService } from "@core/implementations/business/index.js";
import { IInvitationService } from "@core/interfaces/business/index.js";
import {
  IConsentContractRepository,
  IDNSRepository,
  IInvitationRepository,
  ILinkedAccountRepository,
} from "@core/interfaces/data/index.js";
import { IDataWalletUtils } from "@core/interfaces/utilities/index.js";
import {
  consentContractAddress1,
  dataWalletKey,
  identityNullifier,
  identityTrapdoor,
  commitment1,
  commitment1Index,
} from "@core-tests/mock/mocks/commonValues.js";
import {
  ConfigProviderMock,
  ContextProviderMock,
} from "@core-tests/mock/utilities";

const domain = DomainName("phoebe.com");
const url1 = URLString("phoebe.com/cute");
const url2 = URLString("phoebe.com/loud");
const ipfsCID = IpfsCID("ipfscid");
const tokenId1 = TokenId(BigInt(13));
const tokenId2 = TokenId(BigInt(69));
const permissionsHex = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
);
const dataPermissions = new DataPermissions("" as EVMContractAddress, [], []);
const newPermissionsHex = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000001",
);

const invitationMetadata: IUserAgreement = {
  image: URLString("ipfs://QmNhhFLpUAwdG4aGMrJUhdh8qsp8svP1RoSyPXCK4NaUjb"),
  description:
    "<p>We believe you deserve control over your own data. Here's why we're offering a new way - a better way:</p><p><br></p><ul><li><strong>Empowerment:</strong> It’s your data. We're here to ensure you retain control and ownership, always.</li><li><strong>Privacy First:</strong> Thanks to our integration with Snickerdoodle, we ensure your data remains anonymous and private by leveraging their proprietary tech and Zero-Knowledge Proofs.</li><li><strong>Enhanced Experience:</strong> Sharing your web3 data, like token balances, NFTs, and transaction history, allows you to access unique experiences tailored just for you.</li><li><strong>Exclusive Rewards:</strong> Unlock exclusive NFTs as rewards for sharing your data. It's our way of saying thanks.</li></ul><p><br></p><p> By clicking \"Continue\" you acknowledge our web3 data permissions policy and terms. Remember, your privacy is paramount to us; we've integrated with Snickerdoodle to ensure it.</p>",
  name: "Your Data, Your Choice.",
  attributes: [
    {
      trait_type: "version",
      value: 1,
    },
    {
      trait_type: "color mode",
      value: EColorMode.dark,
    },
    {
      trait_type: "title",
      value: "Your Data, Your Choice.",
    },
  ],
  brandInformation: {
    name: "Cornell Blockchain Conference 2024",
    description:
      "Cornell Blockchain Club was founded in 2017 to democratize Web3 awareness and help catalyze real-world use cases of Blockchain technology.",
    links: [],
  },
};

const acceptedInvitation = new OptInInfo(
  consentContractAddress1,
  identityNullifier,
  identityTrapdoor,
  commitment1,
);

const publicInvitation = new Invitation(
  consentContractAddress1,
  null,
  null,
  null,
);

class InvitationServiceMocks {
  public consentRepo: IConsentContractRepository;
  public insightPlatformRepo: IInsightPlatformRepository;
  public dnsRepository: IDNSRepository;
  public invitationRepo: IInvitationRepository;
  public dataWalletUtils: IDataWalletUtils;
  public cryptoUtils: ICryptoUtils;
  public contextProvider: ContextProviderMock;
  public configProvider: ConfigProviderMock;
  public logUtils: ILogUtils;
  public accountRepo: ILinkedAccountRepository;

  public constructor() {
    this.consentRepo = td.object<IConsentContractRepository>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.dnsRepository = td.object<IDNSRepository>();
    this.invitationRepo = td.object<IInvitationRepository>();
    this.contextProvider = new ContextProviderMock();
    this.dataWalletUtils = td.object<IDataWalletUtils>();
    this.cryptoUtils = td.object<ICryptoUtils>();
    this.configProvider = new ConfigProviderMock();
    this.logUtils = td.object<ILogUtils>();
    this.accountRepo = td.object<ILinkedAccountRepository>();

    td.when(this.dnsRepository.fetchTXTRecords(domain)).thenReturn(
      okAsync([`"${consentContractAddress1}"`]),
    );

    // ConsentRepo ---------------------------------------------------------------
    td.when(
      this.consentRepo.checkDomain(consentContractAddress1, domain),
    ).thenReturn(okAsync(true));
    td.when(
      this.consentRepo.getMetadataCID(consentContractAddress1),
    ).thenReturn(okAsync(ipfsCID));
    td.when(
      this.consentRepo.getCommitmentIndex(
        acceptedInvitation.consentContractAddress,
      ),
    ).thenReturn(okAsync(commitment1Index));

    // InvitationRepo -------------------------------------------------------
    td.when(this.invitationRepo.getInvitationMetadataByCID(ipfsCID)).thenReturn(
      okAsync(invitationMetadata),
    );
    td.when(this.invitationRepo.getAcceptedInvitations()).thenReturn(
      okAsync([acceptedInvitation]),
    );
    td.when(
      this.invitationRepo.addAcceptedInvitations([acceptedInvitation]),
    ).thenReturn(okAsync(undefined));
    td.when(
      this.invitationRepo.removeAcceptedInvitationsByContractAddress([
        consentContractAddress1,
      ]),
    ).thenReturn(okAsync(undefined));
    td.when(this.invitationRepo.getRejectedInvitations()).thenReturn(
      okAsync([]),
    );

    // CryptoUtils ----------------------------------------------------------
    // Will return different nonces each time, just in case
    td.when(this.cryptoUtils.getTokenId()).thenReturn(
      okAsync(tokenId1),
      okAsync(tokenId2),
    );

    // DataWalletUtils --------------------------------------------
    td.when(
      this.dataWalletUtils.deriveOptInInfo(
        consentContractAddress1,
        dataWalletKey,
      ),
    ).thenReturn(okAsync(acceptedInvitation));

    // InsightPlatformRepo -----------------------------------------------------
    td.when(
      this.insightPlatformRepo.optin(
        consentContractAddress1, // contract address
        identityTrapdoor,
        identityNullifier,
        this.configProvider.config.defaultInsightPlatformBaseUrl,
      ),
    ).thenReturn(okAsync(undefined));
  }

  public factory(): IInvitationService {
    //@ts-ignore

    return new InvitationService(
      this.consentRepo,
      this.insightPlatformRepo,
      this.dnsRepository,
      this.invitationRepo,
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
    expect(pageInvitations[0].invitationMetadata).toBe(invitationMetadata);
    expect(pageInvitations[0].invitation.businessSignature).toBeNull();
    expect(pageInvitations[0].invitation.consentContractAddress).toBe(
      consentContractAddress1,
    );
    expect(pageInvitations[0].invitation.domain).toBe(domain);
    expect(pageInvitations[0].invitation.tokenId).toBe(tokenId1);

    expect(pageInvitations[1].url).toBe(url2);
    expect(pageInvitations[1].invitationMetadata).toBe(invitationMetadata);
    expect(pageInvitations[1].invitation.businessSignature).toBeNull();
    expect(pageInvitations[1].invitation.consentContractAddress).toBe(
      consentContractAddress1,
    );
    expect(pageInvitations[1].invitation.domain).toBe(domain);
    expect(pageInvitations[1].invitation.tokenId).toBe(tokenId2);
  });
});

describe("InvitationService tests", () => {
  test("acceptInvitation() happy path with public invitation", async () => {
    // Arrange
    const mocks = new InvitationServiceMocks();
    const service = mocks.factory();

    // Act
    const result = await service.acceptInvitation(publicInvitation);

    // Assert
    expect(result).toBeDefined();
    expect(result.isErr()).toBeFalsy();

    mocks.contextProvider.assertEventCounts({
      onCohortJoined: 1,
    });
  });
});
