import { ITimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  BackupFileName,
  BigNumberString,
  ChainId,
  CountryCode,
  EarnedReward,
  ERewardType,
  EVMAccountAddress,
  EVMTransaction,
  EVMTransactionHash,
  Gender,
  IpfsCID,
  ISO8601DateString,
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

import { Environment } from "@test-harness/mocks/Environment.js";
import { AddAccount } from "@test-harness/prompts/AddAccount.js";
import { DataWalletPrompt } from "@test-harness/prompts/DataWalletPrompt.js";
import { GetBearerToken } from "@test-harness/prompts/GetBearerToken.js";
import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { OptInCampaign } from "@test-harness/prompts/OptInCampaign.js";
import { OptOutCampaign } from "@test-harness/prompts/OptOutCampaign.js";
import { RemoveAccount } from "@test-harness/prompts/RemoveAccount.js";
import { SelectProfile } from "@test-harness/prompts/SelectProfile.js";

export class CorePrompt extends DataWalletPrompt {
  private addAccount: AddAccount;
  private removeAccount: RemoveAccount;
  private optInCampaign: OptInCampaign;
  private optOutCampaign: OptOutCampaign;
  private selectProfile: SelectProfile;

  public constructor(public env: Environment, protected timeUtils: ITimeUtils) {
    super(env);

    this.addAccount = new AddAccount(this.env);
    this.removeAccount = new RemoveAccount(this.env);
    this.optInCampaign = new OptInCampaign(this.env, this.timeUtils);
    this.optOutCampaign = new OptOutCampaign(this.env);
    this.selectProfile = new SelectProfile(this.env);
  }

  public start(): ResultAsync<void, Error> {
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

      {
        name: "Get Default Receiving Address",
        value: "getDefaultReceivingAddress",
      },

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

      { name: "Get Eligible Ads", value: "getEligibleAds" },

      new inquirer.Separator(),
      { name: "backup inspection", value: "backupInspection" },
      { name: "manual backup", value: "manualBackup" },
      { name: "clear cloud store", value: "clearCloudStore" },
      new inquirer.Separator(),
      { name: "Get Bearer Token", value: "getBearerToken" },
      new inquirer.Separator(),
      { name: "Metrics", value: "metrics" },
    ];

    const choices = [
      { name: "NOOP", value: "NOOP" },
      { name: "Switch Profile", value: "selectProfile" },
      new inquirer.Separator(),
      ...choicesWhenUnlocked,
      new inquirer.Separator(),
      { name: "Cancel", value: "cancel" },
      new inquirer.Separator(),
    ];

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
          return okAsync<void, never>(undefined);
        case "selectProfile":
          return this.selectProfile.start();
        case "addAccount":
          return this.addAccount.start();
        case "removeAccount":
          return this.removeAccount.start();
        case "optInCampaign":
          return this.optInCampaign.start();
        case "optOutCampaign":
          return this.optOutCampaign.start();
        case "getAge":
          return this.core.getAge().map(console.log);
        case "setGender":
          console.log("Gender is set to male");
          return this.core.setGender(Gender("male"));
        case "getGender":
          return this.core.getGender().map(console.log);
        case "setLocation":
          console.log("Location Country Code is US");
          return this.core.setLocation(CountryCode("US"));
        case "getLocation":
          return this.core.getLocation().map(console.log);
        case "getTransactions":
          return this.core.getTransactions().map(console.log);
        case "getAccounts":
          return this.core.account.getAccounts(undefined).map(console.log);
        case "getNFTs":
          return this.core.nft
            .getNfts(undefined, undefined, undefined, undefined)
            .map(console.log);
        case "getBalances":
          return this.core.getAccountBalances().map(console.log);
        case "getSiteVisitMap":
          return this.core.getSiteVisitsMap().map(console.log);
        case "getSiteVisits":
          return this.core.getSiteVisits().map(console.log);
        case "getEligibleAds":
          return this.core.getEligibleAds().map(console.log);
        case "addEarnedReward":
          return this.core.addEarnedRewards([earnedReward]).map(console.log);
        case "getEarnedRewards":
          return this.core.getEarnedRewards().map(console.log);
        case "getDefaultReceivingAddress":
          return this.core.getReceivingAddress().map(console.log);
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
            this.timeUtils.getUnixNow(),
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
            this.timeUtils.getUnixNow(),
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
            this.timeUtils.getUnixNow(),
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
            this.timeUtils.getUnixNow(),
          );
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
            this.timeUtils.getUnixNow(),
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
        case "backupInspection":
          // Set your maxChunkSize in your coreconfig to 0 or 1 in order to display chunks
          console.log("Backup source: Google");
          console.log("Chunks");
          return this.core
            .listFileNames()
            .andThen((chunks) => {
              const backupChoices = chunks.map((chunk) => {
                return new BackupChoice(chunk);
              });
              return inquiryWrapper({
                type: "list",
                name: "backupPrompt",
                message: "Please select a backup to restore:",
                choices: backupChoices,
              });
            })
            .andThen((selection) => {
              return this.core
                .fetchBackup(selection.backupPrompt)
                .andThen((output) => {
                  const backup = output[0];
                  return this.core.unpackBackupChunk(backup).andThen((blob) => {
                    const parsedBlob = JSON.parse(blob);
                    return okAsync(
                      console.log(
                        "Decrypted Backup info includes: ",
                        parsedBlob,
                      ),
                    );
                  });
                });
            });
        case "manualBackup":
          return this.core.postBackups().map(console.log);
        case "clearCloudStore":
          return this.core.clearCloudStore().map(console.log);
        case "getBearerToken":
          const getBearerToken = new GetBearerToken(this.env);
          return getBearerToken.start();
        case "metrics":
          return this.core.metrics.getMetrics(undefined).map((metrics) => {
            console.log(metrics);
          });
      }
      return okAsync<void, never>(undefined);
    });
  }
}

export class BackupChoice {
  private fileName: string;
  private backupHeader: string;

  public constructor(protected ID: BackupFileName) {
    this.fileName = ID.toString();
    this.backupHeader = this.fileName.substring(this.fileName.indexOf("/") + 1);
  }

  public get name() {
    return this.backupHeader;
  }

  public get value() {
    return this.fileName;
  }
}
