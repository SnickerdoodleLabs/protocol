import {
  DomainName,
  InvalidSignatureError,
  KeyGenerationError,
  PEMEncodedRSAPublicKey,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import inquirer from "inquirer";
import jwt from "jsonwebtoken";
import { okAsync, ResultAsync } from "neverthrow";

import { inquiryWrapper } from "@test-harness/prompts/inquiryWrapper.js";
import { Prompt } from "@test-harness/prompts/Prompt.js";

const domains = [
  DomainName("foo.com"),
  DomainName("bar.net"),
  DomainName("baz.io"),
];
let nonceCount = 1;
const publicKeys = new Map<DomainName, PEMEncodedRSAPublicKey>();

export class GetBearerToken extends Prompt {
  public start(): ResultAsync<
    void,
    InvalidSignatureError | PersistenceError | KeyGenerationError
  > {
    return inquiryWrapper([
      {
        type: "list",
        name: "getDomain",
        message: "Choose a domain to receive a bearer token for:",
        choices: [
          ...domains.map((domain) => {
            return {
              name: `${domain}`,
              value: domain,
            };
          }),
          new inquirer.Separator(),
          { name: "Cancel", value: "cancel" },
        ],
      },
    ]).andThen((answers) => {
      if (answers.getDomain == "cancel") {
        return okAsync(undefined);
      }

      const domain = answers.getDomain as DomainName;
      const pubKey = publicKeys.get(domain);

      if (pubKey == null) {
        // No existing public key for this domain
        console.log(
          `This is the first time requesting a token for ${domain}. Obtaining and caching public key`,
        );
        return this.core.integration
          .getTokenVerificationPublicKey(domain)
          .andThen((publicKey) => {
            publicKeys.set(domain, publicKey);
            console.log(`Public key for ${domain}: ${publicKey}`);
            return this.getAndVerifyToken(domain, publicKey);
          });
      }
      return this.getAndVerifyToken(domain, pubKey);
    });
  }

  protected getAndVerifyToken(
    domain: DomainName,
    publicKey: PEMEncodedRSAPublicKey,
  ) {
    const nonce = `This is nonce ${nonceCount++}`;
    console.log(`Getting token for ${domain}, with nonce ${nonce}`);

    return this.core.integration.getBearerToken(nonce, domain).map((token) => {
      console.log(`Raw token: ${token}`);

      try {
        const tokenContents = jwt.verify(token, publicKey);
        console.log(
          "Token signature verified! Token contents: ",
          tokenContents,
        );
      } catch (e) {
        console.error("Token did not verify with public key!");
        console.error(e);
      }
    });
  }
}
