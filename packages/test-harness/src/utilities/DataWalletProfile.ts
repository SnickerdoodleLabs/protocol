import { IMinimalForwarderRequest } from "@snickerdoodlelabs/contracts-sdk";
import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { MetatransactionSignatureRequest, PageInvitation, Signature, UnsupportedLanguageError } from "@snickerdoodlelabs/objects";
import { TestHarnessMocks } from "@test-harness/mocks";
import { TestWallet } from "@test-harness/utilities/TestWallet.js";
import { BigNumber } from "ethers";
import { ResultAsync } from "neverthrow";

export class DataWalletProfile {

    private _unlocked = false;
    
    public acceptedInvitations = new Array<PageInvitation>();
    
    public constructor(
        readonly core: SnickerdoodleCore,
        readonly mocks: TestHarnessMocks
    ) {}

    public get unlocked(): boolean {
        return this._unlocked; 
    }

    public unlock() {
        this._unlocked = true;
    }



    public signMetatransactionRequest<TErr>(
        request: MetatransactionSignatureRequest<TErr>,
    ): ResultAsync<void, Error | TErr> {
        // This method needs to happen in nicer form in all form factors
        console.log(
        `Metadata Transaction Requested!`,
        `WARNING: This should no longer occur!`,
        `Request account address: ${request.accountAddress}`,
        );
    
        // We need to get a nonce for this account address from the forwarder contract
        return this.mocks.blockchain.minimalForwarder
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
            const wallet = this.mocks.blockchain.getWalletForAddress(request.accountAddress);
    
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
    
    public getSignatureForAccount(
        wallet: TestWallet,
      ): ResultAsync<Signature, UnsupportedLanguageError> {
        return this.core.getUnlockMessage(this.mocks.languageCode).andThen((message) => {
          return wallet.signMessage(message);
        });
      }
      
    
}