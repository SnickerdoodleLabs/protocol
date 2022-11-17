import "reflect-metadata";

import { BigNumberString, EVMAccountAddress, EVMContractAddress, EVMPrivateKey, HexString, IDynamicRewardParameter, InsightString, IpfsCID, Signature } from "@snickerdoodlelabs/objects";

import { CryptoUtilsMocks } from "@test-harness-test/mocks/CryptoUtilsMocks";
import { executeMetatransactionTypes, insightDeliveryTypes, insightPreviewTypes, snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";


// Parameters for /insights/responses
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
const rewardParameters = [

] as IDynamicRewardParameter[];

// Parameters for /insights/responses/preview
const answeredQueries = [
    "some string"
] as InsightString[]; // pass to deliverInsights as "insigts".

// Parameters for /metatransaction
const accountAddress = EVMAccountAddress(
    "0xE451980132E65465d0a498c53f0b5227326Dd73F"
);
const nonce = BigNumberString("1");
const data = HexString("0x00123456789abcdf");
const evmAddCrumbMetatransactionSignature = Signature(
    "evmAddCrumbMetatransactionSignature"
  );

describe("Sign proper data for InsigtPlatform APIs", () => {


    test("insights/responses", async () => {

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
                
        const generatedDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const generatedDataWalletKey = generatedDataWalletKeyResult._unsafeUnwrap();

        const derivedDWAddress = cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            generatedDataWalletKey as EVMPrivateKey,
        );

        const signableData = { // aka "types"
          consentContractId: consentContractAddress,
          queryCid: queryCid,
          dataWallet: derivedDWAddress,
          returns: JSON.stringify(returns),
          rewardParameters: JSON.stringify(rewardParameters || []),
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

        console.log("/insights/responses");
        console.log("{" + "\n" +
            "\"consentContractId\": \"" + consentContractAddress + "\",\n" +
            "\"queryCid\": \"" + queryCid + "\",\n" +
            "\"dataWallet\": \"" + derivedDWAddress + "\",\n" +
            "\"returns\": \"" + returns + "\",\n" +
            "\"rewardParameters\": \"" + rewardParameters + "\",\n" +
            "\"signature\": \"" + signature + "\"\n" +
            "}"
        );
    });


    test("/insights/responses/preview", async () => {

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
        
        const generatedDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const generatedDataWalletKey = generatedDataWalletKeyResult._unsafeUnwrap();

        const derivedDWAddress = cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            generatedDataWalletKey as EVMPrivateKey,
        );

        const signableData = {
            consentContractId: consentContractAddress,
            dataWallet: derivedDWAddress,
            queryCID: queryCid,
            queries: JSON.stringify(answeredQueries),
        } as Record<string, unknown>;

        const signatureResult = await cryptoUtils.signTypedData(
            snickerdoodleSigningDomain,
            insightPreviewTypes,
            signableData,
            generatedDataWalletKey,
        );
        const signature = signatureResult._unsafeUnwrap();

        const verifiedAccountAddressResult = await cryptoUtils.verifyTypedData(
            snickerdoodleSigningDomain,
            insightPreviewTypes,
            signableData,
            signature,
        );
        const verifiedAccountAddress = verifiedAccountAddressResult._unsafeUnwrap();
        
        expect(verifiedAccountAddress).toEqual(derivedDWAddress);

        console.log("/insights/responses/preview");
        console.log("{" + "\n" +
            "\"consentContractId\": \"" + consentContractAddress + "\",\n" +
            "\"queryCID\": \"" + queryCid + "\",\n" +
            "\"dataWallet\": \"" + derivedDWAddress + "\",\n" +
            "\"queries\": \"" + answeredQueries + "\",\n" +
            "\"signature\": \"" + signature + "\"\n" +
            "}"
        );
    });


    test("/metatransaction", async () => {

        const cryptoUtilMock = new CryptoUtilsMocks();
        const cryptoUtils = cryptoUtilMock.factoryCryptoUtils();
        
        const generatedDataWalletKeyResult = await cryptoUtils.createEthereumPrivateKey();
        const generatedDataWalletKey = generatedDataWalletKeyResult._unsafeUnwrap();

        const derivedDWAddress = cryptoUtils.getEthereumAccountAddressFromPrivateKey(
            generatedDataWalletKey as EVMPrivateKey,
        );

        const signableData = {
            dataWallet: derivedDWAddress,
            accountAddress: accountAddress,
            contractAddress: consentContractAddress,
            nonce: nonce,
            data: data,
            metatransactionSignature: evmAddCrumbMetatransactionSignature,
          } as Record<string, unknown>;

        const signatureResult = await cryptoUtils.signTypedData(
            snickerdoodleSigningDomain,
            executeMetatransactionTypes,
            signableData,
            generatedDataWalletKey,
        );
        const signature = signatureResult._unsafeUnwrap();

        const verifiedAccountAddressResult = await cryptoUtils.verifyTypedData(
            snickerdoodleSigningDomain,
            executeMetatransactionTypes,
            signableData,
            signature,
        );
        const verifiedAccountAddress = verifiedAccountAddressResult._unsafeUnwrap();
        
        expect(verifiedAccountAddress).toEqual(derivedDWAddress);

        console.log("/metatransaction");
        console.log("{" + "\n" +
            "\"dataWalletAddress\": \"" + derivedDWAddress + "\",\n" +
            "\"accountAddress\": \"" + accountAddress + "\",\n" +
            "\"contractAddress\": \"" + consentContractAddress + "\",\n" +
            "\"nonce\": \"" + nonce + "\",\n" +
            "\"data\": \"" + data + "\",\n" +
            "\"metatransactionSignature\": \"" + evmAddCrumbMetatransactionSignature + "\",\n" +
            "\"requestSignature\": \"" + signature + "\"\n" +
            "}"
        );
    });

});
