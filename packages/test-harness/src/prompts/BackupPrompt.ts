import {
  BigNumberString,
  ChainId,
  CountryCode,
  DataWalletBackupID,
  EarnedReward,
  ERewardType,
  EVMAccountAddress,
  EVMTransaction,
  EVMTransactionHash,
  Gender,
  IpfsCID,
  SiteVisit,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import { GoogleCloudStorage } from "@snickerdoodlelabs/persistence";
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

export class BackupPrompt extends DataWalletPrompt {
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
    return okAsync(undefined);
    //     return inquiryWrapper([
    //         {
    //           type: "list",
    //           name: "backupPrompt",
    //           message: "Please select a course of action:",
    //           choices: [
    //             { name: backup, value: backup },
    //           ],
    //         },
    //       ]).andThen((answers) => {
    //         switch (answers.backupPrompt) {
    //           case backup:
    //             console.log("You selected: ", backup);
    //             return ResultUtils.delay(1000);
    //         }
    //         return okAsync(undefined);
    //       });
    // }
  }
}
