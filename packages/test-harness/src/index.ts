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
} from "@snickerdoodlelabs/objects";
import { BigNumber } from "ethers";
import inquirer from "inquirer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/BlockchainStuff.js";
import { InsightPlatformSimulator } from "@test-harness/InsightPlatformSimulator.js";
import { IPFSClient } from "@test-harness/IPFSClient.js";
import { query1, query2 } from "@test-harness/queries/index.js";
import { TestWallet } from "@test-harness/TestWallet.js";
import { EarnedReward } from "@snickerdoodlelabs/objects";
import { IpfsCID } from "@snickerdoodlelabs/objects";
import { ERewardType } from "@snickerdoodlelabs/objects";

const cryptoUtils = new CryptoUtils();

// https://github.com/SBoudrias/Inquirer.js
const core = new SnickerdoodleCore({
  defaultInsightPlatformBaseUrl: "http://localhost:3006",
  dnsServerAddress: "http://localhost:3006/dns",
} as IConfigOverrides);

const devAccountKeys = [
  new TestWallet(
    EChain.LocalDoodle,
    EVMPrivateKey(
      "0x0123456789012345678901234567890123456789012345678901234567890123",
    ),
    cryptoUtils,
  ),
  new TestWallet(
    EChain.LocalDoodle,
    EVMPrivateKey(
      "0x1234567890123456789012345678901234567890123456789012345678901234",
    ),
    cryptoUtils,
  ),
  new TestWallet(
    EChain.LocalDoodle,
    EVMPrivateKey(
      "cd34642d879fe59110689ff87a080aad52b383daeb5ad945fd6da20b954d2542",
    ),
    cryptoUtils,
  ),
  new TestWallet(
    EChain.Solana,
    SolanaPrivateKey(
      "3UVXV4k4zErpzsjQLsJR3Ee1x1RJgZptbZrGuVZxribdhJvKGbkbGBzWD8b8ZYwjLDrcTJJdYwKX7Z7TDapnvhKG",
    ),
    cryptoUtils,
  ),
  new TestWallet(
    EChain.Solana,
    SolanaPrivateKey(
      "2r6dcz3uhSoqGnnpvFhj6Fp6bRmAoZxiBifj6UXh8AgXteVMa8So69Pp39tM9DXD2KLpFuGaaD2CBNA6Mbz8agKn",
    ),
    cryptoUtils,
  ),
];

const blockchain = new BlockchainStuff(devAccountKeys);
const ipfs = new IPFSClient();

const simulator = new InsightPlatformSimulator(blockchain, ipfs);
const languageCode = LanguageCode("en");

const domainName = DomainName("snickerdoodle.com");
const domainName2 = DomainName("snickerdoodle.com/blog");
const domainName3 = DomainName("snickerdoodle-protocol.snickerdoodle.dev");
const domainName4 = DomainName("snickerdoodle-protocol.snickerdoodle.com");

const consentContracts = new Array<EVMContractAddress>();
const acceptedInvitations = new Array<PageInvitation>();

let unlocked = false;

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
  while (true) {
    await mainPrompt();
  }
});

