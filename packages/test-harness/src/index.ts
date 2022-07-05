import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  Age,
  BlockchainProviderError,
  EVMAccountAddress,
  EVMPrivateKey,
  InvalidSignatureError,
  LanguageCode,
  PersistenceError,
  UnsupportedLanguageError,
} from "@snickerdoodlelabs/objects";
import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";
import inquirer from "inquirer";
import { okAsync, ResultAsync } from "neverthrow";

// https://github.com/SBoudrias/Inquirer.js

const persistence = new LocalStoragePersistence();
const core = new SnickerdoodleCore(undefined, persistence);
const cryptoUtils = new CryptoUtils();
const languageCode = LanguageCode("en");
const accountPrivateKey = EVMPrivateKey(
  "0x0123456789012345678901234567890123456789012345678901234567890123",
);
const accountAddress = EVMAccountAddress(
  "0x14791697260E4c9A71f18484C9f997B308e59325",
);

await core.getEvents().map(async (events) => {
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
  while (1) {
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
          { name: "Unlock", value: "unlock", short: "u" },
          new inquirer.Separator(),
          { name: "Set Age", value: "setAge", short: "s" },
          new inquirer.Separator(),
          { name: "Get Age", value: "getAge", short: "g" },
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
      case "exit":
        process.exit(0);
      case "unlock":
        console.log(`Unlocked!`);
        return unlockCore(accountAddress, accountPrivateKey);
      case "setAge":
        console.log("Age is set to 15");
        return core.setAge(Age(15));
      case "getAge":
        return core.getAge().map(console.log);
    }
    return okAsync(undefined);
  });
}

function unlockCore(
  account: EVMAccountAddress,
  privateKey: EVMPrivateKey,
): ResultAsync<
  void,
  | BlockchainProviderError
  | InvalidSignatureError
  | UnsupportedLanguageError
  | PersistenceError
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
    });
}
