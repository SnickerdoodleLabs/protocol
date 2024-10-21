const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("WDoodleToken", () => {
  // declare variables to be used in tests
  let WDoodleToken;
  let wDoodleToken;
  let accounts;
  let owner;
  let addr1;
  let distributor;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    addr1 = accounts[1];
    distributor = accounts[2];

    // deploy the Doodle Token contract
    WDoodleToken = await ethers.getContractFactory("WDoodleToken");
    wDoodleToken = await WDoodleToken.deploy(distributor.address);
    await wDoodleToken.deployed();
  });

  it("User deposits and receives the exact amount of WDoodles", async function () {
    await wDoodleToken.connect(addr1).depositAndWrap({
      value: ethers.utils.parseUnits("1", "ether"),
    });

    let balance = await wDoodleToken.balanceOf(addr1.address);

    expect(Number(ethers.utils.formatEther(balance))).to.eq(1);
  });

  it("User deposits then withdraws, receives native tokens", async function () {
    let provider = waffle.provider;

    let nativeTokensBeforeDeposit = await provider.getBalance(owner.address);
    let contractNativeBeforeDeposit = await provider.getBalance(
      wDoodleToken.address,
    );

    await wDoodleToken.connect(addr1).depositAndWrap({
      value: ethers.utils.parseUnits("1", "ether"),
    });

    let nativeTokensAfterDeposit = await provider.getBalance(addr1.address);
    let contractNativeAfterDeposit = await provider.getBalance(
      wDoodleToken.address,
    );

    let doodleBalanceAfterDeposit = await wDoodleToken.balanceOf(addr1.address);
    expect(Number(ethers.utils.formatEther(doodleBalanceAfterDeposit))).to.eq(
      1,
    );

    await wDoodleToken
      .connect(addr1)
      .unwrapAndWithdraw(ethers.utils.parseEther("1"));

    let doodleBalanceAfterWithdrawal = await wDoodleToken.balanceOf(
      addr1.address,
    );
    expect(
      Number(ethers.utils.formatEther(doodleBalanceAfterWithdrawal)),
    ).to.eq(0);

    let nativeTokensAfterWithdrawal = await provider.getBalance(addr1.address);
    let contractNativeAfterWithdrawal = await provider.getBalance(
      wDoodleToken.address,
    );

    expect(nativeTokensBeforeDeposit).to.be.above(nativeTokensAfterDeposit);
    expect(nativeTokensAfterWithdrawal).to.be.above(nativeTokensAfterDeposit);
    expect(nativeTokensAfterWithdrawal).to.be.above(nativeTokensAfterDeposit);

    expect(contractNativeBeforeDeposit).to.be.eq(0);
    expect(
      Number(ethers.utils.formatEther(contractNativeAfterDeposit)),
    ).to.be.eq(1);
    expect(contractNativeAfterWithdrawal).to.be.eq(0);
  });

  it("User withdraws more than deposited", async function () {
    await wDoodleToken.connect(addr1).depositAndWrap({
      value: ethers.utils.parseUnits("1", "ether"),
    });

    await expect(
      wDoodleToken
        .connect(addr1)
        .unwrapAndWithdraw(ethers.utils.parseEther("2")),
    ).to.revertedWith("ERC20: burn amount exceeds balance");
  });
});
