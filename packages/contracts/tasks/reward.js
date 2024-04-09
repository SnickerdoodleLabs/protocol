const { REWARD, logTXDetails } = require("./constants.js");

task("rewardGrantRole", "Grant role on reward")
  .addParam("rewardaddress", "Reward contract address")
  .addParam("grantee", "Address to grant role")
  .addParam("role", "Role to grant")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const url = taskArgs.url;
    const urlOwner = taskArgs.owner;

    // attach the first signer account to the consent contract handle
    const rewardContractHandle = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      REWARD().abi,
      account,
    );

    await rewardContractHandle
      .grantRole(taskArgs.role, taskArgs.grantee)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });
