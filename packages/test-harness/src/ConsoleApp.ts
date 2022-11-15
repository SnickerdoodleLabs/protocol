// initialize core
// create app loop

import { SnickerdoodleCore } from "@snickerdoodlelabs/core";
import { IConfigOverrides } from "@snickerdoodlelabs/objects";
import { FakeDBVolatileStorage } from "@snickerdoodlelabs/persistence";


const fakeDBVolatileStorage = new FakeDBVolatileStorage();

// https://github.com/SBoudrias/Inquirer.js
const core = new SnickerdoodleCore(
    {
        defaultInsightPlatformBaseUrl: "http://localhost:3006",
        dnsServerAddress: "http://localhost:3006/dns",
    } as IConfigOverrides,
    undefined,
    fakeDBVolatileStorage,
);

process
    .on("unhandledRejection", (reason, p) => {
        console.error(reason, "Unhandled Rejection at Promise", p);
        process.exit(1);
    })
    .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        process.exit(1);
    });

