import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Storage Hashing", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployStorageHash() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const StorageHash = await ethers.getContractFactory("StorageHash");
    const storageHash = await StorageHash.deploy();

    return { storageHash, owner, otherAccount };
  }

  describe("Compute Storage Slot Locations", function () {
    it("Should output storage location of ContentFactory contract", async function () {
      const { storageHash, owner, otherAccount } = await loadFixture(
        deployStorageHash,
      );

      const ContentFactoryStorageSlot = await storageHash.ContentFactory();
      expect(ContentFactoryStorageSlot).to.equal(
        "0x584565e90fa9ec9ac82afca62b5a80e321f6d503f72d0884875cf353a2703f00",
      );
    });

    it("Should output storage location of ContentObject contract", async function () {
      const { storageHash, owner, otherAccount } = await loadFixture(
        deployStorageHash,
      );

      const ContentObjectStorageSlot = await storageHash.ContentObject();
      expect(ContentObjectStorageSlot).to.equal(
        "0x1f22a6cf75eb7fcaad2fabbc6dbce35f91d9ea3ad7582b03d6421676b0930e00",
      );
    });

    it("Should output storage location of ERC7529 contract", async function () {
      const { storageHash, owner, otherAccount } = await loadFixture(
        deployStorageHash,
      );

      const ERC7529StorageSlot = await storageHash.ERC7529();
      expect(ERC7529StorageSlot).to.equal(
        "0x29912872bb1868dd74efe86230a05098a24ae1f39d64ec2129d982442801ac00",
      );
    });

    it("Should output storage location of Pauseable contract", async function () {
      const { storageHash, owner, otherAccount } = await loadFixture(
        deployStorageHash,
      );

      const PausableStorageSlot = await storageHash.Pausable();
      expect(PausableStorageSlot).to.equal(
        "0xcd5ed15c6e187e77e9aee88184c21f4f2182ab5827cb3b7e07fbedcd63f03300",
      );
    });
  });
});
