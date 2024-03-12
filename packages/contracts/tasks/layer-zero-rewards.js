const {
  OFT20REWARD,
  ONFT721REWARD,
  crumbsContract,
  logTXDetails,
} = require("./constants.js");

task("setPeer", "Hooks up OFT20Reward contracts on the target chains together")
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam("peercontract", "The OFT20Reward contract on the target chain")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .setAction(async (taskArgs) => {
    const eid = taskArgs.eid;
    let peerContract = taskArgs.peercontract;

    // Formet it to bytes32
    const padding = "0x000000000000000000000000";
    peerContract = padding.concat(peerContract.substring(2));

    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const oft20RewardContractHandle = new hre.ethers.Contract(
      taskArgs.currentcontract,
      OFT20REWARD().abi,
      account,
    );

    await oft20RewardContractHandle
      .setPeer(eid, peerContract)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("quoteSend", "Get the gas price needed to call send()")
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .setAction(async (taskArgs) => {
    // The SendParams
    /* struct SendParam {
        uint32 dstEid; // Destination endpoint ID.
        bytes32 to; // Recipient address.
        uint256 amountLD; // Amount to send in local decimals.
        uint256 minAmountLD; // Minimum amount to send in local decimals.
        bytes extraOptions; // Additional options supplied by the caller to be used in the LayerZero message.
        bytes composeMsg; // The composed message for the send() operation.
        bytes oftCmd; // The OFT command to be executed, unused in default OFT implementations.
    } */

    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    const sendParams = {
      dstEid: taskArgs.eid,
      to: padding(accounts[1].address),
      amountLD: 2000000000,
      minAmountLD: 1500000000,
      extraOptions: [],
      composeMsg: [],
      oftCmd: [],
    };

    // attach the first signer account to the consent contract handle
    const oft20RewardContractHandle = new hre.ethers.Contract(
      taskArgs.currentcontract,
      OFT20REWARD().abi,
      account,
    );

    await oft20RewardContractHandle
      .quoteSend(sendParams, false)
      .then((quote) => {
        console.log(quote);
      });
  });

function padding(addressToPad) {
  // Format it to bytes32
  const padding = "0x000000000000000000000000";
  return padding.concat(addressToPad.substring(2));
}

task("onft721SafeMint", "Mint nft on ONFT contract")
  .addParam("to", "Receiver of token")
  .addParam("rewardaddress", "Reward contract address")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const onft721RewardContractHandler = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      ONFT721REWARD().abi,
      account,
    );

    await onft721RewardContractHandler
      .safeMint(taskArgs.to)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("onft721OwnerOf", "Check owner of token id")
  .addParam("tokenid", "Token id")
  .addParam("rewardaddress", "Reward contract address")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const onft721RewardContractHandler = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      ONFT721REWARD().abi,
      account,
    );

    await onft721RewardContractHandler
      .ownerOf(taskArgs.tokenid)
      .then((owner) => {
        console.log(owner);
      });
  });

task("onft721CrossChain", "Cross chain NFT")
  .addParam("tokenid", "Token id")
  .addParam("rewardaddress", "Reward contract address")
  .addParam("destinationchainid", "Chain id of definition based on Layer Zero")
  .addParam("destinationaddress", "Address of the destimation contract")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[1];

    // attach the first signer account to the consent contract handle
    const onft721RewardContractHandler = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      ONFT721REWARD().abi,
      account,
    );

    await onft721RewardContractHandler
      .crossChain(
        taskArgs.destinationchainid,
        padding(taskArgs.destinationaddress),
        taskArgs.tokenid,
        { value: ethers.utils.parseEther("0.01") },
      )
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });
