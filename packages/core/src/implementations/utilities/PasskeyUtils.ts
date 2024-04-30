import { CeramicClient } from "@ceramicnetwork/http-client";
import { WebauthnAuth } from "@didtools/key-webauthn";
import { DIDSession } from "did-session";
import { ResultAsync, okAsync } from "neverthrow";

export class PasskeyUtils {
  public createDIDSession(passkeyName: string): ResultAsync<DIDSession, Error> {
    return ResultAsync.fromPromise(WebauthnAuth.createDID(passkeyName), (e) => {
      return e as Error;
    })
      .andThen((did) => {
        return ResultAsync.fromPromise(
          WebauthnAuth.getAuthMethod({ did }),
          (e) => {
            return e as Error;
          },
        );
      })
      .andThen((authMethod) => {
        return ResultAsync.fromPromise(
          DIDSession.authorize(authMethod, {
            resources: ["ceramic://nil"],
          }),
          (e) => {
            return e as Error;
          },
        );
      });
  }

  // If you don't know the DID already, you can probe for the public key, by having the user
  // sign a nonce. This is the method we will generally use.
  public probeDidSession(): ResultAsync<DIDSession, Error> {
    return ResultAsync.fromPromise(WebauthnAuth.probeDIDs(), (e) => {
      return e as Error;
    })
      .andThen((dids) => {
        return ResultAsync.fromPromise(
          WebauthnAuth.getAuthMethod({ dids }),
          (e) => {
            return e as Error;
          },
        );
      })
      .andThen((authMethod) => {
        return ResultAsync.fromPromise(
          DIDSession.authorize(authMethod, {
            resources: ["ceramic://nil"],
          }),
          (e) => {
            return e as Error;
          },
        );
      });
  }

  public getCeramicClient(
    session: DIDSession,
  ): ResultAsync<CeramicClient, Error> {
    const ceramic = new CeramicClient();
    ceramic.did = session.did;

    return okAsync(ceramic);
  }
}

// Uses DIDs in ceramic, combosedb & glaze libraries, ie

// pass ceramic instance where needed
