
import { FileInputUtils } from "@test-harness/utilities/FileInputUtils.js";
import * as td from "testdouble";

describe("File IO tests", () => {
    const dataWalletProfilesPath = "data/profiles/dataWallet"
    test("we have more than one data wallet profile", async () => {
        const fioUtils = new FileInputUtils();

        const dirsRes = await fioUtils.getSubDirNames(dataWalletProfilesPath);
        expect(dirsRes.isOk()).toBeTruthy();
        
        const dirs = dirsRes._unsafeUnwrap();
        expect(dirs.length).toBeGreaterThan(0);

        console.log(dirs);
        
    })

    test("we have more than one data wallet profile 2", async () => {
        const fioUtils = new FileInputUtils();

        const dirsRes = await fioUtils.getSubDirPaths(dataWalletProfilesPath);
        expect(dirsRes.isOk()).toBeTruthy();
        
        const dirs = dirsRes._unsafeUnwrap();
        // expect(dirs.length).toBeGreaterThan(0);

        console.log(dirs);
        
    })
})