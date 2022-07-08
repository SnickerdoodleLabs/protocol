import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  EVMAccountAddress,
  EVMPrivateKey,
  IConfigOverrides,
  InvalidSignatureError,
  LanguageCode,
  PersistenceError,
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
    defaultInsightPlatformBaseUrl: "http://localhost:3000",
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
          {
            name: "Insight Platform Simulator",
            value: "simulator",
          },
          new inquirer.Separator(),
          { name: "Exit", value: "exit" },
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
  return ResultAsync.fromPromise(
    inquirer.prompt([
      {
        type: "list",
        name: "core",
        message: "Please select a course of action:",
        choices: [
          { name: "Unlock", value: "unlock" },
          { name: "Add Account", value: "addAccount" },
          new inquirer.Separator(),
          { name: "Set Age", value: "setAge" },
          { name: "Get Age", value: "getAge" },
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel" },
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
    switch (answers.core) {
      case "unlock":
        return unlockCore(accountAddress, accountPrivateKey);
      case "addAccount":
        return addAccount(accountAddress, accountPrivateKey);
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
  | UnsupportedLanguageError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | PersistenceError
  | InvalidSignatureError
  | AjaxError
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
    });
}

function addAccount(
  account: EVMAccountAddress,
  privateKey: EVMPrivateKey,
): ResultAsync<
  void,
  | UnsupportedLanguageError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | PersistenceError
  | InvalidSignatureError
  | AjaxError
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
