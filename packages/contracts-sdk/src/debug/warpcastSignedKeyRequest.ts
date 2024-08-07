import {
  CastAddBody,
  FarcasterNetwork,
  getInsecureHubRpcClient,
  makeCastAdd,
  NobleEd25519Signer,
  Message,
} from "@farcaster/hub-nodejs";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import * as ed from "@noble/ed25519";
import axios from "axios";
import { ethers } from "ethers";
// import * as qrcode from "qrcode-terminal";
// import { Hex } from "viem";
import { mnemonicToAccount } from "viem/accounts";
/*** EIP-712 helper code ***/

const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

// (async () => {
//   /*** Generating a keypair ***/

//   const privateKey = ed.utils.randomPrivateKey();

//   console.log("DEBUGGER RANDOM PK", privateKey);

//   //   const knownPrivateKey = new Uint8Array([
//   //     28, 138, 174, 165, 245, 148, 105, 87, 214, 148, 228, 24, 86, 184, 129, 202,
//   //     5, 163, 60, 39, 226, 135, 5, 160, 225, 127, 28, 146, 94, 70, 115, 212,
//   //   ]);

//   console.log("EXAMPLE known PK", privateKey);

//   const publicKeyBytes = await ed.getPublicKey(privateKey);

//   console.log("EXAMPLE PUBLIC KEY bytes", publicKeyBytes);

//   const key = "0x" + Buffer.from(publicKeyBytes).toString("hex");

//   console.log("EXAMPLE PUBLIC KEY", key);

//   /*** Generating a Signed Key Request signature ***/

//   //process.env.APP_FID;
//   const appFid = 814459;

//   const appMnenomic =
//     //"motor mix fox cereal raccoon item robot rose tissue artefact employ about victory estate alley enroll bright arm month box laundry cross horror together";

//     // Verified account pK
//     "title fork sauce erosion pig awful car chief barely buffalo fragile casino";
//   //process.env.APP_MNENOMIC
//   const account = mnemonicToAccount(appMnenomic);

//   console.log("EXAMPLE address", account.address);

//   const ethersWallet = ethers.Wallet.fromPhrase(appMnenomic);

//   console.log("EXAMPLE ethers address", ethersWallet.address);

//   const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
//   console.log("EXAMPLE deadline", deadline);

//   const signature = await account.signTypedData({
//     domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
//     types: {
//       SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
//     },
//     primaryType: "SignedKeyRequest",
//     message: {
//       requestFid: BigInt(appFid),
//       key: key as `0x${string}`,
//       deadline: BigInt(deadline),
//     },
//   });

//   console.log("EXAMPLE signed key request signature", signature);

//   /*** Sponsorship ***/

//   const sponsorSignatureParam = {
//     message: { raw: signature },
//   };

//   const sponsorSignature = await account.signMessage(sponsorSignatureParam);

//   console.log("EXAMPLE sponsorsignature", sponsorSignature);

//   const ethersSponsorSignature = await ethersWallet.signMessage(
//     ethers.getBytes(signature),
//   );

//   console.log("ETHERS sponsorsignature", ethersSponsorSignature);

//   /*** Creating a Signed Key Request ***/

//   const warpcastApi = "https://api.warpcast.com";
//   const { token, deeplinkUrl } = await axios
//     .post(`${warpcastApi}/v2/signed-key-requests`, {
//       key,
//       requestFid: appFid,
//       signature,
//       deadline,
//       sponsorship: {
//         sponsorFid: appFid,
//         signature: sponsorSignature,
//       },
//     })
//     .then((response) => response.data.result.signedKeyRequest);

//   //qrcode.generate(deeplinkUrl, console.log);
//   console.log("scan this with your phone");
//   console.log("deep link:", deeplinkUrl);
//   console.log("sign key request token:", token);

//   const poll = async (token: string) => {
//     while (true) {
//       // sleep 1s
//       await new Promise((r) => setTimeout(r, 2000));

//       console.log("polling signed key request");
//       const signedKeyRequest = await axios
//         .get(`${warpcastApi}/v2/signed-key-request`, {
//           params: {
//             token,
//           },
//         })
//         .then((response) => response.data.result);

//       console.log(signedKeyRequest.state);

//       if (signedKeyRequest.state === "completed") {
//         console.log("Signed Key Request completed:", signedKeyRequest);

//         /**
//                * At this point the signer has been registered onchain and you can start submitting
//                * messages to hubs signed by its key:

//                */
//         break;
//       }
//     }
//   };

//   await poll(token);
// })();

async function castMessage(privateKey: Uint8Array) {
  console.log("Casting message...");
  const FID = 511999; // Your fid
  const ed25519Signer = new NobleEd25519Signer(privateKey);
  //console.log("Signer", ed25519Signer.getSignerKey());

  const FC_NETWORK = FarcasterNetwork.MAINNET;
  const dataOptions = {
    fid: FID,
    network: FC_NETWORK,
  };

  const castResults: any = [];

  const cast = await makeCastAdd(
    {
      text: "baking baking baking...",
      embeds: [],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    } as unknown as CastAddBody,
    dataOptions,
    ed25519Signer,
  );
  castResults.push(cast);

  //   castResults.map(
  //     (castAddResult) =>
  //       castAddResult.map((castAdd) => client.submitMessage(castAdd)),
  //     //castAddResult.map((castAdd) => neynarClient.lookupUserByUsername("zenhow")),
  //   );

  //   const client = getInsecureHubRpcClient("api.farcasthub.com:2281");

  //   const submit = await client.submitMessage(castResults[0]);

  //   console.log(submit);

  // Wait for all the promises to resolve
  //   const responses = await Promise.all(castResults);
  //   console.log(responses);
  // Define the URL and headers

  // Try using neynar
  const url = "https://api.neynar.com/v2/farcaster/message";
  const headers = {
    "Content-Type": "application/json",
    api_key: "2B319403-6FBE-4CC5-AC93-9673035FAB8D",
  };

  const body = Message.toJSON(castResults[0].value);

  console.log("castresult", castResults[0].value);
  console.log("body tojson-ed", body);

  //   try {
  //     const response = await axios.post(url, body, { headers });
  //     console.log("Response", response);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error posting message:", error);
  //     throw error;
  //   }
}

castMessage(
  new Uint8Array([
    28, 138, 174, 165, 245, 148, 105, 87, 214, 148, 228, 24, 86, 184, 129, 202,
    5, 163, 60, 39, 226, 135, 5, 160, 225, 127, 28, 146, 94, 70, 115, 212,
  ]),
);
