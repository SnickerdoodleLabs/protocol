import { CeramicClient } from "@ceramicnetwork/http-client";
import { WebauthnAuth } from "@didtools/key-webauthn";
import { DIDSession } from "did-session";
import { injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class PasskeyUtils {
  public createDIDSession(passkeyName: string): ResultAsync<DIDSession, Error> {
    return this.checkPasskeyAvailability()
      .andThen((isAvailable) => {
        if (!isAvailable) {
          return errAsync(new Error("Passkey not available"));
        }

        console.log("CHARLIE passkey support available");
        return ResultAsync.fromPromise(
          WebauthnAuth.createDID(passkeyName),
          (e) => {
            return e as Error;
          },
        );
      })
      .andThen((did) => {
        console.log("CHARLIE DID created, getting auth method", did);
        return ResultAsync.fromPromise(
          WebauthnAuth.getAuthMethod({ did }),
          (e) => {
            return e as Error;
          },
        );
      })
      .andThen((authMethod) => {
        console.log(
          "CHARLIE auth method created, authorizing DID session",
          authMethod,
        );
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

  private checkPasskeyAvailability(): ResultAsync<boolean, Error> {
    // The device supports a platform authenticator (can create a passkey and authenticate with the passkey).
    // The browser supports WebAuthn conditional UI.

    // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
    // `isUserVerifyingPlatformAuthenticatorAvailable` means the feature detection is usable.
    // `​​isConditionalMediationAvailable` means the feature detection is usable.
    if (
      window.PublicKeyCredential != null &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
      PublicKeyCredential.isConditionalMediationAvailable
    ) {
      // Check if user verifying platform authenticator is available.
      return ResultUtils.combine([
        ResultAsync.fromPromise(
          PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
          (e) => {
            return e as Error;
          },
        ),
        ResultAsync.fromPromise(
          PublicKeyCredential.isConditionalMediationAvailable(),
          (e) => {
            return e as Error;
          },
        ),
      ]).map(
        ([
          userVerifyingPlatformAuthenticatorAvailable,
          conditionalMediationAvailable,
        ]) => {
          if (!userVerifyingPlatformAuthenticatorAvailable) {
            console.log("User verifying platform authenticator not available");
          }
          if (!conditionalMediationAvailable) {
            console.log("Conditional mediation not available");
          }
          return (
            userVerifyingPlatformAuthenticatorAvailable &&
            conditionalMediationAvailable
          );
        },
      );
    }

    return okAsync(false);
  }
}

// Uses DIDs in ceramic, combosedb & glaze libraries, ie

// pass ceramic instance where needed

// One question that just came up while talking about the implementation plan is about encryption. It's very important that the data we put into Ceramic with DID:A is encrypted or otherwise protected, such that no other user can read the data (obscurity is insufficient).
