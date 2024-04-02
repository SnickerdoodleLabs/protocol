/* import { BigNumberString } from "@snickerdoodlelabs/objects";
import { Encoding, Field, Poseidon } from "o1js";

export class CircuitUtils {
  static getHashFromString(input: string): BigNumberString {
    return CircuitUtils.fieldToBNS(
      Poseidon.hash(Encoding.stringToFields(input)),
    );
  }

  static fieldToBNS(field: Field): BigNumberString {
    return BigNumberString(field.toBigInt().toString());
  }

  static bnsToField(bns: BigNumberString): Field {
    return new Field(BigInt(bns));
  }
}
 */
