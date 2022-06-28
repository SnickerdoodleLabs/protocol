import { IpfsCID } from "@snickerdoodlelabs/objects";

// "File" with text as the content is probably insufficient. I need to know
// more about IPFS to know everything that should go in the file.
// We may want to have a MIME type or equivalent, file size as a number,
// etc.
// This is just a starting point for the abstraction.

export class NewIPFSFile {
    public constructor(public content: string) { }
}

export class IPFSFile extends NewIPFSFile {
    public constructor(public cid: IpfsCID, public content: string) {
        super(content);
    }
}
