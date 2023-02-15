const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sift", () => {
  // declare variables to be used in tests
  let Sift;
  let sift;
  let accounts;
  let owner;

  const verifierRoleBytes = ethers.utils.id("VERIFIER_ROLE");
  const defaultAdminRoleBytes = ethers.utils.formatBytes32String(0); //bytes for DEFAULT_ADMIN_ROLE on the contract is 0 by default

  beforeEach(async () => {
    // get a list of signers the tests can use
    accounts = await hre.ethers.getSigners();
    owner = accounts[0];

    // deploy the Crumbs contract before each test
    Sift = await ethers.getContractFactory("Sift");

    sift = await Sift.deploy("www.sift.com/");

    await sift.deployed();
  });

  describe("verifyEntity", function () {
    it("Allows address with VERIFIER_ROLE to verify a url.", async function () {
      // accounts 1 creates a crumb
      await sift
        .connect(owner)
        .verifyEntity("www.uniswap.com", owner.address, "website metadata");

      // check token balance of the account has 1
      const tokenCount = await sift.balanceOf(owner.address);
      expect(tokenCount).to.eq(1);

      // check token's uri
      const tokenURI = await sift.tokenURI(1);
      expect(tokenURI).to.eq("www.sift.com/1");

      // check total supply
      const totalSupply = await sift.totalSupply();
      expect(totalSupply).to.eq(1);
    });

    it("Does not allow address without VERIFIER_ROLE to verify a url.", async function () {
      // account 1 verifies a url
      await expect(
        sift
          .connect(accounts[1])
          .verifyEntity("www.uniswap.com", owner.address, "website metadata"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${verifierRoleBytes}`,
      );
    });

    it("Does not allow user to verify a url twice.", async function () {
      // account 1 verifies a url
      await sift
        .connect(owner)
        .verifyEntity("www.uniswap.com", owner.address, "website metadata");

      //account 1 tries to verify the same url

      await expect(
        sift
          .connect(owner)
          .verifyEntity("www.uniswap.com", owner.address, "website metadata"),
      ).to.revertedWith("Consent: Entity already verified");
    });
  });

  describe("maliciousEntity", function () {
    it("Allows address with VERIFIER_ROLE to register a url as malicious.", async function () {
      // accounts 1 creates a crumb
      await sift
        .connect(owner)
        .maliciousEntity("www.uniswop.com", owner.address, "website metadata");

      // check token balance of the account has 1
      const tokenCount = await sift.balanceOf(owner.address);
      expect(tokenCount).to.eq(1);

      // check token's uri
      const tokenURI = await sift.tokenURI(1);
      expect(tokenURI).to.eq("www.sift.com/1");

      // check total supply
      const totalSupply = await sift.totalSupply();
      expect(totalSupply).to.eq(1);
    });

    it("Does not allow address without VERIFIER_ROLE to register a url as malicious.", async function () {
      // accounts 1 creates a crumb
      await expect(
        sift
          .connect(accounts[1])
          .maliciousEntity(
            "www.uniswpp.com",
            owner.address,
            "website metadata",
          ),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${verifierRoleBytes}`,
      );
    });
  });

  describe("checkEntities", function () {
    it("Returns the VERIFIED URI for a verified URL", async function () {
      // accounts 1 creates a crumb
      await sift
        .connect(owner)
        .verifyEntity("www.uniswap.com", owner.address, "website metadata");

      // check url
      const result = await sift.checkEntities(["www.uniswap.com"]);
      expect(result[0]["metadata"]).to.eq("website metadata");
      expect(result[0]["status"]).to.eq(1);
    });

    it("Returns the MALICIOUS URI for a verified URL", async function () {
      // accounts 1 creates a crumb
      await sift
        .connect(owner)
        .maliciousEntity("www.uniswop.com", owner.address, "website metadata");

      // check url
      const result = await sift.checkEntities(["www.uniswop.com"]);
      expect(result[0]["metadata"]).to.eq("website metadata");
      expect(result[0]["status"]).to.eq(2);
    });

    it("Returns the NOT VERIFIED string for a URL that has not been registered", async function () {
      // check url
      const result = await sift.checkEntities(["www.test.com"]);
      expect(result[0]["status"]).to.eq(0);
    });

    it("Returns 3 values: 1 verfied, 1 malicious, 1 not verified", async function () {
      // check url
      // accounts 1 creates a crumb
      await sift
        .connect(owner)
        .verifyEntity("www.uniswap.com", owner.address, "good metadata");
      await sift
        .connect(owner)
        .maliciousEntity("www.uniswop.com", owner.address, "bad metadata");

      // check url
      const result = await sift.checkEntities([
        "www.uniswap.com",
        "www.uniswop.com",
        "AVAX NFT",
      ]);
      expect(result[0]["metadata"]).to.eq("good metadata");
      expect(result[0]["status"]).to.eq(1);

      expect(result[1]["metadata"]).to.eq("bad metadata");
      expect(result[1]["status"]).to.eq(2);

      expect(result[2]["status"]).to.eq(0);
    });
  });

  describe("setBaseURI", function () {
    it("Sets the baseURI", async function () {
      await sift.connect(owner).setBaseURI("www.sift2.com");

      const currentURI = await sift.baseURI();
      // check token balance of the account has none.
      expect(currentURI).to.eq("www.sift2.com");
    });

    it("Address without DEFAULT_ADMIN_ROLE sets baseURI.", async function () {
      await expect(
        sift.connect(accounts[1]).setBaseURI("www.sift2.com"),
      ).to.revertedWith(
        `AccessControl: account ${accounts[1].address.toLowerCase()} is missing role ${defaultAdminRoleBytes}`,
      );
    });
  });

  describe("supportInterface", function () {
    it("Returns true that EIP165 interface is supported", async function () {
      expect(await sift.supportsInterface(0x01ffc9a7)).to.eq(true);
    });
  });
});
