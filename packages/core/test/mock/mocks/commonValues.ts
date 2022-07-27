import { CoreConfig } from "@core/interfaces/objects";
import { ChainInformation, ControlChainInformation } from "@extension-onboarding/packages/objects/src/businessObjects/ChainInformation";
import { URLString } from "@snickerdoodlelabs/objects";
import { ChainId } from "@snickerdoodlelabs/objects";
import { chainConfig } from "@snickerdoodlelabs/objects";
import {
  DataWalletAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import { snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";

export const dataWalletAddress = DataWalletAddress("dataWalletAddress");

export const dataWalletKey = EVMPrivateKey("dataWalletKey");

export const consentContractAddress = EVMContractAddress(
  "consentContractAddress",
);

export const queryId = IpfsCID("queryId");

export const qureyString = SDQLString("qurey");

export const SDQuery = new SDQLQuery(queryId, qureyString);

// #region for config provider mock

export const controlChainId = ChainId(31337);
export const controlChainInformation = chainConfig.get(controlChainId) as ControlChainInformation;

// const chainConfig = new Map<ChainId, ChainInformation>([
//   [
//     ChainId(31337),
//     new ControlChainInformation(
//       "Local Doodle Chain",
//       ChainId(31337),
//       true,
//       [ProviderUrl("http://localhost:8545")],
//       4000,
//       EIndexer.Simulator,
//       EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"), // Consent Contract Factory
//       EVMContractAddress("0x0165878A594ca255338adfa4d48449f69242Eb8F"), // Crumbs Contract
//       EVMContractAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"), // Metatransaction Forwarder Contract
//     ),
//   ],
//   [
//     ChainId(1338),
//     new ChainInformation(
//       "Local Development Chain",
//       ChainId(1338),
//       true,
//       [ProviderUrl("http://localhost:8545")],
//       4000,
//       EIndexer.EVM,
//     ),
//   ],
// ]);

export const testCoreConfig = new CoreConfig(
  controlChainId,
  [], //TODO: supported chains
  URLString(""),
  chainConfig,
  controlChainInformation,
  URLString("ipfs node address"),
  // uncomment following line to test locally
  URLString("http://localhost:3000/v0"),
  // URLString("http://insight-platform"),
  snickerdoodleSigningDomain,
  5000, // polling interval indexing,
  5000, // polling interval balance
  5000, // polling interval NFT
  "covalent api key",
  "moralis api key",
);

// #endregion
