import { EVMPrivateKey } from "@snickerdoodlelabs/objects";

import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IStorageIndex } from "@persistence/IStorageIndex.js";

export interface IChunkRendererFactory {
  createChunkRenderer(
    schema: IStorageIndex,
    enableEncryption: boolean,
    privateKey: EVMPrivateKey,
  ): IChunkRenderer;
}

export const IChunkRendererFactoryType = Symbol.for("IChunkRenderer");
