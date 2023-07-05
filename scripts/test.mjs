import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));

const metaplex = Metaplex.make(connection).use(bundlrStorage());

const myNfts = await metaplex.nfts().findAllByOwner({
  owner: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
});

console.log(myNfts.map((nft) => nft.tokenStandard));

// console.log(myNfts);

const filters = [
  {
    dataSize: 165, //size of account (bytes)
  },
  {
    memcmp: {
      offset: 32, //location of our query in the account (bytes)
      bytes: new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"), //our search criteria, a base58 encoded string
    },
  },
];

// const tokenAcounts = await connection.getParsedProgramAccounts(
//   TOKEN_PROGRAM_ID, //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
//   { filters: filters },
// );
// console.log(tokenAcounts);

// const metadataProgram = metaplex.programs().getTokenMetadata();
// for (let i = 0; i < tokenAcounts.length; i++) {
//   const tokenAccount = tokenAcounts[i];
//   const myWalletMyTokenBalance = await connection.getTokenAccountBalance(
//     tokenAccount.pubkey,
//   );
//   console.log(tokenAccount, myWalletMyTokenBalance);

//   try {
//     const metadata = await metaplex
//       .nfts()
//       .findByMint({ mintAddress: tokenAccount.pubkey });
//     console.log(metadata);
//     console.log(tokenAccount);
//   } catch (e) {
//     console.log("failed");
//   }
// }

// const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
//   new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"),
//   filters,
// );
// console.log(parsedTokenAccounts);
