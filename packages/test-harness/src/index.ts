import "reflect-metadata";
import { AxiosAjaxUtils, CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore, ConfigProvider } from "@snickerdoodlelabs/core";
import {
  DefaultAccountBalances,
  DefaultAccountNFTs,
} from "@snickerdoodlelabs/indexers";
import {
  Age,
  AjaxError,
  BlockchainProviderError,
  CrumbsContractError,
  Invitation,
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
  CountryCode,
  SDQLString,
  PageInvitation,
  EVMTransactionFilter,
  SiteVisit,
  URLString,
  UnixTimestamp,
  Gender,
  SDQLQueryRequest,
  EVMTransaction,
} from "@snickerdoodlelabs/objects";
import { DataWalletPersistence } from "@snickerdoodlelabs/persistence";
import {
  forwardRequestTypes,
  getMinimalForwarderSigningDomain,
} from "@snickerdoodlelabs/signature-verification";
import { LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { BigNumber, ethers } from "ethers";
import inquirer from "inquirer";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IPFSClient } from "@extension-onboarding/packages/test-harness/src/IPFSClient";
import { BlockchainStuff } from "@test-harness/BlockchainStuff";
import { InsightPlatformSimulator } from "@test-harness/InsightPlatformSimulator";

// https://github.com/SBoudrias/Inquirer.js
const core = new SnickerdoodleCore({
  defaultInsightPlatformBaseUrl: "http://localhost:3006",
  dnsServerAddress: "http://localhost:3006/dns",
} as IConfigOverrides);

const devAccountKeys = [
  EVMPrivateKey(
    "0x0123456789012345678901234567890123456789012345678901234567890123",
  ),
  EVMPrivateKey(
    "0x1234567890123456789012345678901234567890123456789012345678901234",
  ),
  EVMPrivateKey(
    "cd34642d879fe59110689ff87a080aad52b383daeb5ad945fd6da20b954d2542",
  ),
];

const blockchain = new BlockchainStuff(devAccountKeys);
const ipfs = new IPFSClient();

const simulator = new InsightPlatformSimulator(blockchain, ipfs);
const cryptoUtils = new CryptoUtils();
const languageCode = LanguageCode("en");

const domainName = DomainName("snickerdoodle.com");
const domainName2 = DomainName("snickerdoodle.com/blog");
const domainName3 = DomainName("snickerdoodle-protocol.snickerdoodle.dev");
const domainName4 = DomainName("snickerdoodle-protocol.snickerdoodle.com");

const consentContracts = new Array<EVMContractAddress>();
const acceptedInvitations = new Array<PageInvitation>();

let unlocked = false;

