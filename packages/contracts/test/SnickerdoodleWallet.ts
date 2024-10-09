import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseGwei } from "viem";

describe("SnickerdoodleWallet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySnickerdoodleWallet() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const KEYID = "TAp_FZMZshG7RuJhiObFTQ";
    const QX =
      "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5";
    const QY =
      "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f";

    const sdwallet = await hre.ethers.deployContract("SnickerdoodleWallet", []);
    await sdwallet.initialize(owner.address, KEYID, QX, QY);

    return {
      sdwallet,
      owner,
      otherAccount,
      KEYID,
    };
  }

  describe("Access Control and Permissioning", function () {
    it("Use P256 to add and EVM Account", async function () {
      const { sdwallet, owner, KEYID } = await loadFixture(
        deploySnickerdoodleWallet,
      );

      const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
      const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
      const CLIENT_DATA_JSON_RIGHT =
        '","origin":"https://toddchapman.io","crossOrigin":false}';

      const CHALLENGE = "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954";

      const R_VALUE =
        "0x0895fecc5c53fe1d33888913da1a4f0cd0703e044cd61e559af5589b5ff1943b";
      const S_VALUE =
        "0xc958635b00097bf5f3ae74cdb366c38be69e19b0c48dd228164bc83043c0ff0b";

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

      // This function should throw an error since the P256 signature has already been used
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
      ).to.be.revertedWith("P256 signature already used.");
    });

    it("Can't add a P256 key that has already been added", async function () {
      const { sdwallet, owner, KEYID } = await loadFixture(
        deploySnickerdoodleWallet,
      );

      const NEW_KEYID = "89NRb6h8Q_tT4Kk0wlaX1w";
      const NEW_QX =
        "0xfb0e3ec7b21e63fb65950b5536458c3477e4c25b28ada57ac7e694d512aeec50";
      const NEW_QY =
        "0x3a0e44fe2117bbc15ce5f449638143c7997dad35397af5ad090e294fd0a4ca63";
      const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
      const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
      const CLIENT_DATA_JSON_RIGHT =
        '","origin":"https://toddchapman.io","crossOrigin":false}';
      const R_VALUE =
        "0x6f67f91bccea98550a87a0190b2d163611a30f37966ed7d0ec1b09e2a3c1f3f4";
      const S_VALUE =
        "0x25ffc2a9cd9dd4cd6b3dd82e7d58c65831074b2a3d7100acc9ef2d2d9dc40d2a";

      // This function should pass without throwing an error to pass P256 verification
      await expect(
        sdwallet.addP256KeyWithP256Key(
          KEYID,
          {
            authenticatorData: AUTH_DATA_BYTES,
            clientDataJSONLeft: CLIENT_DATA_JSON_LEFT,
            clientDataJSONRight: CLIENT_DATA_JSON_RIGHT,
          },
          NEW_KEYID,
          NEW_QX,
          NEW_QY,
          R_VALUE,
          S_VALUE,
        ),
      ).to.be.revertedWith("P256 key already added");
    });

    it("Use EVM Account to add and EVM Account", async function () {
      const { sdwallet, owner, KEYID } = await loadFixture(
        deploySnickerdoodleWallet,
      );

      const AUTH_DATA_BYTES = `0x${"d8a0bf4f8294146ab009857f0c54e7b47dd13980a9ce558becd61dbced0bd8411900000000"}`;
      const CLIENT_DATA_JSON_LEFT = '{"type":"webauthn.get","challenge":"';
      const CLIENT_DATA_JSON_RIGHT =
        '","origin":"https://toddchapman.io","crossOrigin":false,"other_keys_can_be_added_here":"do not compare clientDataJSON against a template. See https://goo.gl/yabPex"}';

      const CHALLENGE = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

      const R_VALUE =
        "0xa3fa13f9c485351d3b089876255ab94d8dfd71b60b317c151e6609c359e1abad";
      const S_VALUE =
        "0xd6357dab7b542cbdde588e3d80f88ce06dc5916eaefb9a319cc6a07cf1ec6555";

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

      await expect(
        sdwallet.addEVMAccountWithEVMAccount(
          "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954",
        ),
      )
        .to.emit(sdwallet, "EVMAccountAdded")
        .withArgs("0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954");

      await expect(
        sdwallet.addEVMAccountWithEVMAccount(
          "0x9fEad8B19C044C2f404dac38B925Ea16ADaa2954",
        ),
      ).to.be.revertedWith("EVM address already added to the wallet");
    });
  });
});
