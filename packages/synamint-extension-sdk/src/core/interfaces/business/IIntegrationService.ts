import {
  DomainName,
  EDataWalletPermission,
  JsonWebToken,
  PEMEncodedRSAPublicKey,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { SnickerDoodleCoreError } from "@synamint-extension-sdk/shared/objects/errors";

export interface IIntegrationService {
  requestPermissions(
    permissions: EDataWalletPermission[],
    sourceDomain: DomainName,
  ): ResultAsync<EDataWalletPermission[], SnickerDoodleCoreError>;

  /**
   * Returns the granted permissions for a particular domain
   * @param domain
   */
  getPermissions(
    domain: DomainName,
    sourceDomain?: DomainName,
  ): ResultAsync<EDataWalletPermission[], SnickerDoodleCoreError>;

  /**
   * Returns the public key used to sign JWTs for the requested domain. This should be requested
   * the first time a data wallet user interacts with a website, and stored for future visits.
   * This key along with the generated user ID will allow the website to securely verify the
   * data wallet as returning.
   * @param domain
   */
  getTokenVerificationPublicKey(
    domain: DomainName,
  ): ResultAsync<PEMEncodedRSAPublicKey, SnickerDoodleCoreError>;

  /**
   * Returns a JWT bearer token, customized for the domain. The domain should be provided and
   * verified by the form factor, and not via a request, as with all other domain params.
   * The nonce can be any arbitrary data, and will be encoded as a claim in the token. The
   * purpose of it is to verify possetion of the key and that the token issued is fresh-
   * it is not a stolen token captured for elsewhere. A unique ID is generated for the domain,
   * a UUID, and will remain consistent for all interactions with that domain (sub claim in JWT).
   * This is meant to be the user ID for the data wallet. It is not traceable to the wallet or
   * between domains. Email and other identifing information is not included in the token.
   * The JWT will be signed with 4096 bit RSA key that is also generated per-domain. This key is
   * available via getTokenVerificationPublicKey() and can verify the token if required. The website
   * can obtain this public key on the first interaction and store it on their own server. Then,
   * any time a token is presented, they can verify the authenticity of the token for future visits.
   * @param nonce Any string, provided by the calling page. Included in the "nonce" claim in the token, to protect against replays. Assures a fresh token.
   * @param domain The domain requesting the token. The token will be customized for the domain.
   */
  getBearerToken(
    nonce: string,
    domain: DomainName,
  ): ResultAsync<JsonWebToken, SnickerDoodleCoreError>;
}

export const IIntegrationServiceType = Symbol.for("IIntegrationService");
