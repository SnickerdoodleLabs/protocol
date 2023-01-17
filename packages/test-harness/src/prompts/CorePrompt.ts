import {
  AESEncryptedString,
  Age,
  BigNumberString,
  ChainId,
  CountryCode,
  EarnedReward,
  EncryptedString,
  ERewardType,
  EVMAccountAddress,
  EVMTransaction,
  EVMTransactionHash,
  Gender,
  IDataWalletBackup,
  InitializationVector,
  IpfsCID,
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { Environment } from "@test-harness/mocks/Environment.js";
import { AddAccount } from "@test-harness/prompts/AddAccount.js";
import { CheckAccount } from "@test-harness/prompts/CheckAccount.js";
import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { OptInCampaign } from "@test-harness/prompts/OptInCampaign.js";
import { OptOutCampaign } from "@test-harness/prompts/OptOutCampaign.js";
import { RemoveAccount } from "@test-harness/prompts/RemoveAccount.js";
import { SelectProfile } from "@test-harness/prompts/SelectProfile.js";
import { UnlockCore } from "@test-harness/prompts/UnlockCore.js";
export class CorePrompt extends DataWalletPrompt {
  private unlockCore: UnlockCore;
  private addAccount: AddAccount;
  private checkAccount: CheckAccount;
  private removeAccount: RemoveAccount;
  private optInCampaign: OptInCampaign;
  private optOutCampaign: OptOutCampaign;

  private selectProfile: SelectProfile;

  public constructor(public env: Environment) {
    super(env);

    this.unlockCore = new UnlockCore(this.env);
    this.addAccount = new AddAccount(this.env);
    this.checkAccount = new CheckAccount(this.env);
    this.removeAccount = new RemoveAccount(this.env);
    this.optInCampaign = new OptInCampaign(this.env);
    this.optOutCampaign = new OptOutCampaign(this.env);
    this.selectProfile = new SelectProfile(this.env);
  }

  public start(): ResultAsync<void, Error> {
    console.log(
      "Starting core prompt with unlock state:",
      this.profile.unlocked,
    );

    const choicesWhenUnlocked = [
      { name: "Add Account", value: "addAccount" },
      { name: "Remove Account", value: "removeAccount" },
      { name: "Check Account", value: "checkAccount" },
      new inquirer.Separator(),
      {
        name: "Opt In to Campaign",
        value: "optInCampaign",
      },
      {
        name: "Opt Out of Campaign",
        value: "optOutCampaign",
      },
      new inquirer.Separator(),
      { name: "Add AccountBalance - ETH", value: "Add AccountBalance - ETH" },
      { name: "Add AccountBalance - SOL", value: "Add AccountBalance - SOL" },
      { name: "Set Age to 15", value: "setAge to 15" },
      { name: "Set Age to 0", value: "setAge to 0" },
      { name: "Get Age", value: "getAge" },
      { name: "Set Location", value: "setLocation" },
      { name: "Get Location", value: "getLocation" },
      { name: "Set Gender", value: "setGender" },
      { name: "Get Gender", value: "getGender" },
      { name: "Get Transactions", value: "getTransactions" },
      { name: "Get Accounts", value: "getAccounts" },
      { name: "Get NFTs", value: "getNFTs" },
      { name: "Get Balances", value: "getBalances" },
      { name: "Get Transaction Map", value: "getTransactionMap" },
      { name: "Get SiteVisit Map", value: "getSiteVisitMap" },
      { name: "Get SiteVisits Array", value: "getSiteVisits" },
      new inquirer.Separator(),
      {
        name: "Add EVM Transaction - Google",
        value: "addEVMTransaction - google",
      },
      {
        name: "Add EVM Transaction - Query's Network",
        value: "addEVMTransaction - Query's Network",
      },
      { name: "Add Site Visit - Google ", value: "addSiteVisit - google" },
      { name: "Add Site Visit - Facebook", value: "addSiteVisit - facebook" },

      { name: "Add Earned Reward", value: "addEarnedReward" },
      { name: "Get Earned Rewards", value: "getEarnedRewards" },
      new inquirer.Separator(),
      { name: "dump backup", value: "dumpBackup" },
      { name: "restore backup", value: "restoreBackup" },
      { name: "manual backup", value: "manualBackup" },
      { name: "clear cloud store", value: "clearCloudStore" },
    ];

    let choices = [
      { name: "NOOP", value: "NOOP" },
      { name: "Switch Profile", value: "selectProfile" },
      new inquirer.Separator(),
      ...choicesWhenUnlocked,
      new inquirer.Separator(),
      { name: "Cancel", value: "cancel" },
      new inquirer.Separator(),
    ];

    // Only show the unlock option we are not already unlocked.
    if (!this.profile.unlocked) {
      choices = [
        { name: "NOOP", value: "NOOP" },
        { name: "Select Profile", value: "selectProfile" },
        { name: "Unlock", value: "unlock" },
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
        new inquirer.Separator(),
      ];
    }

    return inquiryWrapper([
      {
        type: "list",
        name: "core",
        message: "Please select a course of action:",
        choices: choices,
      },
    ]).andThen((answers) => {
      const sites: SiteVisit[] = [];
      const transactions: EVMTransaction[] = [];
      const earnedReward = new EarnedReward(
        IpfsCID("LazyReward"),
        "Dummy reward name",
        IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
        "dummy desc",
        ERewardType.Lazy,
      );

      switch (answers.core) {
        case "NOOP": // this is super important as we have the accept query appearing from another thread
          return okAsync(undefined);
        case "unlock":
          return this.unlockCore.start();
        case "selectProfile":
          return this.selectProfile.start();

        case "addAccount":
          return this.addAccount.start();

        case "checkAccount":
          return this.checkAccount.start();
        case "removeAccount":
          return this.removeAccount.start();
        case "optInCampaign":
          return this.optInCampaign.start();
        case "optOutCampaign":
          return this.optOutCampaign.start();
        case "setAge to 15":
          console.log("Age is set to 15");
          this.core.setAge(Age(15));
          //Mon Jan 13 2020 08:22:13 GMT+0000
          return this.core.setBirthday(UnixTimestamp(1578903733));
        case "setAge to 0":
          console.log("Age is set to 0");
          return this.core.setAge(Age(0));
        case "getAge":
          return this.core.getAge().map(console.log);
        case "setGender":
          console.log("Gender is set to male");
          return this.core.setGender(Gender("male"));
        case "getAge":
          return this.core.getGender().map(console.log);
        case "setLocation":
          console.log("Location Country Code is US");
          return this.core.setLocation(CountryCode("US"));
        case "getLocation":
          return this.core.getLocation().map(console.log);
        case "getTransactions":
          return this.core.getTransactions().map(console.log);
        case "getAccounts":
          return this.core.getAccounts().map(console.log);
        case "getNFTs":
          return this.core.getAccountNFTs().map(console.log);
        case "getBalances":
          return this.core.getAccountBalances().map(console.log);
        // case "getTransactionMap":
        //   return this.core.getTransactionValueByChain().map(console.log);
        case "getSiteVisitMap":
          return this.core.getSiteVisitsMap().map(console.log);
        case "getSiteVisits":
          return this.core.getSiteVisits().map(console.log);
        case "addEarnedReward":
          return this.core.addEarnedRewards([earnedReward]).map(console.log);
        case "getEarnedRewards":
          return this.core.getEarnedRewards().map(console.log);
        case "addEVMTransaction - Query's Network":
          /*
                Important!  Must use different hash values for transaction values!
              */
          transactions[0] = new EVMTransaction(
            ChainId(43113),
            EVMTransactionHash("firstHash"),
            UnixTimestamp(100),
            null,
            EVMAccountAddress("send200"),
            EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
            BigNumberString("200"),
            null,
            null,
            null,
            null,
            null,
            null,
          );
          transactions[1] = new EVMTransaction(
            ChainId(43113),
            EVMTransactionHash("secondHash"),
            UnixTimestamp(100),
            null,
            EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
            EVMAccountAddress("get1000"),
            BigNumberString("1000"),
            null,
            null,
            null,
            null,
            null,
            null,
          );
          transactions[2] = new EVMTransaction(
            ChainId(43113),
            EVMTransactionHash("thirdHash"),
            UnixTimestamp(100),
            null,
            EVMAccountAddress("send300"),
            EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
            BigNumberString("300"),
            null,
            null,
            null,
            null,
            null,
            null,
          );
          transactions[3] = new EVMTransaction(
            ChainId(43113),
            EVMTransactionHash("fourthHash"),
            UnixTimestamp(100),
            null,
            EVMAccountAddress("send50"),
            EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
            BigNumberString("50"),
            null,
            null,
            null,
            null,
            null,
            null,
          );

          // {chainId\":43113,
          // \"outgoingValue\":\"0\",\"outgoingCount\":\"0\",\"incomingValue\":\"1000\",\"incomingCount\":\"1\"
          console.log(
            `adding ${transactions.length} transactions for chain 43113`,
          );
          return this.core.addTransactions(transactions).map(console.log);
        case "addEVMTransaction - google":
          transactions[0] = new EVMTransaction(
            ChainId(1),
            EVMTransactionHash("null"),
            UnixTimestamp(100),
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          );
          return this.core.addTransactions(transactions).map(console.log);
        case "addSiteVisit - google":
          sites[0] = new SiteVisit(
            URLString("www.google.com"),
            UnixTimestamp(100),
            UnixTimestamp(1000),
          );
          return this.core.addSiteVisits(sites).map(console.log);
        case "addSiteVisit - facebook":
          sites[0] = new SiteVisit(
            URLString("www.facebook.com"),
            UnixTimestamp(100),
            UnixTimestamp(1000),
          );
          return this.core.addSiteVisits(sites).map(console.log);
        case "restoreBackup":
          const backup: IDataWalletBackup = {
            header: {
              hash: "$argon2id$v=19$m=4096,t=3,p=1$ChlKcS/rZO9dhyS9h+YiHA$yAqqsYNGAhfRMWMU0FmITwKmrw3kIEZcmG2RwJW25gA",
              timestamp: UnixTimestamp(1661451654712),
              signature:
                "0x91b3f61b2d1a7da6dc8a8a74037351b4f7d8c09b9844c004828dd9de7da7977e69e7350a13d324df050ace9bb625530e00884a94acc7ec307270ce4488225c4a1c",
            },
            blob: new AESEncryptedString(
              EncryptedString(
                "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",
              ),
              InitializationVector("xR+uHr2nJ3CfL0md"),
            ),
          };
          return this.core
            .restoreBackup(backup)
            .andThen(() =>
              okAsync(console.log("restored backup", backup.header.hash)),
            );
        case "manualBackup":
          return this.core.postBackups().map(console.log);
        case "clearCloudStore":
          return this.core.clearCloudStore().map(console.log);
      }
      return okAsync(undefined);
    });
  }
}
