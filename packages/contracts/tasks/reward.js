const { REWARD, logTXDetails } = require("./constants.js");

// These tasks are mainly needed to test the pre-mint NFT feature. The following scenarios need to be simulated on DoodleChain:-
// Assuming we have 3 users,
// A - the owner of an NFT contract
// B - the owner of the wallet that has minted/purchased some NFTs from the contract above
// C - the escrow wallet SDL generates for them on the marketing platform

// Steps to setup pre-mint testing:
// 1. Wallet A deploys an NFT contract - done by deployment script
// 2. Wallet A mints some NFTs to Wallet B - done by deployment script
// 3. Wallet B now has pre-minted NFTs and wants to approve their escrow wallet to transfer rewards on their behalf - cannot be done by deployment script because we don't know what the user's escrow wallet is yet

// With these tasks, when we run against DoodleChain, we can enter the docker image and run these hardhat tasks to carry out external activities for the Wallet A and B. eg. minting more tokens, transferring, setting approvals, checking for approvals

task(
  "setApprovalForAll",
  "Approves an operator to transact all tokens belonging to caller",
)
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .addParam("rewardaddress", "Address of reward contract")
  .addParam("operator", "Address of operator to approve")
  .addParam("approved", "Approval boolean")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const rewardContractHandle = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      REWARD().abi,
      account,
    );

    let approved = true;

    // received as string
    if (taskArgs.approved == "false") {
      approved = false;
    }

    await rewardContractHandle
      .setApprovalForAll(taskArgs.operator, approved)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("safeTransferFrom", "Transfers a token")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .addParam("rewardaddress", "Address of reward contract")
  .addParam("from", "Address that owns the token")
  .addParam("to", "Address receiving the token")
  .addParam("tokenid", "Token id to transfer")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const rewardContractHandle = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      REWARD().abi,
      account,
    );

    // Write contract call this way because safeTransferFrom is an overloaded function
    await rewardContractHandle["safeTransferFrom(address,address,uint256)"](
      taskArgs.from,
      taskArgs.to,
      taskArgs.tokenid,
    )
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("safeMint", "Transfers a token")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .addParam("rewardaddress", "Address of reward contract")
  .addParam("to", "Address receiving the token")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const rewardContractHandle = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      REWARD().abi,
      account,
    );

    let approved = true;

    if (taskArgs == false) {
      approved = false;
    }

    await rewardContractHandle
      .safeMint(taskArgs.to)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("isApprovedForAll", "Checks if an operator is approved by a token owner")
  .addParam("rewardaddress", "Address of token owner")
  .addParam("owner", "Address of token owner")
  .addParam("operator", "Address of operator")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const rewardContractHandle = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      REWARD().abi,
      account,
    );

    const approved = await rewardContractHandle.isApprovedForAll(
      taskArgs.owner,
      taskArgs.operator,
    );

    console.log(
      `Is ${taskArgs.operator} approved by ${taskArgs.owner} ? : ${approved}`,
    );
  });
