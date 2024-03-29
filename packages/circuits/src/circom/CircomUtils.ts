import { PoseidonHash } from "@snickerdoodlelabs/objects";
import {
  poseidon1,
  poseidon2,
  poseidon3,
  poseidon4,
  poseidon5,
  poseidon6,
  poseidon7,
  poseidon8,
  poseidon9,
  poseidon10,
  poseidon11,
  poseidon12,
  poseidon13,
  poseidon14,
  poseidon15,
  poseidon16,
} from "poseidon-lite";

export class CircomUtils {
  static F_pPrime =
    21888242871839275222246405745257275088548364400416034343698204186575808495617n;

  static moduloMultiply(a: bigint, b: bigint): bigint {
    return (a * b) % CircomUtils.F_pPrime;
  }

  static moduloAdd(a: bigint, b: bigint): bigint {
    return (a + b) % CircomUtils.F_pPrime;
  }

  static moduleSubtract(a: bigint, b: bigint): bigint {
    return (a - b + CircomUtils.F_pPrime) % CircomUtils.F_pPrime;
  }

  static moduloDivide(a: bigint, b: bigint): bigint {
    return CircomUtils.moduloMultiply(a, CircomUtils.moduloInverse(b));
  }

  static moduloInverse(a: bigint): bigint {
    return CircomUtils.moduloExponentiate(a, CircomUtils.F_pPrime - 2n);
  }

  static moduloExponentiate(base: bigint, exponent: bigint): bigint {
    let result = 1n;
    while (exponent > 0) {
      if (exponent % 2n === 1n) {
        result = CircomUtils.moduloMultiply(result, base);
      }
      exponent = exponent / 2n;
      base = CircomUtils.moduloMultiply(base, base);
    }
    return result;
  }

  static stringToPoseidonHash(input: string): PoseidonHash {
    const fields = CircomUtils.stringToFields(input);

    if (fields.length == 1) {
      return PoseidonHash(poseidon1(fields));
    } else if (fields.length == 2) {
      return PoseidonHash(poseidon2(fields));
    } else if (fields.length == 3) {
      return PoseidonHash(poseidon3(fields));
    } else if (fields.length == 4) {
      return PoseidonHash(poseidon4(fields));
    } else if (fields.length == 5) {
      return PoseidonHash(poseidon5(fields));
    } else if (fields.length == 6) {
      return PoseidonHash(poseidon6(fields));
    } else if (fields.length == 7) {
      return PoseidonHash(poseidon7(fields));
    } else if (fields.length == 8) {
      return PoseidonHash(poseidon8(fields));
    } else if (fields.length == 9) {
      return PoseidonHash(poseidon9(fields));
    } else if (fields.length == 10) {
      return PoseidonHash(poseidon10(fields));
    } else if (fields.length == 11) {
      return PoseidonHash(poseidon11(fields));
    } else if (fields.length == 12) {
      return PoseidonHash(poseidon12(fields));
    } else if (fields.length == 13) {
      return PoseidonHash(poseidon13(fields));
    } else if (fields.length == 14) {
      return PoseidonHash(poseidon14(fields));
    } else if (fields.length == 15) {
      return PoseidonHash(poseidon15(fields));
    } else if (fields.length == 16) {
      return PoseidonHash(poseidon16(fields));
    }

    // If the message is longer than 16 fields, we need to break it up into chunks
    // TODO
    throw new Error("Message too long");
  }

  static STOP = 0x01;
  static bytesToFields(bytes: Uint8Array): bigint[] {
    // we encode 248 bits (31 bytes) at a time into one field element
    const fields = new Array<bigint>();
    let currentBigInt = 0n;
    let bitPosition = 0n;
    for (const byte of bytes) {
      currentBigInt += BigInt(byte) << bitPosition;
      bitPosition += 8n;
      if (bitPosition === 248n) {
        fields.push(currentBigInt);
        currentBigInt = 0n;
        bitPosition = 0n;
      }
    }
    // encode the final chunk, with an added STOP byte to make the mapping invertible
    currentBigInt += BigInt(CircomUtils.STOP) << bitPosition;
    fields.push(currentBigInt);
    return fields;
  }

  static stringToFields(message: string): bigint[] {
    const bytes = new TextEncoder().encode(message);
    return CircomUtils.bytesToFields(bytes);
  }
}
