import {
  CryptoUtils,
  ILogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  ConsentContract,
  IMinimalForwarderRequest,
} from "@snickerdoodlelabs/contracts-sdk";
import {
  BigNumberString,
  ConsentContractError,
  ConsentFactoryContractError,
  ConsentName,
  DataWalletAddress,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  HexString,
  IpfsCID,
  ISDQLQueryObject,
  SDQLString,
  Signature,
  UnixTimestamp,
  URLString,
} from "@snickerdoodlelabs/objects";
import {
  snickerdoodleSigningDomain,
  executeMetatransactionTypes,
} from "@snickerdoodlelabs/signature-verification";
import { BigNumber } from "ethers";
import express from "express";
import { ResultAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/BlockchainStuff";
import { IPFSClient } from "@test-harness/IPFSClient";
import * as fs from 'fs';

export class InsightPlatformSimulator {
  protected app: express.Express;
  // ports 3000 to 3005 may conflict with insight-platform gateway services
  protected port = 3006;
  protected cryptoUtils = new CryptoUtils();

  protected consentContracts = new Array<EVMContractAddress>();
  protected logStream = fs.createWriteStream('data/insight/' + new Date().toISOString().substring(0, 10), {flags: 'a'});

  public constructor(
    protected blockchain: BlockchainStuff,
    protected ipfs: IPFSClient /*
    @inject(IConsentContractRepositoryType) 
    protected consentContractsRepository: IConsentContractRepository,
    */,
  ) {

    process.on('exit', () => {
      this.logStream.close();
    });

    this.app = express();

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    // Fakes Cloudflare DNS response
    this.app.get("/dns", (req, res) => {
      res.send({
        Answer: this.consentContracts.map((contractAddress) => {
          return {
            data: `"${contractAddress}"`,
          };
        }),
      });
    });

    this.app.post("/insights/responses", (req, res) => {
      console.log("Sending to Insight Responses");
      console.log("Req is this: ", req.body);
      //console.log("req.body.consentContractId: ", req.body.consentContractId);
      // const newConsentContract = req.body.consentContractId;
      // const consentContractId = EVMContractAddress(req.body.consentContractId);
      // //console.log("consentContractId: ", consentContractId);
      // const queryId = IpfsCID(req.body.queryId);
      // const dataWallet = EVMAccountAddress(req.body.dataWallet);
      // const returns = JSON.stringify(req.body.returns);
      // const signature = Signature(req.body.signature);

      // const value = {
      //   consentContractId,
      //   queryId,
      //   dataWallet,
      //   returns,
      // };

      this.logStream.write(JSON.stringify(req.body));

      res.send("Insights received successfully!");
      /*
      return this.cryptoUtils
      .verifyTypedData(snickerdoodleSigningDomain, insightDeliveryTypes, value, signature)
      .andThen((verificationAddress) => {
        console.log("verificationAddress: ", verificationAddress);
        if (verificationAddress !== dataWallet) {
					//return okAsync(false);
          console.log("In bad wallet: ");
          res.send("Error: Type Data Not Verified");
				}
				return okAsync(null);
      })
      .andThen( () => {
        console.log("from promise 1: ");

        return ResultAsync.fromPromise(this.blockchain.getConsentContract(consentContractId) as unknown as Promise<ConsentContract>,
        (e) => {
          console.log("from promise 2: ");
          return new ConsentContractError(
            "Unable to call getConsentContract()",
            (e as ConsentContractError).reason,
            e,
          );
        })
      }).andThen( (contract) => {
        console.log("contract: ", contract);
        return contract.getConsentTokensOfAddress(dataWallet);
      }).andThen((tokens) => {
        console.log("tokens: ", tokens);
				if (tokens.length > 0) {
          return okAsync(null);
				}
        console.log("tokens error: ");
        res.send("Error: Wallet has no Consent Tokens");
        return errAsync(" Wallet has no Consent Tokens");
			}).map(() => {
        res.send("Insights received successfully!");
      });
      */
    });

    this.app.post("/metatransaction", (req, res) => {
      // Gather all the parameters
      const accountAddress = EVMAccountAddress(req.body.accountAddress);
      const dataWalletAddress = DataWalletAddress(req.body.dataWalletAddress);
      const contractAddress = EVMContractAddress(req.body.contractAddress);
      const nonce = BigNumberString(req.body.nonce);
      const data = HexString(req.body.data);
      const signature = Signature(req.body.requestSignature);
      const metatransactionSignature = Signature(
        req.body.metatransactionSignature,
      );

      const value = {
        dataWallet: dataWalletAddress,
        accountAddress: accountAddress,
        contractAddress: contractAddress,
        nonce: nonce,
        data: data,
        metatransactionSignature: metatransactionSignature,
      } as Record<string, unknown>;

      // Verify the signature
      this.cryptoUtils
        .verifyTypedData(
          snickerdoodleSigningDomain,
          executeMetatransactionTypes,
          value,
          signature,
        )
        .andThen((verificationAddress) => {
          if (verificationAddress != EVMAccountAddress(dataWalletAddress)) {
            console.error(
              `Invalid signature. Data Wallet Address: ${dataWalletAddress}, verified address: ${verificationAddress}`,
            );
            return errAsync(new Error("Invalid signature!"));
          }

          console.log(
            `Verified signature from data wallet ${verificationAddress}!`,
          );

          const forwarderRequest = {
            to: contractAddress, // Contract address for the metatransaction
            from: accountAddress, // EOA to run the transaction as
            value: BigNumber.from(0), // The amount of doodle token to pay. Should be 0.
            gas: BigNumber.from(10000000), // The amount of gas to pay.
            nonce: BigNumber.from(nonce), // Nonce for the EOA, recovered from the MinimalForwarder.getNonce()
            data: data, // The actual bytes of the request, encoded as a hex string
          } as IMinimalForwarderRequest;

          console.log("Metatransaction signature", metatransactionSignature);

          // Now we need to actually execute the metatransaction
          return this.blockchain.minimalForwarder.execute(
            forwarderRequest,
            metatransactionSignature,
          );
        })
        .map(() => {
          res.send("TokenId");
        })
        .mapErr((e) => {
          console.error(e);
          res.statusCode = 500;
          res.send(e.message);
        });
    });

    this.app.listen(this.port, () => {
      console.log(`Insight Platform Simulator listening on port ${this.port}`);
    });
  }

  public postQuery(
    consentContractAddress: EVMContractAddress,
    queryText: SDQLString,
  ): ResultAsync<void, Error | ConsentContractError> {
    // Posting a query involves two things- 1. putting the query content into IPFS, and 2.
    // calling requestForData on the consent contract

    // The queryText needs to have the timestamp inserted
    const queryJson = JSON.parse(queryText) as ISDQLQueryObject;
    queryJson.timestamp = UnixTimestamp(
      Math.floor(new Date().getTime() / 1000),
    );

    // Convert query back to string
    queryText = SDQLString(JSON.stringify(queryJson));

    // Now we can post the query to IPFS
    return this.ipfs
      .postToIPFS(queryText)
      .andThen((cid) => {
        console.log(`Posted query content to ipfs CID ${cid}`);
        // Need to call requestForData
        const consentContract = this.blockchain.getConsentContract(
          consentContractAddress,
        );

        return consentContract.requestForData(cid);
      })
      .map(() => {
        console.log(
          `Sent request for data to consent contract ${consentContractAddress}`,
        );
      });
  }

  public createCampaign(
    domains: DomainName[],
  ): ResultAsync<
    EVMContractAddress,
    ConsentFactoryContractError | ConsentContractError | Error
  > {
    return this.ipfs
      .postToIPFS(
        JSON.stringify({
          title: `${domains[0]} title`,
          description: "description",
          image: URLString("http://example.com/image.png"),
          rewardName: "rewardName",
          nftClaimedImage: URLString("http://example.com/nftClaimedImage.png"),
        }),
      )
      .andThen((cid) => {
        // Need to create a consent contract
        return this.blockchain
          .createConsentContract(
            ConsentName(
              `Snackerdoodle Test Harness ${this.consentContracts.length + 1}`,
            ),
            domains[0],
            cid,
          )
          .andThen((contractAddress) => {
            const consentContract =
              this.blockchain.getConsentContract(contractAddress);

            console.log(
              `Created consent contract address ${contractAddress} for business account adddress ${this.blockchain.businessAccount.accountAddress}, owned by ${this.blockchain.serverAccount.accountAddress}`,
            );
            this.consentContracts.push(contractAddress);

            // Add a few URLs
            // We need to do this
            return ResultUtils.executeSerially(
              domains.map((domain) => () => consentContract.addDomain(domain)),
            ).map(() => {
              console.log(
                `Added domains to consent contract address ${contractAddress}`,
              );
              return contractAddress;
            });
          });
      });
  }
}
