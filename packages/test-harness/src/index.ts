import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
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
  Signature,
  chainConfig,
  ChainId,
  ControlChainInformation,
  ConsentFactoryContractError,
} from "@snickerdoodlelabs/objects";
import { LocalStoragePersistence } from "@snickerdoodlelabs/persistence";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import inquirer from "inquirer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/BlockchainStuff";
import { InsightPlatformSimulator } from "@test-harness/InsightPlatformSimulator";

// https://github.com/SBoudrias/Inquirer.js

const persistence = new LocalStoragePersistence();
const core = new SnickerdoodleCore(
  {
    defaultInsightPlatformBaseUrl: "http://localhost:3006",
  } as IConfigOverrides,
  persistence,
);

const accountPrivateKey = EVMPrivateKey(
  "0x0123456789012345678901234567890123456789012345678901234567890123",
);

const blockchain = new BlockchainStuff(accountPrivateKey);

const simulator = new InsightPlatformSimulator(blockchain);
const cryptoUtils = new CryptoUtils();
const languageCode = LanguageCode("en");

const domainName = DomainName("snickerdoodle.dev");

const cohortInvitation = new CohortInvitation(
  domainName,
  EVMContractAddress("0x93fb1De05a05350b10F93b07533533709AdB3347"),
  TokenId(BigInt(123)),
  null,
);

const consentContracts = new Array<EVMContractAddress>();
const optedInConsentContracts = new Array<EVMContractAddress>();

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

  events.onMetatransactionSignatureRequested.subscribe(async (request) => {
    // This method needs to happen in nicer form in all form factors
    try {
      console.log(
        `Metadata Transaction Requested! Signer account address: ${blockchain.accountAddress}`,
        `Request account address: ${request.accountAddress}`,
      );

      // We need to get a nonce for this account address from the forwarder contract
      const nonceResult = await blockchain.minimalForwarder.getNonce(
        request.accountAddress,
      );
      if (nonceResult.isErr()) {
        throw nonceResult.error;
      }
      const nonce = nonceResult.value;

      // We need to take the types, and send it to the account signer
      const value = {
        to: request.contractAddress, // Contract address for the metatransaction
        from: request.accountAddress, // EOA to run the transaction as (linked account, not derived)
        value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
        gas: BigNumber.from(1000000), // The amount of gas to pay.
        nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
        data: request.data, // The actual bytes of the request, encoded as a hex string
      } as IMinimalForwarderRequest;

      // Get the chain info for the doodle chain
      const doodleChainConfig = chainConfig.get(
        ChainId(31337),
      ) as ControlChainInformation;

      const metatransactionSignature = Signature(
        await blockchain.accountWallet._signTypedData(
          // This domain is critical- we have to use this and not the normal Snickerdoodle domain
          getMinimalForwarderSigningDomain(
            doodleChainConfig.chainId,
            doodleChainConfig.metatransactionForwarderAddress,
          ),
          forwardRequestTypes,
          value,
        ),
      );

      console.log(
        `Metatransaction signature generated: ${metatransactionSignature}`,
      );

      request.callback(metatransactionSignature, nonce);
    } catch (e) {
      console.error(`Error signing forwarding request!`, e);
      process.exit(1);
    }
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
      name: "Opt In to Campaign",
      value: "optInCampaign",
    },
    {
      name: "Opt Out of Campaign",
      value: "optOutCampaign",
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

  return prompt([
    {
      type: "list",
      name: "core",
      message: "Please select a course of action:",
      choices: choices,
    },
  ]).andThen((answers) => {
    switch (answers.core) {
      case "unlock":
        return unlockCore(blockchain.accountAddress, accountPrivateKey);
      case "addAccount":
        return addAccount(blockchain.accountAddress, accountPrivateKey);
      case "optInCampaign":
        return optInCampaign();
      case "optOutCampaign":
        return optOutCampaign();
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
  return prompt([
    {
      type: "list",
      name: "simulator",
      message: "Please select a course of action:",
      choices: [
        { name: "Create Campaign", value: "createCampaign" },
        { name: "Post Query", value: "post" },
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ]).andThen((answers) => {
    switch (answers.simulator) {
      case "createCampaign":
        return createCampaign();
      case "post":
        return simulator.postQuery();
    }
    return okAsync(undefined);
  });
}

function createCampaign(): ResultAsync<
  void,
  ConsentFactoryContractError | ConsentContractError
> {
  return simulator
    .createCampaign(domainName)
    .mapErr((e) => {
      console.error(e);
      return e;
    })
    .map((contractAddress) => {
      consentContracts.push(contractAddress);
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

function optInCampaign(): ResultAsync<
  void,
  | Error
  | PersistenceError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | AjaxError
  | ConsentContractRepositoryError
> {
  return prompt([
    {
      type: "list",
      name: "optInCampaign",
      message: "Please choose a campaign to join:",
      choices: [
        ...consentContracts.map((contractAddress) => {
          return {
            name: `Consent Contract ${contractAddress}`,
            value: contractAddress,
          };
        }),
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ])
    .andThen((answers) => {
      const contractAddress = EVMContractAddress(answers.optInCampaign);
      if (consentContracts.includes(contractAddress)) {
        // They did not pick "cancel"
        // We need to make an invitation for ourselves
        return cryptoUtils.getTokenId().andThen((tokenId) => {
          const invitation = new CohortInvitation(
            domainName,
            contractAddress,
            tokenId,
            null,
          );

          return core
            .checkInvitationStatus(invitation)
            .andThen((invitationStatus) => {
              if (invitationStatus != EInvitationStatus.New) {
                return errAsync(
                  new Error(
                    `Invalid invitation to campaign ${contractAddress}`,
                  ),
                );
              }

              // Accept with no conditions
              return core.acceptInvitation(invitation, null);
            })
            .map(() => {
              console.log(
                `Accepted invitation to ${contractAddress}, with token Id ${tokenId}`,
              );
              optedInConsentContracts.push(contractAddress);
            });
        });
      }

      return okAsync(undefined);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function optOutCampaign(): ResultAsync<
  void,
  | Error
  | PersistenceError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | AjaxError
  | ConsentContractRepositoryError
> {
  return prompt([
    {
      type: "list",
      name: "optOutCampaign",
      message: "Please choose a campaign to opt out of:",
      choices: [
        ...optedInConsentContracts.map((contractAddress) => {
          return {
            name: `Consent Contract ${contractAddress}`,
            value: contractAddress,
          };
        }),
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ])
    .andThen((answers) => {
      const contractAddress = EVMContractAddress(answers.optOutCampaign);
      if (optedInConsentContracts.includes(contractAddress)) {
        // They did not pick "cancel"
        // Opt out
        return core.leaveCohort(contractAddress).map(() => {
          console.log(`Opted out of consent contract ${contractAddress}`);

          // Remove it from the list of opted-in contracts
          const index = optedInConsentContracts.indexOf(contractAddress, 0);
          optedInConsentContracts.splice(index, 1);
        });
      }
      console.log(
        `optedInConsentContracts does not include ${contractAddress}`,
      );

      return okAsync(undefined);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function prompt(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: inquirer.QuestionCollection<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): ResultAsync<any, never> {
  return ResultAsync.fromPromise(inquirer.prompt(questions), (e) => {
    if ((e as any).isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("TtyError");
    }
    return e as Error;
  }).orElse((e) => {
    // Swallow the error, returns an empty answer
    return okAsync({});
  });
}
