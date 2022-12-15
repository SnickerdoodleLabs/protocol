import { ModelAliases } from "@glazed/types";
import { ChainId, ModelTypes, URLString } from "@snickerdoodlelabs/objects";

export interface IGoogleFileBackup {
  kind: string;
  id: string;
  selfLink: URLString;
  mediaLink: URLString;
  name: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  storageClass: string;
  size: string;
  md5Hash: string;
  crc32c: string;
  etag: string;
  timeCreated: string;
  updated: string;
  timeStorageClassUpdated: string;
}

export interface IGoogleWalletBackupDirectory {
  kind: string;
  items: IGoogleFileBackup[];
}
