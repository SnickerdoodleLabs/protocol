import { CommitmentWrapper, MembershipWrapper } from "@snickerdoodlelabs/circuits-sdk";
import { LogUtils, TimeUtils } from "@snickerdoodlelabs/common-utils";
import { ConfigProvider } from "@snickerdoodlelabs/core";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  DomainName,
  EChain,
  EVMPrivateKey,
  LanguageCode,
  SolanaPrivateKey,
} from "@snickerdoodlelabs/objects";
import {
  FakeDBVolatileStorage,
  VolatileStorageSchemaProvider,
} from "@snickerdoodlelabs/persistence";

import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { query1, query2, query3, query4, query5, questionnaire } from "@test-harness/queries/index.js";
import { BlockchainStuff, IPFSClient } from "@test-harness/utilities/index.js";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";

export class TestHarnessMocks {
  public cryptoUtils = new CryptoUtils();
  public configProvider = new ConfigProvider();
  public schemaProvider = new VolatileStorageSchemaProvider(
    this.configProvider,
  );
  public timeUtils = new TimeUtils();
  public logUtils = new LogUtils();

  public fakeDBVolatileStorage = new FakeDBVolatileStorage(
    this.schemaProvider,
    this.logUtils,
    this.timeUtils,
  );

  public devAccountKeys = [
    new TestWallet(
      EChain.DevDoodle,
      EVMPrivateKey(
        "0x0123456789012345678901234567890123456789012345678901234567890123",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.DevDoodle,
      EVMPrivateKey(
        "0x1234567890123456789012345678901234567890123456789012345678901234",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.DevDoodle,
      EVMPrivateKey(
        "cd34642d879fe59110689ff87a080aad52b383daeb5ad945fd6da20b954d2542",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.Solana,
      SolanaPrivateKey(
        "3UVXV4k4zErpzsjQLsJR3Ee1x1RJgZptbZrGuVZxribdhJvKGbkbGBzWD8b8ZYwjLDrcTJJdYwKX7Z7TDapnvhKG",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.Solana,
      SolanaPrivateKey(
        "2r6dcz3uhSoqGnnpvFhj6Fp6bRmAoZxiBifj6UXh8AgXteVMa8So69Pp39tM9DXD2KLpFuGaaD2CBNA6Mbz8agKn",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.EthereumMainnet,
      EVMPrivateKey(
        "636c09be68403426bfa070af9225a7318f3cf2d28384fe89f9fa62402c3ac4c0",
      ),
      this.cryptoUtils,
    ),
    new TestWallet(
      EChain.Solana,
      SolanaPrivateKey(
        "3K725hiDLnh1H6qtxD7gLhuDPwvcdWUK1KA8sqK6ekrUKpRzhFxzynvKFZgPj1QWMWS8PZm4WXFQqVUdQFYK1Z8u",
      ),
      this.cryptoUtils,
    ),
  ];

  public blockchain = new BlockchainStuff(this.devAccountKeys);
  public ipfs = new IPFSClient();
  public membershipWrapper = new MembershipWrapper();
  public commitmentWrapper = new CommitmentWrapper();

  public insightSimulator = new InsightPlatformSimulator(
    this.blockchain,
    this.ipfs,
    this.membershipWrapper,
    this.commitmentWrapper,
  );
  public languageCode = LanguageCode("en");

  public domainName = DomainName("snickerdoodle.com");
  public domainName2 = DomainName("snickerdoodle.com/blog");
  public domainName3 = DomainName("snickerdoodle-protocol.snickerdoodle.dev");
  public domainName4 = DomainName("snickerdoodle-protocol.snickerdoodle.com");

  // public consentContracts = new Array<EVMContractAddress>();
  // public acceptedInvitations = new Array<PageInvitation>();

  public query1 = query1;
  public query2 = query2;
  public query3 = query3;
  public query4 = query4;
  public query5 = query5;
  public questionnaire = questionnaire;
}
