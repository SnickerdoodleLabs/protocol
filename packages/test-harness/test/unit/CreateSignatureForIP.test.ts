import "reflect-metadata";

import { EVMContractAddress, EVMPrivateKey, InsightString, IpfsCID } from "@snickerdoodlelabs/objects";

import { CryptoUtilsMocks } from "@test-harness-test/mocks/CryptoUtilsMocks";
import { insightDeliveryTypes, snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";


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


describe("Sign proper data for InsigtPlatform APIs", () => {

    test("insights/responses", async () => {

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
                
        const generatedDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const generatedDataWalletKey = generatedDataWalletKeyResult._unsafeUnwrap();

        const derivedDWAddress = cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            generatedDataWalletKey as EVMPrivateKey,
        );

        const returnsString = JSON.stringify(returns);
        const signableData = { // aka "types"
          consentContractId: consentContractAddress,
          queryCid: queryCid,
          dataWallet: derivedDWAddress,
          returns: returnsString,
        } as Record<string, unknown>;
    
        const signatureResult = await cryptoUtils.signTypedData(
            snickerdoodleSigningDomain,
            insightDeliveryTypes,
            signableData,
            generatedDataWalletKey,
        );
        const signature = signatureResult._unsafeUnwrap();
        
        // Resulting data must be verifiable.
        const verifiedAccountAddressResult = await cryptoUtils.verifyTypedData(
          snickerdoodleSigningDomain,
          insightDeliveryTypes,
          signableData,
          signature,
        );
        const verifiedAccountAddress = verifiedAccountAddressResult._unsafeUnwrap();
        
        expect(verifiedAccountAddress).toEqual(derivedDWAddress);

        console.log({
            consentContractId: consentContractAddress,
            queryCid: queryCid,
            dataWallet: derivedDWAddress,
            returns: returnsString,
            signature: signature,
        });
    });
});
