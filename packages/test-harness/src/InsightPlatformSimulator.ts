import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
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
import { ResultAsync, okAsync, errAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BlockchainStuff } from "@test-harness/BlockchainStuff";
import { IPFSClient } from "@test-harness/IPFSClient";

export class InsightPlatformSimulator {
  protected app: express.Express;
  // ports 3000 to 3005 may conflict with insight-platform gateway services
  protected port = 3006;
  protected cryptoUtils = new CryptoUtils();

  protected consentContracts = new Array<EVMContractAddress>();

  public constructor(
    protected blockchain: BlockchainStuff,
    protected ipfs: IPFSClient,
  ) {
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

    this.app.post("/metatransaction", (req, res) => {
      // Gather all the parameters
      const accountAddress = EVMAccountAddress(req.body.accountAddress);
      const dataWalletAddress = DataWalletAddress(req.body.dataWallet);
      const contractAddress = EVMContractAddress(req.body.contractAddress);
      const nonce = BigNumberString(req.body.nonce);
      const data = HexString(req.body.data);
      const signature = Signature(req.body.signature);
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
            gas: BigNumber.from(1000000), // The amount of gas to pay.
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
    const [domain, domain2] = domains;
    return this.ipfs
      .postToIPFS(
        JSON.stringify({
          title: `${domain} title`,
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
            domain,
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
            return consentContract
              .addDomain(domain)
              .andThen(() => {
                return consentContract.addDomain(domain2);
              })
              .map(() => {
                console.log(
                  `Added domains to consent contract address ${contractAddress}`,
                );
                return contractAddress;
              });
          });
      });
  }
}
