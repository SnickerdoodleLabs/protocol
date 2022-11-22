import "reflect-metadata";
import process from "node:process";
import { PromptFactory, TestWallet } from "@test-harness/utilities/index.js";


process
    .on("unhandledRejection", (reason, p) => {
        console.error(reason, "Unhandled Rejection at Promise", p);
        process.exit(1);
    })
    .on("uncaughtException", (err) => {
        console.error(err, "Uncaught Exception thrown");
        process.exit(1);
    });


// #region new prompt
const promptFactory = new PromptFactory()
const mainPromptNew = promptFactory.createDefault();
// #endregion

// Main event prompt. Core is up and running
while (true) {
    // await mainPrompt();
    await mainPromptNew.start();
}