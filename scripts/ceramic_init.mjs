import { CeramicClient } from "@ceramicnetwork/http-client";
import { DataModel } from "@glazed/datamodel";
import { ModelManager } from "@glazed/devtools";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const CERAMIC_URL = process.env.CERAMIC_URL || "https://ceramic.snickerdoodle.dev/";

const BackupSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "DataWalletBackup",
  type: "object",
  properties: {
    header: {
      type: "object",
      properties: {
        hash: {
          type: "string",
        },
        timestamp: {
          type: "number",
        },
        signature: {
          type: "string",
        },
      },
    },
    blob: {
      type: "object",
      properties: {
        data: {
          type: "string",
        },
        initializationVector: {
          type: "string",
        },
      },
    },
  },
};

const BackupIndexSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "BackupIndex",
  type: "object",
  properties: {
    backups: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            $ref: "#/definitions/CeramicStreamId",
          },
          timestamp: {
            type: "integer",
          },
        },
      },
    },
  },
  definitions: {
    CeramicStreamId: {
      type: "string",
      pattern: "^ceramic://.+(\\\\?version=.+)?",
      maxLength: 150,
    },
  },
};

async function run() {
  // The seed must be provided as an environment variable
  const seed = fromString(
    process.env.SEED ||
      "a768afca37e591e816d9f6d7a492896772ae5e0e41fe022b3597d2b628464ed7",
    "base16",
  ); // node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  // Connect to the local Ceramic node
  const ceramic = new CeramicClient(CERAMIC_URL);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;

  // Create a manager for the model
  const manager = new ModelManager({ ceramic });

  // Publish the two schemas
  const [backupSchema, backupIndexSchema] = await Promise.all([
    manager.createSchema("DataWalletBackup", BackupSchema),
    manager.createSchema("BackupIndex", BackupIndexSchema),
  ]);

  // Create the definition using the created schema ID
  const backupsDefinition = await manager.createDefinition("backupIndex", {
    name: "backupIndex",
    description: "SDL Data Wallet Backup Index",
    schema: manager.getSchemaURL(backupIndexSchema),
  });

  // Write model to JSON file
  const modelAliases = await manager.deploy();
  console.log(modelAliases);
  // const modelEncoding = manager.toJSON();
  // console.log(modelEncoding);
}

run().catch(console.error);
