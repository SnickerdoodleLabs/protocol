import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { DomainName, EChain, EVMContractAddress, EVMPrivateKey, IConfigOverrides, LanguageCode, MetatransactionSignatureRequest, PageInvitation, Signature, SolanaPrivateKey, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";
import { BlockchainStuff, IPFSClient } from "@test-harness/utilities/index.js";
import { InsightPlatformSimulator } from "@test-harness/mocks/InsightPlatformSimulator.js";
import { FakeDBVolatileStorage } from "@snickerdoodlelabs/persistence";
import { ResultAsync } from "neverthrow";
import { BigNumber } from "ethers";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";

export class TestHarnessMocks {

    public cryptoUtils = new CryptoUtils();

    public fakeDBVolatileStorage = new FakeDBVolatileStorage();


    // https://github.com/SBoudrias/Inquirer.js
    public core = new SnickerdoodleCore(
        {
            defaultInsightPlatformBaseUrl: "http://localhost:3006",
            dnsServerAddress: "http://localhost:3006/dns",
        } as IConfigOverrides,
        undefined,
        this.fakeDBVolatileStorage,
    );

    public devAccountKeys = [
        new TestWallet(
            EChain.LocalDoodle,
            EVMPrivateKey(
                "0x0123456789012345678901234567890123456789012345678901234567890123",
            ),
            this.cryptoUtils,
        ),
        new TestWallet(
            EChain.LocalDoodle,
            EVMPrivateKey(
                "0x1234567890123456789012345678901234567890123456789012345678901234",
            ),
            this.cryptoUtils,
        ),
        new TestWallet(
            EChain.LocalDoodle,
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
    ];

    public blockchain = new BlockchainStuff(this.devAccountKeys);
    public ipfs = new IPFSClient();

    public insightSimulator = new InsightPlatformSimulator(this.blockchain, this.ipfs);
    public languageCode = LanguageCode("en");

    public domainName = DomainName("snickerdoodle.com");
    public domainName2 = DomainName("snickerdoodle.com/blog");
    public domainName3 = DomainName("snickerdoodle-protocol.snickerdoodle.dev");
    public domainName4 = DomainName("snickerdoodle-protocol.snickerdoodle.com");

    public consentContracts = new Array<EVMContractAddress>();
    public acceptedInvitations = new Array<PageInvitation>();

    

}