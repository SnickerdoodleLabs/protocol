import fs from 'fs';
import path from 'path';

import { okAsync, ResultAsync } from 'neverthrow';
import { DESIGN_PARAM_TYPES } from 'inversify/lib/constants/metadata_keys';

export class FileInputUtils {

    // TODO: use promise methods from fs https://nodejs.org/api/fs.html
    public isFile(filePath: string): boolean {
        const stat = fs.statSync(filePath);
        return stat.isFile();
    }

    public isDirectory(filePath: string): boolean {
        const stat = fs.statSync(filePath);
        return stat.isDirectory();
    }

    public getSubDirNames(from: string): ResultAsync<string[], Error> {
        const all = fs.readdirSync(from);

        const dirs = all.filter((dirName) => {
            const filePath = path.join(from, dirName);
            return this.isDirectory(filePath);
        })

        return okAsync(dirs);
    }

    public getSubDirPaths(from: string): ResultAsync<{name: string, path:string}[], Error> {
        return this.getSubDirNames(from)
            .andThen((dirsNames) => {
                const dirPaths = dirsNames.map((dirName) =>
                    {
                        const item = {
                            name: dirName,
                            path: path.join(from, dirName)

                        }
                        return item
                    }
                    
                );
                return okAsync(dirPaths);
            });
    }

    public getFiles(from: string): ResultAsync<string[], Error> {
        const all = fs.readdirSync(from);

        const files = all.filter((dirName) => {
            const filePath = path.join(from, dirName);
            return this.isFile(filePath);
        })

        return okAsync(files);
    }

    public getFilePaths(from: string): ResultAsync<{name: string, path:string}[], Error> {
        return this.getFiles(from)
            .andThen((fNames) => {
                const fPaths = fNames.map((fname) =>
                    {
                        const item = {
                            name: fname,
                            path: path.join(from, fname)

                        }
                        return item
                    }
                    
                );
                return okAsync(fPaths);
            });
    }
}