core.getEvents().map(async (events) => {
  events.onAccountAdded.subscribe((addedAccount) => {
    console.log(`Added account: ${addedAccount}`);
  });

  events.onInitialized.subscribe((dataWalletAddress) => {
    console.log(`Initialized with address ${dataWalletAddress}`);
  });

  events.onQueryPosted.subscribe((queryRequest: SDQLQueryRequest) => {
    console.log(
      `Recieved query for consentContract ${queryRequest.consentContractAddress}`,
    );

    const queryPretty = JSON.stringify(
      JSON.parse(queryRequest.query.query),
      null,
      2,
    );
    console.log(queryPretty);
    // console.log(queryRequest.query);

    prompt([
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
  });

  events.onMetatransactionSignatureRequested.subscribe(async (request) => {
    // This method needs to happen in nicer form in all form factors
    try {
      console.log(
        `Metadata Transaction Requested!`,
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
        ChainId(31338),
      ) as ControlChainInformation;

      // Get the wallet we are going to sign with
      const wallet = blockchain.getWalletForAddress(request.accountAddress);

      const metatransactionSignature = Signature(
        await wallet._signTypedData(
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
  return prompt([
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
    switch (answers.core) {
      case "unlock":
        return unlockCore();
      case "addAccount":
        return addAccount();
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
        return core.getTransactionsMap().map(console.log);
      case "getSiteVisitMap":
        return core.getSiteVisitsMap().map(console.log);
      case "getSiteVisits":
        return core.getSiteVisits().map(console.log);
      case "addEVMTransaction - Query's Network":
        transactions[0] = new EVMTransaction(
          ChainId(43114),
          "",
          UnixTimestamp(100),
          null,
          null,
          EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
          null,
          null,
          null,
          null,
          null,
        );
        return core.addEVMTransactions(transactions).map(console.log);
      case "addEVMTransaction - google":
        transactions[0] = new EVMTransaction(
          ChainId(1),
          "",
          UnixTimestamp(100),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
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
        return postQuery();
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
          queryText = SDQLString(
            JSON.stringify({
              version: 0.1,
              description:
                "Intractions with the Avalanche blockchain for 15-year and older individuals",
              business: "Shrapnel",
              queries: {
                q1: {
                  name: "network",
                  return: "boolean",
                  chain: "AVAX",
                  contract: {
                    networkid: "43114",
                    address: "0x9366d30feba284e62900f6295bc28c9906f33172",
                    function: "Transfer",
                    direction: "from",
                    token: "ERC20",
                    blockrange: {
                      start: 13001519,
                      end: 14910334,
                    },
                  },
                },
                q2: {
                  name: "age",
                  return: "boolean",
                  conditions: {
                    ge: 15,
                  },
                },
                q3: {
                  name: "location",
                  return: "integer",
                },
                q4: {
                  name: "gender",
                  return: "enum",
                  enum_keys: ["female", "male", "nonbinary", "unknown"],
                },
                q5: {
                  name: "url_visited_count",
                  return: "object",
                  object_schema: {
                    patternProperties: {
                      "^http(s)?://[\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*/[a-zA-Z0-9]*$":
                        {
                          type: "integer",
                        },
                    },
                  },
                },
                q6: {
                  name: "chain_transaction_count",
                  return: "object",
                  object_schema: {
                    patternProperties: {
                      "^ETH|AVAX|SOL$": {
                        type: "integer",
                      },
                    },
                  },
                },
              },
              returns: {
                r1: {
                  name: "callback",
                  message: "qualified",
                },
                r2: {
                  name: "callback",
                  message: "not qualified",
                },
                r3: {
                  name: "query_response",
                  query: "q3",
                },
                r4: {
                  name: "query_response",
                  query: "q4",
                },
                r5: {
                  name: "query_response",
                  query: "q5",
                },
                r6: {
                  name: "query_response",
                  query: "q6",
                },
                url: "https://418e-64-85-231-39.ngrok.io/insights",
              },
              compensations: {
                c1: {
                  description: "10% discount code for Starbucks",
                  callback: "https://418e-64-85-231-39.ngrok.io/starbucks",
                },
                c2: {
                  description:
                    "participate in the draw to win a CryptoPunk NFT",
                  callback: "https://418e-64-85-231-39.ngrok.io/cryptopunk",
                },
                c3: {
                  description: "a free CrazyApesClub NFT",
                  callback: "https://418e-64-85-231-39.ngrok.io/crazyapesclub",
                },
              },
              logic: {
                returns: [
                  "if($q1and$q2)then$r1else$r2",
                  "$r3",
                  "$r4",
                  "$r5",
                  "$r6",
                ],
                compensations: ["if$q1then$c1", "if$q2then$c2", "if$q3then$c3"],
              },
            }),
          );
        } else if (queryId === 2) {
          console.log("Query 2 currently does not exist");
          queryText = SDQLString("{}");
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

function unlockCore(): ResultAsync<
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
  return prompt([
    {
      type: "list",
      name: "unlockAccountSelector",
      message: "Which account do you want to unlock with?",
      choices: blockchain.accountWallets.map((wallet) => {
        return {
          name: wallet.address,
          value: wallet,
        };
      }),
    },
  ])
    .andThen((answers) => {
      const wallet = answers.unlockAccountSelector as ethers.Wallet;
      // Need to get the unlock message first
      return core
        .getUnlockMessage(languageCode)
        .andThen((message) => {
          // Sign the message
          return cryptoUtils.signMessage(
            message,
            EVMPrivateKey(wallet._signingKey().privateKey),
          );
        })
        .andThen((signature) => {
          return core.unlock(
            EVMAccountAddress(wallet.address),
            signature,
            languageCode,
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
  | PersistenceError
  | UnsupportedLanguageError
  | BlockchainProviderError
  | UninitializedError
  | ConsentContractError
  | InvalidSignatureError
  | AjaxError
  | CrumbsContractError
> {
  return core
    .getAccounts()
    .andThen((linkedAccounts) => {
      console.log("Linked Accounts", linkedAccounts);
      const addableAccounts = blockchain.accountWallets.filter((aw) => {
        return !linkedAccounts.includes(EVMAccountAddress(aw.address));
      });
      return prompt([
        {
          type: "list",
          name: "addAccountSelector",
          message: "Which account do you want to add?",
          choices: addableAccounts.map((wallet) => {
            return {
              name: wallet.address,
              value: wallet,
            };
          }),
        },
      ]);
    })

    .andThen((answers) => {
      const wallet = answers.addAccountSelector as ethers.Wallet;
      // Need to get the unlock message first
      return core
        .getUnlockMessage(languageCode)
        .andThen((message) => {
          // Sign the message
          return cryptoUtils.signMessage(
            message,
            EVMPrivateKey(wallet._signingKey().privateKey),
          );
        })
        .andThen((signature) => {
          return core.addAccount(
            EVMAccountAddress(wallet.address),
            signature,
            languageCode,
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
    // Swallow the error, returns an empty answer
    return okAsync({});
  });
}
