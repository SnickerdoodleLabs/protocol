const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crumbs", () => {
  // declare variables to be used in tests
  let Crumbs;
  let crumbs;
  let accounts;
  let trustedForwarder;

  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    // get a list of signers the tests can use
    accounts = await hre.ethers.getSigners();

    trustedForwarder = accounts[19];

    // deploy the Crumbs contract before each test
    Crumbs = await ethers.getContractFactory("Crumbs");

    crumbs = await Crumbs.deploy(trustedForwarder.address, "www.crumbs.com/");

    await crumbs.deployed();
  });

  describe("createCrumb", function () {
    it("Allows any address to create a crumb.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // check token balance of the account has 1
      const tokenCount = await crumbs.balanceOf(accounts[1].address);
      expect(tokenCount).to.eq(1);

      // check token's uri
      const tokenURI = await crumbs.tokenURI(1);
      expect(tokenURI).to.eq(
        "www.crumbs.com/0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
      );
    });

    it("Does not allow creating the with a crumb id that exists.", async function () {
      // accounts 1 creates a crumb with id 1
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 2 creates a crumb with id 1 as well
      await expect(
        crumbs
          .connect(accounts[2])
          .createCrumb(
            1,
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          ),
      ).to.revertedWith("ERC721: token already minted");
    });

    it("Does not allow an address to create another crumb if it already has a crumb mapped to it.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 tries to create another crumb
      await expect(
        crumbs
          .connect(accounts[1])
          .createCrumb(
            2,
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
          ),
      ).to.revertedWith("Crumb: Address already has a crumb");
    });

    it("Once transfered, the crumb id gets remapped to the new owner and original owner can create another crumb.", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 transfers away his crumb
      await crumbs
        .connect(accounts[1])
        .transferFrom(accounts[1].address, accounts[2].address, 1);

      // accounts 1 tries to create another crumb
      const crumbId = await crumbs
        .connect(accounts[1])
        .addressToCrumbId(accounts[2].address);

      // check if second address maps to the transfered crumb id
      expect(crumbId).to.eq(1);

      // accounts 1 can create a new crumb after transfering
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          2,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );
    });
  });

  describe("burnCrumb", function () {
    it("Allows any address to burn its crumb", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 burns his crumb
      await crumbs.connect(accounts[1]).burnCrumb(1);

      // check token balance of the account has none.
      expect(await crumbs.balanceOf(accounts[1].address)).to.eq(0);

      // check that total supply is descreased to 0
      expect(await crumbs.totalSupply()).to.eq(0);
    });

    it("Address burns crumb, another user can use the crumb id", async function () {
      // accounts 1 creates a crumb
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // accounts 1 burns his crumb
      await crumbs.connect(accounts[1]).burnCrumb(1);

      // accounts 2 creates a crumb with the burnt id
      await crumbs
        .connect(accounts[2])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      // check token balance of the account has none.
      expect(await crumbs.balanceOf(accounts[1].address)).to.eq(0);
      expect(await crumbs.balanceOf(accounts[2].address)).to.eq(1);

      // check that total supply is correct
      expect(await crumbs.totalSupply()).to.eq(1);
    });

    it("Does not allow an address to burn another user's crumb.", async function () {
      await crumbs
        .connect(accounts[1])
        .createCrumb(
          1,
          "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        );

      await expect(crumbs.connect(accounts[2]).burnCrumb(1)).to.revertedWith(
        "ERC721Burnable: caller is not owner nor approved",
      );
    });
  });

  describe("setBaseURI", function () {
    it("Sets the baseURI", async function () {
      await crumbs.connect(accounts[0]).setBaseURI("www.crumbs.com");

      const currentURI = await crumbs.baseURI();
      // check token balance of the account has none.
      expect(currentURI).to.eq("www.crumbs.com");
    });

    it("Address without DEFAULT_ADMIN_ROLE sets baseURI.", async function () {
      await expect(
        crumbs.connect(accounts[1]).setBaseURI("www.crumbs.com"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("supportInterface", function () {
    it("Returns true that EIP165 interface is supported", async function () {
      expect(await crumbs.supportsInterface(0x01ffc9a7)).to.eq(true);
    });
  });
});
