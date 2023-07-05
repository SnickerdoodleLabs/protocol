import {
  ICryptoUtils,
  ICryptoUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { ChunkRenderer } from "@persistence/backup/ChunkRenderer.js";
import {
  IBackupUtils,
  IBackupUtilsType,
} from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IChunkRendererFactory } from "@persistence/backup/IChunkRendererFactory.js";
import { IStorageIndex } from "@persistence/IStorageIndex.js";

@injectable()
export class ChunkRendererFactory implements IChunkRendererFactory {
  public constructor(
    @inject(IBackupUtilsType) protected backupUtils: IBackupUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  createChunkRenderer(
    schema: IStorageIndex,
    enableEncryption: boolean,
    privateKey: EVMPrivateKey,
  ): IChunkRenderer {
    return new ChunkRenderer(
      schema,
      enableEncryption,
      this.cryptoUtils,
      this.backupUtils,
      privateKey,
      this.timeUtils,
    );
  }
}
