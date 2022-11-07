import "reflect-metadata";

import { InsightAPISignatureGenerator } from "../mocks/InsightAPISignatureGenerator";


describe("deliverInsights suite", () => {

    test("deliverInsights", async () => {

        const signatureGenerator = new InsightAPISignatureGenerator();
        const signature = await signatureGenerator.getTestSignature();

        // Assert
        expect(signature).toBeDefined();

        console.log(signature);
    });
});