function mainPrompt(): ResultAsync<void, Error> {
  return prompt([
    {
      type: "list",
      name: "main",
      message: "Please select a course of action:",
      choices: [
        { name: "Core", value: "core" },
        new inquirer.Separator(),
        {
          name: "Insight Platform Simulator",
          value: "simulator",
        },
        new inquirer.Separator(),
        { name: "Nothing", value: "nothing" },
        { name: "Exit", value: "exit", short: "e" },
      ],
    },
  ]).andThen((answers) => {
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

    { name: "Add Earned Award", value: "addEarnedAward"},
    { name: "Get Earned Awards", value: "getEarnedAwards"},
    new inquirer.Separator(),
    { name: "dump backup", value: "dumpBackup" },
    { name: "restore backup", value: "restoreBackup" },
    { name: "manual backup", value: "manualBackup"},
    new inquirer.Separator(),
    { name: "Cancel", value: "cancel" },
    new inquirer.Separator(),
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
    const sites: SiteVisit[] = [];
    const transactions: EVMTransaction[] = [];
    const earnedReward = new EarnedReward(IpfsCID("LazyReward"), ERewardType.Lazy);

    switch (answers.core) {
      case "unlock":
        return unlockCore();
      case "addAccount":
        return addAccount();
      case "checkAccount":
        return checkAccount();
      case "removeAccount":
        return removeAccount();
      case "optInCampaign":
        return optInCampaign();
      case "optOutCampaign":
        return optOutCampaign();
      case "setAge to 15":
        console.log("Age is set to 15");
        return core.setAge(Age(15));
      case "setAge to 0":
        console.log("Age is set to 0");
        return core.setAge(Age(0));
      case "getAge":
        return core.getAge().map(console.log);
      case "setGender":
        console.log("Gender is set to male");
        return core.setGender(Gender("male"));
      case "getAge":
        return core.getGender().map(console.log);
      case "setLocation":
        console.log("Location Country Code is US");
        return core.setLocation(CountryCode("US"));
      case "getLocation":
        return core.getLocation().map(console.log);
      case "getTransactions":
        return core.getTransactions().map(console.log);
      case "getAccounts":
        return core.getAccounts().map(console.log);
      case "getNFTs":
        return core.getAccountNFTs().map(console.log);
      case "getBalances":
        return core.getAccountBalances().map(console.log);
      case "getTransactionMap":
        return core.getTransactionsArray().map(console.log);
      case "getSiteVisitMap":
        return core.getSiteVisitsMap().map(console.log);
      case "getSiteVisits":
        return core.getSiteVisits().map(console.log);
              
      case "addEarnedAward":
        return core.addEarnedReward(earnedReward).map(console.log);
        
      case "getEarnedAwards":
        return core.getEarnedRewards().map(console.log);  
      case "addEVMTransaction - Query's Network":
        /*
          Important!  Must use different hash values for transaction values!
        */
        transactions[0] = new EVMTransaction(
          ChainId(43113),
          "firstHash",
          UnixTimestamp(100),
          null,
          EVMAccountAddress("send200"),
          EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
          BigNumberString("200"),
          null,
          null,
          null,
          null,
          Math.random() * 1000,
        );
        transactions[1] = new EVMTransaction(
          ChainId(43113),
          "secondHash",
          UnixTimestamp(100),
          null,
          EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
          EVMAccountAddress("get1000"),
          BigNumberString("1000"),
          null,
          null,
          null,
          null,
          Math.random() * 1000,
        );
        transactions[2] = new EVMTransaction(
          ChainId(43113),
          "thirdHash",
          UnixTimestamp(100),
          null,
          EVMAccountAddress("send300"),
          EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
          BigNumberString("300"),
          null,
          null,
          null,
          null,
          Math.random() * 1000,
        );
        transactions[3] = new EVMTransaction(
          ChainId(43113),
          "fourthHash",
          UnixTimestamp(100),
          null,
          EVMAccountAddress("send50"),
          EVMAccountAddress("0x14791697260E4c9A71f18484C9f997B308e59325"),
          BigNumberString("50"),
          null,
          null,
          null,
          null,
          Math.random() * 1000,
        );

        // {chainId\":43113,
        // \"outgoingValue\":\"0\",\"outgoingCount\":\"0\",\"incomingValue\":\"1000\",\"incomingCount\":\"1\"
        console.log(`adding ${transactions.length} transactions for chain 43113`)
        return core.addEVMTransactions(transactions).map(console.log);
      case "addEVMTransaction - google":
        transactions[0] = new EVMTransaction(
          ChainId(1),
          "null",
          UnixTimestamp(100),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          Math.random() * 1000,
        );
        return core.addEVMTransactions(transactions).map(console.log);
      case "addSiteVisit - google":
        sites[0] = new SiteVisit(
          URLString("www.google.com"),
          UnixTimestamp(100),
          UnixTimestamp(1000),
        );
        return core.addSiteVisits(sites).map(console.log);
      case "addSiteVisit - facebook":
        sites[0] = new SiteVisit(
          URLString("www.facebook.com"),
          UnixTimestamp(100),
          UnixTimestamp(1000),
        );
        return core.addSiteVisits(sites).map(console.log);
      case "dumpBackup":
        return core.dumpBackup().map(console.log);
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
        return core
          .restoreBackup(backup)
          .andThen(() =>
            okAsync(console.log("restored backup", backup.header.hash)),
          );
      case "manualBackup":
        return core.postBackup().map(console.log);
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
        { name: "Set Max Capacity", value: "setMaxCapacity" },
        new inquirer.Separator(),
        { name: "Cancel", value: "cancel" },
      ],
    },
  ]).andThen((answers) => {
    switch (answers.simulator) {
      case "createCampaign":
        return createCampaign();
      case "post":
        return postQuery();
      case "setMaxCapacity":
        return setMaxCapacity();
    }
    return okAsync(undefined);
  });
}

function createCampaign(): ResultAsync<
  void,
  ConsentFactoryContractError | ConsentContractError | Error
> {
  return simulator
    .createCampaign([domainName, domainName2, domainName3, domainName4])
    .mapErr((e) => {
      console.error(e);
      return e;
    })
    .map((contractAddress) => {
      consentContracts.push(contractAddress);
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
      unlocked = true;
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
