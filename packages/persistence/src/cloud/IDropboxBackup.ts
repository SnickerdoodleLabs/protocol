import { URLString } from "@snickerdoodlelabs/objects";

export interface IDropboxFileBackup {
  tag: string;
  name: string;
  path_lower: string;
  path_display: string;
  id: string;
  client_modified: string;
  server_modified: string;
  rev: string;
  size: string;
  is_downloadable: boolean;
  content_hash: string;
}

export interface IDropboxWalletBackupDirectory {
  entries: IDropboxFileBackup[];
}
