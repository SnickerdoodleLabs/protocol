

import { ResultAsync, okAsync } from "neverthrow";
import {
    EVMAccountAddress,
    HexString,
    Signature,
} from "@snickerdoodlelabs/objects";

import {
    TypedDataDomain,
    TypedDataField,
} from "@ethersproject/abstract-signer";

import { BigNumber, ethers } from "ethers";

import { CryptoUtilsMocks } from "../mocks/CryptoUtilsMocks";


export class InsightAPISignatureGenerator {

    public async getTestSignature(): Promise<ResultAsync<Signature, never>> {
        
        const mocks = new CryptoUtilsMocks();
        const utils = mocks.factoryCryptoUtils();

        const privateKeyResult = await utils.createEthereumPrivateKey();
        const privateKey = privateKeyResult._unsafeUnwrap();

        const valueToSign = {
            testAddress: EVMAccountAddress(
                "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            ),
            testString: "Muktadir is king",
            testBigInt: BigNumber.from(69),
            testBytes: HexString("0x0123456789ABCDEF"),
        };

        const testDomain = {
            name: "Snickerdoodle Protocol",
            version: "1",
        } as TypedDataDomain;

        const testTypes: Record<string, TypedDataField[]> = {
            TestData: [
                { name: "testAddress", type: "address" },
                { name: "testString", type: "string" },
                { name: "testBigInt", type: "uint256" },
                { name: "testBytes", type: "bytes" },
            ],
        };

        const result = await utils.signTypedData(testDomain, testTypes, valueToSign, privateKey);
        return result;
    }

}

