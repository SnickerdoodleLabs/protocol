import { utils } from "ethers";

import { EWalletDataType } from "@objects/enum/index.js";
import { HexString32 } from "@objects/primitives/index.js";

/**
 * DataPermissions represent the rules to follow when processing queries for a particular
 * cohort. They are basically auto-reject rules to follow that are baked into the consent
 * token itself in the Token URI.
 */
export class DataPermissions {
  public constructor(protected readonly agreementFlags: HexString32) {
    const flagLength = utils.arrayify(agreementFlags).length;
    if (flagLength != 32) {
      throw new Error(
        `Invalid HexString32 passed to DataPermissions! Provided flags have ${flagLength} bytes and should have 32!`,
      );
    }
  }

  public getFlags(): HexString32 {
    return this.agreementFlags;
  }

  public eq(otherFlags: HexString32): boolean {
    return this.agreementFlags === otherFlags;
  }

  public contains(other: DataPermissions): boolean {
    // convert each set of flags to a Uint8Array
    const flagsArray = utils.arrayify(this.agreementFlags);
    const otherFlagsArray = utils.arrayify(other.getFlags());

    // Loop over each byte in our flags, AND it with the other flags,
    // and see if it's the same
    for (let i = 0; i < 32; i++) {
      if ((flagsArray[i] & otherFlagsArray[i]) != otherFlagsArray[i]) {
        return false;
      }
    }
    return true;
  }

  public get Age(): boolean {
    return this.getFlag(EWalletDataType.Age);
  }
  public get Gender(): boolean {
    return this.getFlag(EWalletDataType.Gender);
  }
  public get GivenName(): boolean {
    return this.getFlag(EWalletDataType.GivenName);
  }
  public get FamilyName(): boolean {
    return this.getFlag(EWalletDataType.FamilyName);
  }
  public get Birthday(): boolean {
    return this.getFlag(EWalletDataType.Birthday);
  }
  public get Email(): boolean {
    return this.getFlag(EWalletDataType.Email);
  }
  public get Location(): boolean {
    return this.getFlag(EWalletDataType.Location);
  }
  public get SiteVisits(): boolean {
    return this.getFlag(EWalletDataType.SiteVisits);
  }
  public get EVMTransactions(): boolean {
    return this.getFlag(EWalletDataType.EVMTransactions);
  }
  public get AccountBalances(): boolean {
    return this.getFlag(EWalletDataType.AccountBalances);
  }
  public get AccountNFTs(): boolean {
    return this.getFlag(EWalletDataType.AccountNFTs);
  }
  public get LatestBlockNumber(): boolean {
    return this.getFlag(EWalletDataType.LatestBlockNumber);
  }
  public get Discord(): boolean {
    return this.getFlag(EWalletDataType.Discord);
  }
  public get Twitter(): boolean {
    return this.getFlag(EWalletDataType.Twitter);
  }

  public getFlag(flagNumber: number): boolean {
    // Convert the flags hex string to a Uint8Array
    const flagsArray = utils.arrayify(this.agreementFlags);

    // Figure out which byte the flag is in
    // This is a fancy trick to drop the decimal portion of the number
    // https://www.delftstack.com/howto/javascript/javascript-float-to-int/
    // 123.321 | 0 = 123
    const byteNumber = (flagNumber / 8) | 0;

    // And the actual bit
    const bitNumber = flagNumber % 8;

    // Now the fancy bit manipulation
    // 1 << bitNumber creates a mask, AND that with the correct byte,
    // if that is greater than 0 it's set.
    return (flagsArray[byteNumber] & (1 << bitNumber)) > 0;
  }

  static get allPermissionsHexString(): HexString32 {
    return HexString32(
      "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
    );
  }

  static createWithAllPermissions(): DataPermissions {
    return new DataPermissions(DataPermissions.allPermissionsHexString);
  }

  static createWithPermissions(dataTypes: EWalletDataType[]): DataPermissions {
    // Create a Uint8Array with 32 bytes
    const flagsArray = new Uint8Array(32);

    // Loop over the data types and set the bit
    dataTypes.forEach((dataType) => {
      const byteNumber = (dataType / 8) | 0;
      const bitNumber = dataType % 8;

      // Now the fancy bit manipulation
      flagsArray[byteNumber] |= 1 << bitNumber;
    });

    return new DataPermissions(HexString32(utils.hexlify(flagsArray)));
  }
}
