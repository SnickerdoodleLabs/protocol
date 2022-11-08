import "reflect-metadata";

// import { SignatureGenerator } from "../../src/SignatureGenerator";
import { DataWalletAddress, EVMContractAddress, InsightString, IpfsCID } from "@snickerdoodlelabs/objects";

import { CryptoUtilsMocks } from "@test-harness-test/mocks/CryptoUtilsMocks";
import { insightDeliveryTypes, snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";
import { query1 } from "@test-harness/queries";


const consentContractAddress = EVMContractAddress(
    "0xE451980132E65465d0a498c53f0b5227326Dd73F"
);
const queryCid = IpfsCID(
    "QmQBy4Q5Ya8PY8byxNgnZT35Tc3V3VhoUun5VeJ3y9HBRE"
);
const returns = [
    "not qualified",
    "","unknown",
    "{}","[]","[]",
    "[{\"ticker\":\"1ed3loq\",\"address\":\"0A\",\"balance\":\"752\",\"networkId\":31338}]"
] as InsightString[]; // pass to deliverInsights as "insigts".
const dataWalletAddress = DataWalletAddress(
    "0x2F5143277893dd718582a6a8601054203af41eaA"
);


describe("Create data for InsigtPlatform APIs", () => {

    test("insights/responses", async () => {

        const returnsString = JSON.stringify(returns);
        const signableData = { // aka "types"
          consentContractId: consentContractAddress,
          queryCid: queryCid,
          dataWallet: dataWalletAddress,
          returns: returnsString,
        } as Record<string, unknown>;

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
        
        const randomDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const randomDataWalletKey = randomDataWalletKeyResult._unsafeUnwrap();
    
        const signature = await cryptoUtils.signTypedData(
            snickerdoodleSigningDomain,
            insightDeliveryTypes,
            signableData,
            randomDataWalletKey,
        );

        const retVal = {
            consentContractId: consentContractAddress,
            queryCid: queryCid,
            dataWallet: dataWalletAddress,
            returns: returns,
            signature: signature,
        };

        console.log("deliverInsigts request body");
        console.log(retVal);


        // const wallet = new TestWallet(
        //     EChain.LocalDoodle,
        //     EVMPrivateKey(privateKey),
        //     cryptoUtils,
        // )// has accountAddress derived from private key

        // const signedMessage = await wallet.signMessage(message);

        // Assert
        // expect(signedMessage).toBeDefined();
        // console.log(signedMessage);
    });

    test("preview", async () => {

        const returnsString = JSON.stringify(returns);
        const signableData = { // aka "types"
          consentContractId: consentContractAddress,
          queryCid: queryCid,
          dataWallet: dataWalletAddress,
          returns: returnsString,
        } as Record<string, unknown>;

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
        
        const randomDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const randomDataWalletKey = randomDataWalletKeyResult._unsafeUnwrap();
    
        const signature = await cryptoUtils.signTypedData(
            snickerdoodleSigningDomain,
            insightDeliveryTypes,
            signableData,
            randomDataWalletKey,
        );

        const retVal = {
            consentContractId: consentContractAddress,
            queryCid: queryCid,
            dataWallet: dataWalletAddress,
            returns: returns,
            signature: signature,
        };

        console.log("deliverInsigts request body");
        console.log(retVal);
    });
});
