import { URLString } from "@snickerdoodlelabs/objects";

export interface IDropboxFileBackup {
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

export interface IDropboxWalletBackupDirectory {
    kind: string;
    items: IDropboxFileBackup[];
}
