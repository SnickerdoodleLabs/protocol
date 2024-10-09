import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

const KEYID = "89NRb6h8Q_tT4Kk0wlaX1w";
const QX = "0xfb0e3ec7b21e63fb65950b5536458c3477e4c25b28ada57ac7e694d512aeec50";
const QY = "0x3a0e44fe2117bbc15ce5f449638143c7997dad35397af5ad090e294fd0a4ca63";

const R_VALUE =
  "0x4ac1f2abb8e63185d578d7866e3a5239306b9f28e4f91ec0cecd16df07805050";
const S_VALUE =
  "0x86d2260f4071b23c12ec05d035a0baa2e9842f3df22c254056351850ad0ffb60";

const HASH =
  "0xb8f0f2f89968dcbbad58b6fae181bddd52961179ee75a2faef74e15005296728";

const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
const CHALLENGE = "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954";

const CHALLENGE_BASE64 =
  "ODlOUmI2aDhRX3RUNEtrMHdsYVgxd_sOPseyHmP7ZZULVTZFjDR35MJbKK2lesfmlNUSruxQOg5E_iEXu8Fc5fRJY4FDx5l9rTU5evWtCQ4pT9CkymM";
const CLIENT_DATA_JSON_RIGHT =
  '","origin":"https://toddchapman.io","crossOrigin":false}';

describe("SnickerdoodleWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySnickerdoodleWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const sdwallet = await hre.viem.deployContract("SnickerdoodleWallet", []);
    await sdwallet.write.initialize(owner.account.address, KEYID, QX, QY);

    const publicClient = await hre.viem.getPublicClient();

    return {
      sdwallet,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should verify a P256 signature", async function () {
      const { sdwallet, owner } = await loadFixture(deploySnickerdoodleWallet);
    });
  });
});
