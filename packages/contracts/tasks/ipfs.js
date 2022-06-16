const filesystem = require('fs');
const all = require('it-all')
const { concat } = require("uint8arrays/concat");
const { toString } = require('uint8arrays/to-string');
const { create, CID } = require("ipfs-http-client");
const ipfs = create(); // connects to the default API address http://localhost:5001

task("ipfstest", "tests that the ipfs node is working.", async (taskArgs, hre) => {
    const file = await ipfs.add({
        path: 'hello.txt',
        content: Buffer.from('Hello, World!')
    });
    console.log(file);
});

task("getIPFSCID", "retrieves the specified asset corresponding to the given IPFS CID and writes to a file.")
    .addParam("cid", "IPFS multihash.")
    .setAction(async (taskArgs) => {
        const multihash = taskArgs.cid;
        const data = toString(concat(await all(ipfs.cat(multihash))));
        filesystem.writeFileSync(multihash, data);
    });

task("pinToIPFS", "Pin the specified file to your IPFS node.")
    .addParam("filename", "relative path to the file you wish to pin to ipfs.")
    .setAction(async (taskArgs) => {
        const filename = taskArgs.filename;
        const data = filesystem.readFileSync(filename, 'utf8');
        const info = await ipfs.add({
            path: 'filename',
            content: Buffer.from(data)
        });
        console.log(info);
    });
