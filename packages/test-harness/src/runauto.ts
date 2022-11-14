import "reflect-metadata";
import process from "node:process";

import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
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
  UninitializedError,
  UnsupportedLanguageError,
  ChainId,
  ConsentFactoryContractError,
  CountryCode,
  SDQLString,
  PageInvitation,
  SiteVisit,
  URLString,
  UnixTimestamp,
  Gender,
  SDQLQueryRequest,
  EVMTransaction,
  AESEncryptedString,
  EncryptedString,
  InitializationVector,
  IDataWalletBackup,
  MinimalForwarderContractError,
  EChain,
  SolanaPrivateKey,
  MetatransactionSignatureRequest,
  BigNumberString,
  Signature,
  EarnedReward,
  IpfsCID,
  ERewardType,
} from "@snickerdoodlelabs/objects";
import { FakeDBVolatileStorage } from "@snickerdoodlelabs/persistence";
import { BigNumber } from "ethers";
import inquirer from "inquirer";
import { errAsync, Ok, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/BlockchainStuff.js";
import { InsightPlatformSimulator } from "@test-harness/InsightPlatformSimulator.js";
import { IPFSClient } from "@test-harness/IPFSClient.js";
import { query1, query2 } from "@test-harness/queries/index.js";
import { TestWallet } from "@test-harness/TestWallet.js";

const cryptoUtils = new CryptoUtils();

const fakeDBVolatileStorage = new FakeDBVolatileStorage();

// https://github.com/SBoudrias/Inquirer.js
const core = new SnickerdoodleCore(
  {
    defaultInsightPlatformBaseUrl: "http://localhost:3006",
    dnsServerAddress: "http://localhost:3006/dns",
  } as IConfigOverrides,
  undefined,
  fakeDBVolatileStorage,
);

const devAccountKeys = [
  new TestWallet(
    EChain.LocalDoodle,
    EVMPrivateKey(
      "0x0123456789012345678901234567890123456789012345678901234567890123",
    ),
    cryptoUtils,
  ),
];

const blockchain = new BlockchainStuff(devAccountKeys);
const ipfs = new IPFSClient();

const simulator = new InsightPlatformSimulator(blockchain, ipfs);
const languageCode = LanguageCode("en");

const domainName = DomainName("snickerdoodle.com");

const consentContracts = new Array<EVMContractAddress>();
const acceptedInvitations = new Array<PageInvitation>();

// let unlocked = false;

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
    process.exit(1);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

core.getEvents().map(async (events) => {
  events.onAccountAdded.subscribe((addedAccount) => {
    console.log(`Added account`);
    console.log(addedAccount);
  });

  events.onInitialized.subscribe((dataWalletAddress) => {
    console.log(`Initialized with address ${dataWalletAddress}`);
  });

  events.onQueryPosted.subscribe(async (queryRequest: SDQLQueryRequest) => {
    console.log(
      `Recieved query for consentContract ${queryRequest.consentContractAddress} with id ${queryRequest.query.cid}`,
    );

    try {
      await prompt([
        {
          type: "list",
          name: "approveQuery",
          message: "Approve running the query?",
          choices: [
            { name: "Yes", value: true },
            { name: "No", value: false },
          ],
        },
      ])
        .andThen((answers) => {
          if (!answers.approveQuery) {
            return okAsync(undefined);
          }

          return core.processQuery(
            queryRequest.consentContractAddress,
            queryRequest.query,
          );
        })
        .mapErr((e) => {
          console.error(e);
          return e;
        });
    } catch (e) {
      console.error(e);
    }
  });

  events.onMetatransactionSignatureRequested.subscribe(async (request) => {
    // This method needs to happen in nicer form in all form factors
    console.log(
      `Metadata Transaction Requested!`,
      `Request account address: ${request.accountAddress}`,
    );

    await signMetatransactionRequest(request).mapErr((e) => {
      console.error(`Error signing forwarding request!`, e);
      process.exit(1);
    });
  });

  // Main event prompt. Core is up and running
  // while (true) {
  //   await mainPrompt();
  // }
  // Changes here
  const wallet = new TestWallet(
    EChain.LocalDoodle,
    EVMPrivateKey(
      "0x0123456789012345678901234567890123456789012345678901234567890123",
    ),
    cryptoUtils,
  );

  // Step 1 Unlock
  const step1_result = await getSignatureForAccount(wallet).andThen(
    (signature) => {
      return core.unlock(
        wallet.accountAddress,
        signature,
        languageCode,
        wallet.chain,
      );
    },
  );
  console.log("Unlock Result ... :", step1_result);
  
  // Step 2 Start
  const step2_result = await createCampaign();
  console.log("Create Campaign Result :", step2_result);
});

function createCampaign(): ResultAsync<
  void,
  ConsentFactoryContractError | ConsentContractError | Error
> {
  return simulator
    .createCampaign([domainName])
    .mapErr((e) => {
      console.error(e);
      return e;
    })
    .map((contractAddress) => {
      console.log("Contract Address ", contractAddress);
      return;
    });
}

function postQuery(): ResultAsync<void, Error | ConsentContractError> {
  return prompt([
    {
      type: "list",
      name: "consentContract",
      message: "Please select a consent contract to post a query to:",
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
    {
      type: "list",
      name: "queryId",
      message: "Please select which query to post:",
      choices: [
        {
          name: `Query 1`,
          value: 1,
        },
        {
          name: `Query 2`,
          value: 2,
        },
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ])
    .andThen((answers) => {
      const contractAddress = EVMContractAddress(answers.consentContract);
      const queryId = answers.queryId;
      if (consentContracts.includes(contractAddress) && queryId != "cancel") {
        // They did not pick "cancel"
        let queryText = SDQLString("");
        if (queryId === 1) {
          queryText = SDQLString(JSON.stringify(query1));
        } else if (queryId === 2) {
          queryText = SDQLString(JSON.stringify(query2));
        }

        return simulator.postQuery(contractAddress, queryText);
      }

      return okAsync(undefined);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function setMaxCapacity(): ResultAsync<void, Error | ConsentContractError> {
  return prompt([
    {
      type: "list",
      name: "consentContract",
      message: "Please select a consent contract to set the max capacity on:",
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
    {
      type: "number",
      name: "maxCapacity",
      message: "Enter the new max capacity:",
    },
  ])
    .andThen((answers) => {
      const contractAddress = EVMContractAddress(answers.consentContract);
      const maxCapacity = Number(answers.maxCapacity);

      if (
        consentContracts.includes(contractAddress) &&
        answers.consentContract != "cancel"
      ) {
        // They did not pick "cancel"
        return blockchain.setConsentContractMaxCapacity(
          contractAddress,
          maxCapacity,
        );
      }

      return okAsync(undefined);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function unlockCore(): ResultAsync<
  void,
  | UnsupportedLanguageError
  | PersistenceError
  | AjaxError
  | BlockchainProviderError
  | UninitializedError
  | CrumbsContractError
  | InvalidSignatureError
  | MinimalForwarderContractError
> {
  return prompt([
    {
      type: "list",
      name: "unlockAccountSelector",
      message: "Which account do you want to unlock with?",
      choices: blockchain.accountWallets.map((wallet) => {
        return {
          name: wallet.getName(),
          value: wallet,
        };
      }),
    },
  ])
    .andThen((answers) => {
      const wallet = answers.unlockAccountSelector as TestWallet;
      // Need to get the unlock message first
      return getSignatureForAccount(wallet).andThen((signature) => {
        return core.unlock(
          wallet.accountAddress,
          signature,
          languageCode,
          wallet.chain,
        );
      });
    })
    .map(() => {
      console.log(`Unlocked!`);
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function addAccount(): ResultAsync<
  void,
  | UnsupportedLanguageError
  | PersistenceError
  | AjaxError
  | BlockchainProviderError
  | UninitializedError
  | CrumbsContractError
  | InvalidSignatureError
  | MinimalForwarderContractError
> {
  return core
    .getAccounts()
    .andThen((linkedAccounts) => {
      const addableAccounts = blockchain.accountWallets.filter((aw) => {
        const linkedAccount = linkedAccounts.find((la) => {
          return la.sourceAccountAddress == aw.accountAddress;
        });
        return linkedAccount == null;
      });
      return prompt([
        {
          type: "list",
          name: "addAccountSelector",
          message: "Which account do you want to add?",
          choices: addableAccounts.map((wallet) => {
            return {
              name: wallet.getName(),
              value: wallet,
            };
          }),
        },
      ]);
    })

    .andThen((answers) => {
      const wallet = answers.addAccountSelector as TestWallet;
      // Need to get the unlock message first
      return getSignatureForAccount(wallet).andThen((signature) => {
        return core.addAccount(
          wallet.accountAddress,
          signature,
          languageCode,
          wallet.chain,
        );
      });
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function removeAccount(): ResultAsync<
  void,
  | PersistenceError
  | BlockchainProviderError
  | UninitializedError
  | CrumbsContractError
  | Error
> {
  return core
    .getAccounts()
    .andThen((linkedAccounts) => {
      const removeableWallets = blockchain.accountWallets.filter((aw) => {
        const linkedAccount = linkedAccounts.find((la) => {
          return (
            la.sourceAccountAddress == EVMAccountAddress(aw.accountAddress)
          );
        });
        return linkedAccount != null;
      });
      return prompt([
        {
          type: "list",
          name: "removeAccountSelector",
          message: "Which account do you want to remove?",
          choices: [
            ...removeableWallets.map((wallet) => {
              return {
                name: wallet.getName(),
                value: wallet,
              };
            }),
            new inquirer.Separator(),
            { name: "Cancel", value: "cancel" },
          ],
        },
      ]);
    })
    .andThen((answers) => {
      if (answers.removeAccountSelector == "cancel") {
        return okAsync(undefined);
      }

      const wallet = answers.removeAccountSelector as TestWallet;

      return getSignatureForAccount(wallet)
        .andThen((signature) => {
          return core.unlinkAccount(
            wallet.accountAddress,
            signature,
            languageCode,
            wallet.chain,
          );
        })
        .map(() => {
          console.log(`Unlinked account ${wallet.getName()}`);
        });
    })
    .mapErr((e) => {
      console.error(e);
      return e;
    });
}

function checkAccount(): ResultAsync<
  void,
  | UnsupportedLanguageError
  | PersistenceError
  | AjaxError
  | BlockchainProviderError
  | UninitializedError
  | CrumbsContractError
  | InvalidSignatureError
  | MinimalForwarderContractError
> {
  return prompt([
    {
      type: "list",
      name: "checkAccountSelector",
      message: "Which account do you want to check?",
      choices: blockchain.accountWallets.map((wallet) => {
        return {
          name: wallet.getName(),
          value: wallet,
        };
      }),
    },
  ])
    .andThen((answers) => {
      const wallet = answers.checkAccountSelector as TestWallet;
      // Need to get the unlock message first
      return getSignatureForAccount(wallet)
        .andThen((signature) => {
          console.log(wallet.accountAddress, signature, wallet.chain);
          return core.getDataWalletForAccount(
            wallet.accountAddress,
            signature,
            languageCode,
            wallet.chain,
          );
        })
        .map((dataWalletAccount) => {
          console.log(
            `Data wallet account address for account ${wallet.accountAddress}: ${dataWalletAccount}`,
          );
        });
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
  return core
    .getInvitationsByDomain(domainName)
    .andThen((invitations) => {
      return prompt([
        {
          type: "list",
          name: "optInCampaign",
          message: "Please choose an invitation to accept:",
          choices: [
            ...invitations.map((invitation) => {
              return {
                name: `${invitation.url}`,
                value: invitation,
              };
            }),
            new inquirer.Separator(),
            { name: "Cancel", value: "cancel" },
          ],
        },
      ]).andThen((answers) => {
        if (answers.optInCampaign == "cancel") {
          return okAsync(undefined);
        }
        const invitation = answers.optInCampaign as PageInvitation;

        // Show the invitation details, like the popup would
        console.log("Invitation details:", invitation.domainDetails);

        return prompt([
          {
            type: "list",
            name: "acceptInvitation",
            message: "Accept the invitation?",
            choices: [
              {
                name: "Yes",
                value: true,
              },
              {
                name: "No",
                value: false,
              },
            ],
          },
        ]).andThen((acceptAnswers) => {
          // You can reject the invitation
          if (!acceptAnswers.acceptInvitation) {
            return okAsync(undefined);
          }

          return core
            .checkInvitationStatus(invitation.invitation)
            .andThen((invitationStatus) => {
              if (invitationStatus != EInvitationStatus.New) {
                return errAsync(
                  new Error(
                    `Invalid invitation to campaign ${invitation.invitation.consentContractAddress}`,
                  ),
                );
              }

              // Accept with no conditions
              return core.acceptInvitation(invitation.invitation, null);
            })
            .map(() => {
              console.log(
                `Accepted invitation to ${invitation.url}, with token Id ${invitation.invitation.tokenId}`,
              );
              acceptedInvitations.push(invitation);
            });
        });
      });
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
        ...acceptedInvitations.map((invitation) => {
          return {
            name: `${invitation.invitation.consentContractAddress}`,
            value: invitation,
          };
        }),
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ])
    .andThen((answers) => {
      if (answers.optOutCampaign == "cancel") {
        return okAsync(undefined);
      }
      const invitation = answers.optOutCampaign as PageInvitation;
      return core
        .leaveCohort(invitation.invitation.consentContractAddress)
        .map(() => {
          console.log(
            `Opted out of consent contract ${invitation.invitation.consentContractAddress}`,
          );

          // Remove it from the list of opted-in contracts
          const index = acceptedInvitations.indexOf(invitation, 0);
          acceptedInvitations.splice(index, 1);
        });
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
    console.log("function prompt in index.ts", e);
    // Swallow the error, returns an empty answer
    return okAsync({});
  });
}

function signMetatransactionRequest<TErr>(
  request: MetatransactionSignatureRequest<TErr>,
): ResultAsync<void, Error | TErr> {
  // This method needs to happen in nicer form in all form factors
  console.log(
    `Metadata Transaction Requested!`,
    `WARNING: This should no longer occur!`,
    `Request account address: ${request.accountAddress}`,
  );

  // We need to get a nonce for this account address from the forwarder contract
  return blockchain.minimalForwarder
    .getNonce(request.accountAddress)
    .andThen((nonce) => {
      // We need to take the types, and send it to the account signer
      const value = {
        to: request.contractAddress, // Contract address for the metatransaction
        from: request.accountAddress, // EOA to run the transaction as (linked account, not derived)
        value: BigNumber.from(request.value), // The amount of doodle token to pay. Should be 0.
        gas: BigNumber.from(request.gas), // The amount of gas to pay.
        nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
        data: request.data, // The actual bytes of the request, encoded as a hex string
      } as IMinimalForwarderRequest;

      // Get the wallet we are going to sign with
      const wallet = blockchain.getWalletForAddress(request.accountAddress);

      return wallet
        .signMinimalForwarderRequest(value)
        .andThen((metatransactionSignature) => {
          console.log(
            `Metatransaction signature generated: ${metatransactionSignature}`,
          );

          return request.callback(metatransactionSignature, nonce);
        });
    });
}

function getSignatureForAccount(
  wallet: TestWallet,
): ResultAsync<Signature, UnsupportedLanguageError> {
  return core.getUnlockMessage(languageCode).andThen((message) => {
    return wallet.signMessage(message);
  });
}
