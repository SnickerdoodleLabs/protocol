import { ITimeUtils, ITimeUtilsType } from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey, VersionedObject } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";

import { ChunkRenderer } from "@persistence/backup/ChunkRenderer.js";
import {
  IBackupUtils,
  IBackupUtilsType,
} from "@persistence/backup/IBackupUtils.js";
import { IChunkRenderer } from "@persistence/backup/IChunkRenderer.js";
import { IChunkRendererFactory } from "@persistence/backup/IChunkRendererFactory.js";
import { FieldIndex } from "@persistence/local/index.js";
import { VolatileTableIndex } from "@persistence/volatile/index.js";

@injectable()
export class ChunkRendererFactory implements IChunkRendererFactory {
  public constructor(
    @inject(IBackupUtilsType) protected backupUtils: IBackupUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
  ) {}

  public createChunkRenderer(
    schema: VolatileTableIndex<VersionedObject> | FieldIndex,
  ): IChunkRenderer {
    return new ChunkRenderer(
      schema,
      this.backupUtils,
      this.timeUtils,
    );
  }
}
