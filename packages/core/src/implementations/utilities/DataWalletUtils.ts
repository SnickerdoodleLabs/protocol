import { IDataWalletUtils } from "@core/interfaces/utilities";
import { EVMPrivateKey, Signature, AESKey } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync } from "neverthrow";

@injectable()
export class DataWalletUtils implements IDataWalletUtils {
    public createDataWalletKey(): ResultAsync<EVMPrivateKey, never> {
        throw new Error("Method not implemented.");
    }

    public deriveEncryptionKeyFromSignature(signature: Signature): ResultAsync<AESKey, never> {
        throw new Error("Method not implemented.");
    }

}