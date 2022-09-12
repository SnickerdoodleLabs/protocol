/* eslint-disable @typescript-eslint/no-var-requires */
import { writeFile } from "node:fs/promises";

import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays/from-string";

const CERAMIC_URL = process.env.CERAMIC_URL || "http://localhost:7007";

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
        accountAddress: {
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
  await ceramic.setDID(did);
  // Authenticate the Ceramic instance with the provider
  await ceramic.did.authenticate();

  // Create a manager for the model
  const manager = new ModelManager({ ceramic });

  // Publish the two schemas
  const [backupSchema, backupIndexSchema] = await Promise.all([
    manager.createSchema(ceramic, { content: BackupSchema }),
    manager.createSchema(ceramic, { content: BackupIndexSchema }),
  ]);

  // Create the definition using the created schema ID
  const backupsDefinition = await manager.createDefinition(ceramic, {
    name: "backupIndex",
    description: "SDL Data Wallet Backup Index",
    schema: manager.getSchemaURL(backupIndexSchema),
  });

  // Write model to JSON file
  const aliases = await manager.deploy();
  const modelAliases = {
    definitions: {
      backupIndex: backupsDefinition,
    },
    schemas: {
      Backup: manager.getSchemaURL(backupSchema),
      BackupIndex: manager.getSchemaURL(backupIndexSchema),
    },
    tiles: {},
  };
  console.log(modelAliases);

  // for some reason this does not work
  // await writeFile(
  //   "./model.json",
  //   `export const aliases = ${JSON.stringify(aliases)}`,
  // );
  console.log("Model aliases written to model,json", aliases);
}

run().catch(console.error);
