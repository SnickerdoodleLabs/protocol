import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

const KEYID = "abc123";
const QX = "0x91bb3be0106203c6877db6a2c65a87e725e3c741dfb4e16e39500cdeb9aab4bf";
const QY = "0xef8fbbbd1e8ebd360a5f5926087c1c9504c5242ab14a19039d3986049f935bde";

const R_VALUE =
  "0xed38e18c1f51e89955af377177a7baeab24340c200d3d80d5cc24ef49021c7ea";
const S_VALUE =
  "0xb7a4b31248b03d497ac394b85d229f6b29d966f0ec31d85c702e94afc6bbdb0f";

const HASH =
  "0x4d8312397eb36a700156cc29be35c925372532d7bc42fa34b1c9df72c721ebec";

const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
const CHALLENGE = "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954";

const CHALLENGE_BASE64 = "n-rYsZwETC9ATaw4uSXqFq2qKVQ";
const CLIENT_DATA_JSON_RIGHT =
  '","origin":"https://toddchapman.io","crossOrigin":false}';

describe("SnickerdoodleWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySnickerdoodleWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const sdwallet = await hre.ethers.deployContract("SnickerdoodleWallet", []);
    await sdwallet.initialize(owner.address, KEYID, QX, QY);

    return {
      sdwallet,
      owner,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should verify a P256 signature", async function () {
      const { sdwallet, owner } = await loadFixture(deploySnickerdoodleWallet);

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addEVMAddressWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          CHALLENGE,
          R_VALUE,
          S_VALUE,
        ),
      )
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs(CHALLENGE);
    });
  });
});
