import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  CohortInvitation,
  ConsentContractError,
  ConsentContractRepositoryError,
  DomainName,
  EInvitationStatus,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IConfigOverrides,
  InvalidSignatureError,
  LanguageCode,
  PersistenceError,
  TokenId,
  UninitializedError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { InsightPlatformSimulator } from "@test-harness/InsightPlatformSimulator";

// https://github.com/SBoudrias/Inquirer.js

const persistence = new LocalStoragePersistence();
const core = new SnickerdoodleCore(
  {
    defaultInsightPlatformBaseUrl: "http://localhost:3006",
  } as IConfigOverrides,
  persistence,
);

const simulator = new InsightPlatformSimulator();
const cryptoUtils = new CryptoUtils();
const languageCode = LanguageCode("en");
const accountPrivateKey = EVMPrivateKey(
  "0x0123456789012345678901234567890123456789012345678901234567890123",
);
const accountAddress = EVMAccountAddress(
  "0x14791697260E4c9A71f18484C9f997B308e59325",
);
const domainName = DomainName("snickerdoodle.dev");

const cohortInvitation = new CohortInvitation(
  domainName,
  EVMContractAddress("0x93fb1De05a05350b10F93b07533533709AdB3347"),
  TokenId(BigInt(123)),
  null,
);

let unlocked = false;

core.getEvents().map(async (events) => {
  events.onAccountAdded.subscribe((addedAccount) => {
    console.log(`Added account: ${addedAccount}`);
  });

  events.onInitialized.subscribe((dataWalletAddress) => {
    console.log(`Initialized with address ${dataWalletAddress}`);
  });

  events.onQueryPosted.subscribe((query) => {
    console.log(`Query posted`, query);
  });

  events.onMetatransactionSignatureRequested.subscribe((request) => {
    console.log(`Metadata Transaction Requested`);

    
  })

  // Main event prompt. Core is up and running
  while (true) {
    await mainPrompt();
  }
});

function mainPrompt(): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    inquirer.prompt([
      {
        type: "list",
        name: "main",
        message: "Please select a course of action:",
        choices: [
          { name: "Nothing", value: "nothing" },
          new inquirer.Separator(),
          { name: "Core", value: "core" },
          new inquirer.Separator(),
          {
            name: "Insight Platform Simulator",
            value: "simulator",
          },
          new inquirer.Separator(),
          { name: "Exit", value: "exit", short: "e" },
        ],
      },
    ]),
    (e) => {
      if ((e as any).isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("TtyError");
      }
      return e as Error;
    },
  ).andThen((answers) => {
    switch (answers.main) {
      case "nothing":
        console.log("Doing nothing for 1 second");
        return ResultUtils.delay(1000);
      case "exit":
        process.exit(0);
      case "core":
        return corePrompt();
      case "simulator":
        return simulatorPrompt();
    }
    return okAsync(undefined);
  });
}

function corePrompt(): ResultAsync<void, Error> {
  let choices = [
    { name: "Add Account", value: "addAccount" },
    new inquirer.Separator(),
    {
      name: "Check Invitation Status",
      value: "checkInvitationStatus",
      short: "ci",
    },
    new inquirer.Separator(),
    { name: "Set Age", value: "setAge" },
    new inquirer.Separator(),
    { name: "Get Age", value: "getAge" },
    new inquirer.Separator(),
    { name: "Cancel", value: "cancel" },
  ];

  // Only show the unlock option we are not already unlocked.
  if (!unlocked) {
    choices = [
      { name: "Unlock", value: "unlock" },
      new inquirer.Separator(),
      ...choices,
    ];
  }

  return ResultAsync.fromPromise(
    inquirer.prompt([
      {
        type: "list",
        name: "core",
        message: "Please select a course of action:",
        choices: choices,
      },
    ]),
    (e) => {
      if ((e as any).isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("TtyError");
      }
      return e as Error;
    },
  ).andThen((answers) => {
    switch (answers.core) {
      case "unlock":
        return unlockCore(accountAddress, accountPrivateKey);
      case "addAccount":
        return addAccount(accountAddress, accountPrivateKey);
      case "checkInvitationStatus":
        return checkInvitationStatus(cohortInvitation).map((status) => {
          console.log(status);
        });
      case "setAge":
        console.log("Age is set to 15");
        return core.setAge(Age(15));
      case "getAge":
        return core.getAge().map(console.log);
    }
    return okAsync(undefined);
  });
}

function simulatorPrompt(): ResultAsync<void, Error> {
  return ResultAsync.fromPromise(
    inquirer.prompt([
      {
        type: "list",
        name: "simulator",
        message: "Please select a course of action:",
        choices: [
          { name: "Post Query", value: "post", short: "p" },
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel", short: "c" },
        ],
      },
    ]),
    (e) => {
      if ((e as any).isTtyError) {
        // Prompt couldn't be rendered in the current environment
        console.log("TtyError");
      }
      return e as Error;
    },
  ).andThen((answers) => {
    switch (answers.simulator) {
      case "post":
        return simulator.postQuery();
    }
    return okAsync(undefined);
  });
}

function unlockCore(
  account: EVMAccountAddress,
  privateKey: EVMPrivateKey,
): ResultAsync<
  void,
  | PersistenceError
  | UnsupportedLanguageError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | InvalidSignatureError
  | AjaxError
  | CrumbsContractError
> {
  // Need to get the unlock message first
  return core
    .getUnlockMessage(languageCode)
    .andThen((message) => {
      // Sign the message
      return cryptoUtils.signMessage(message, privateKey);
    })
    .andThen((signature) => {
      return core.unlock(account, signature, languageCode);
    })
    .map(() => {
      console.log(`Unlocked!`);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function addAccount(
  account: EVMAccountAddress,
  privateKey: EVMPrivateKey,
): ResultAsync<
  void,
  | PersistenceError
  | UnsupportedLanguageError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | InvalidSignatureError
  | AjaxError
  | CrumbsContractError
> {
  // Need to get the unlock message first
  return core
    .getUnlockMessage(languageCode)
    .andThen((message) => {
      // Sign the message
      return cryptoUtils.signMessage(message, privateKey);
    })
    .andThen((signature) => {
      return core.unlock(account, signature, languageCode);
    })
    .map(() => {
      console.log(`Unlocked!`);
      unlocked = true;
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function checkInvitationStatus(
  invitation: CohortInvitation,
): ResultAsync<
  EInvitationStatus,
  | BlockchainProviderError
  | PersistenceError
  | UninitializedError
  | AjaxError
  | ConsentContractError
  | ConsentContractRepositoryError
> {
  // Need to get the unlock message first
  return core
    .checkInvitationStatus(invitation)
    .mapErr((e) => {
      console.log("error: ", e);
      return e;
    })
    .map((status) => {
      return status;
    });
}
