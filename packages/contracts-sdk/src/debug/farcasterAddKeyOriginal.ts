import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
} from "@farcaster/hub-nodejs";
import * as ed from "@noble/ed25519";
import elliptic from "elliptic";
import { SigningKey, ethers, hexlify } from "ethers";
import { bytesToHex, createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { optimism } from "viem/chains";

// This is SDL's wallet
// It also needs an FID
const APP_PRIVATE_KEY =
  "0x46cb718f767d331ac76f04dc8771adf96f9ab21132545dd0c7797524684d0d63";

// SDL generates a new PK that can sign on behalf of Alice
// This will be wallet that has a Farcaster Id
// Current this PK has FID of 678015n
const ALICE_PRIVATE_KEY =
  "0x46cb718f767d331ac76f04dc8771adf96f9ab21132545dd0c7797524684d0d63";

/*******************************************************************************
 * Setup - Create local accounts, Viem clients, helpers, and constants.
 *******************************************************************************/

/**
 * Create Viem public (read) and wallet (write) clients.
 */
const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

const walletClient = createWalletClient({
  chain: optimism,
  transport: http(),
});

/**
 * A local account representing your app. You'll
 * use this to sign key metadata and send
 * transactions on behalf of users.
 */
// The Snickerdoodle's account that holds the SDL app id
const app = privateKeyToAccount(APP_PRIVATE_KEY);
const appAccountKey = new ViemLocalEip712Signer(app as any);
console.log("App:", app.address);

/**
 * A local account representing Alice, a user.
 */
const alice = privateKeyToAccount(ALICE_PRIVATE_KEY);
const aliceAccountKey = new ViemLocalEip712Signer(alice as any);
console.log("Alice:", alice.address);

/**
 * Generate a deadline timestamp one hour from now.
 * All Farcaster EIP-712 signatures include a deadline, a block timestamp
 * after which the signature is no longer valid.
 */
//const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // set the signatures' deadline to 1 hour from now
const deadline = 1722069682n;

const WARPCAST_RECOVERY_PROXY = "0x00000000FcB080a4D6c39a9354dA9EB9bC104cd7";

/*******************************************************************************
 * IdGateway - register - Register an app FID.
 *******************************************************************************/

/**
 *  Get the current price to register. We're not going to register any
 *  extra storage, so we pass 0n as the only argument.
 */
const price = await publicClient.readContract({
  address: ID_GATEWAY_ADDRESS,
  abi: idGatewayABI,
  functionName: "price",
  args: [0n],
});

/**
 *  Call `register` to register an FID to the app account.
 */
/* const { request } = await publicClient.simulateContract({
  account: app,
  address: ID_GATEWAY_ADDRESS,
  abi: idGatewayABI,
  functionName: "register",
  args: [WARPCAST_RECOVERY_PROXY, 0n],
  value: price,
});
await walletClient.writeContract(request); */

/**
 *  Read the app fid from the Id Registry contract.
 */
const APP_FID = await publicClient.readContract({
  address: ID_REGISTRY_ADDRESS,
  abi: idRegistryABI,
  functionName: "idOf",
  args: [app.address],
});

/*******************************************************************************
 * KeyGateway - addFor - Add an account key to Alice's fid.
 *******************************************************************************/

/**
 * To add an account key to Alice's fid, we need to follow four steps:
 *
 * 1. Create a new account key pair for Alice.
 * 2. Use our app account to create a Signed Key Request.
 * 3. Collect Alice's `Add` signature.
 * 4. Call the contract to add the key onchain.
 */

/**
 *  1. Create an Ed25519 account key pair for Alice and get the public key.
 */
// This is like us generating an EW
//const privateKeyBytes = ed.utils.randomPrivateKey();
const privateKeyBytes = new Uint8Array([
  70, 203, 113, 143, 118, 125, 51, 26, 199, 111, 4, 220, 135, 113, 173, 249,
  111, 154, 178, 17, 50, 84, 93, 208, 199, 121, 117, 36, 104, 77, 13, 99,
]);

const ed25519accountSigner = new NobleEd25519Signer(privateKeyBytes);

/* const ourPublicKeyString = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";
const ourPublicKeyUint8Array = ethers.getBytes(ourPublicKeyString); */

let accountPubKey = new Uint8Array();
const accounted25519KeyResult = await ed25519accountSigner.getSignerKey();
if (accounted25519KeyResult.isOk()) {
  accountPubKey = accounted25519KeyResult.value;
  console.log("ACCOUNTPUBKEY", bytesToHex(accountPubKey));
  //accountPubKey = ourPublicKeyUint8Array;

  /**
   *  2. Generate a Signed Key Request from the app account.
   */
  // Signed by SDL
  const signedKeyRequestMetadata =
    await appAccountKey.getSignedKeyRequestMetadata({
      requestFid: APP_FID,
      key: accountPubKey,
      deadline,
    });

  if (signedKeyRequestMetadata.isOk()) {
    const metadata = bytesToHex(signedKeyRequestMetadata.value);
    console.log(
      "VIEM hexed SignedKeyRequestMetadata",
      bytesToHex(signedKeyRequestMetadata.value),
    );

    /**
     *  3. Read Alice's nonce from the Key Gateway.
     */
    const aliceNonce = await publicClient.readContract({
      address: KEY_GATEWAY_ADDRESS,
      abi: keyGatewayABI,
      functionName: "nonces",
      args: [alice.address],
    });

    /**
     *  Then, collect her `Add` signature.
     */
    const aliceSignature = await aliceAccountKey.signAdd({
      owner: alice.address as `0x${string}`,
      keyType: 1,
      key: accountPubKey,
      metadataType: 1,
      metadata,
      nonce: aliceNonce,
      deadline,
    });

    if (aliceSignature.isOk()) {
      /**
       *  Call `addFor` with Alice's signature and the signed key request.
       */
      // This should be SDL's wallet submitting it
      console.log("VIEM addKey signature:", aliceSignature.value);
      /* const { request } = await publicClient.simulateContract({
        account: app,
        address: KEY_GATEWAY_ADDRESS,
        abi: keyGatewayABI,
        functionName: "addFor",
        args: [
          alice.address,
          1,
          bytesToHex(accountPubKey),
          1,
          metadata,
          deadline,
          bytesToHex(aliceSignature.value),
        ],
      });
      await walletClient.writeContract(request); */
    }
  }
}
