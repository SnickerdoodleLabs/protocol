const {
  OFT20REWARD,
  ONFT721REWARD,
  crumbsContract,
  logTXDetails,
} = require("./constants.js");

task(
  "oft20SetPeer",
  "Hooks up OFT20Reward contracts on the target chains together",
)
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

task("oft20IsPeer", "Check if OFT contracts are peers")
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

    await oft20RewardContractHandle.isPeer(eid, peerContract).then((isPeer) => {
      console.log(isPeer);
    });
  });

task("oft20Mint", "Mint some tokens on the OFT contract")
  .addParam("to", "address receiving the tokens")
  .addParam("amountinethers", "amount of tokens in ethers units")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    const amount = ethers.utils.parseUnits("1.5", "ether");

    // attach the first signer account to the consent contract handle
    const oft20RewardContractHandle = new hre.ethers.Contract(
      taskArgs.currentcontract,
      OFT20REWARD().abi,
      account,
    );

    await oft20RewardContractHandle
      .mint(taskArgs.to, amount)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("oft20BalanceOf", "Get balance of token for a given address")
  .addParam("currentcontract", "The OFT20Reward contract on the current chain")
  .addParam("addresstocheck", "The address to check balance of")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const oft20RewardContractHandle = new hre.ethers.Contract(
      taskArgs.currentcontract,
      OFT20REWARD().abi,
      account,
    );

    await oft20RewardContractHandle
      .balanceOf(taskArgs.addresstocheck)
      .then((balance) => {
        console.log(balance);
      });
  });

task("oft20QuoteSend", "Get the gas price needed to call send()")
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
    const account = accounts[1];

    const sendParams = {
      dstEid: taskArgs.eid,
      to: padding(accounts[2].address),
      amountLD: hre.ethers.utils.parseUnits("1", "ether"),
      minAmountLD: hre.ethers.utils.parseUnits("1", "ether"),
      extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
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

task("oft20Send", "Initiate a cross chain message send")
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
    const account = accounts[1];

    const sendParams = {
      dstEid: taskArgs.eid,
      to: padding(accounts[2].address),
      amountLD: hre.ethers.utils.parseUnits("1", "ether"),
      minAmountLD: hre.ethers.utils.parseUnits("1", "ether"),
      extraOptions: "0x00030100110100000000000000000000000000030d40",
      composeMsg: [],
      oftCmd: [],
    };

    const messagingFee = {
      nativeFee: 4103082850149711,
      lzTokenFee: 0,
    };

    // attach the first signer account to the consent contract handle
    const oft20RewardContractHandle = new hre.ethers.Contract(
      taskArgs.currentcontract,
      OFT20REWARD().abi,
      account,
    );

    await oft20RewardContractHandle
      .send(sendParams, messagingFee, account.address, {
        value: 4103082850149711,
      })
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

task(
  "onft721SetTrustedRemoteAddress",
  "Set the trusted remote address of the target contract on the peer chain of the ONFT contract",
)
  .addParam("rewardaddress", "Reward contract address")
  .addParam("chainid", "Chain id of the target address")
  .addParam("peeraddress", "Reward contract on the peer chain")
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
      .setTrustedRemoteAddress(taskArgs.chainid, padding(taskArgs.peeraddress))
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "onft721SetTrustedRemote",
  "Set the trusted remote address of the target contract on the peer chain of the ONFT contract",
)
  .addParam("rewardaddress", "Reward contract address")
  .addParam("peeraddress", "Reward contract on the peer chain")
  .addParam("destinationchainid", "Peer chain id")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[0];

    // attach the first signer account to the consent contract handle
    const onft721RewardContractHandler = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      ONFT721REWARD().abi,
      account,
    );

    let trustedRemote = hre.ethers.utils.solidityPack(
      ["address", "address"],
      [taskArgs.peeraddress, taskArgs.rewardaddress],
    );

    await onft721RewardContractHandler
      .setTrustedRemote(taskArgs.destinationchainid, trustedRemote)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("onft721SetMinDstGas", "Set the minimum gas")
  .addParam("rewardaddress", "Reward contract address")
  .addParam("destinationchainid", "Chain id of definition based on Layer Zero")
  .addParam("packagetype", "Packet type id for the function")
  .addParam("mingas", "Minimum gas to call the contract")
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
      .setMinDstGas(
        taskArgs.destinationchainid,
        taskArgs.packagetype,
        taskArgs.mingas,
      )
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("onft721CrossChain", "Cross chain NFT")
  .addParam("rewardaddress", "Reward contract address")
  .addParam("from", "Address of the token owner")
  .addParam("to", "Address receiver of the token")
  .addParam("tokenid", "Token id")
  .addParam("destinationchainid", "Chain id of definition based on Layer Zero")
  .addParam("gas", "gas for the transaction")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[1];

    // attach the first signer account to the consent contract handle
    const onft721RewardContractHandler = new hre.ethers.Contract(
      taskArgs.rewardaddress,
      ONFT721REWARD().abi,
      account,
    );
    await onft721RewardContractHandler[
      "crossChain(address,uint16,bytes,uint256,uint256)"
    ](
      taskArgs.from,
      taskArgs.destinationchainid,
      taskArgs.to,
      taskArgs.tokenid,
      taskArgs.gas,
      { value: ethers.utils.parseUnits("0.5", "ether") },
    )
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });
