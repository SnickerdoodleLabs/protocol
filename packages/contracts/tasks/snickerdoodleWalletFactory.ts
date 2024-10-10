import { task } from "hardhat/config";

const CONTRACT_NAME = "SnickerdoodleWalletFactory";
const SNICKERDOODLE_WALLET_FACTORY =
  "0xc0bD8015F926AFD9f00B14006FD5188dB2F93789";

const KEYID = "TAp_FZMZshG7RuJhiObFTQ";
const QX = "0x2e0aa0b0dd416999b35cf3d03c2df3d4487cefae5b694aceb365efae4781eec5";
const QY = "0xb98bce418ffa0076d45cdfeac10070dc81cc9360b496e9aa1044dbca92d8493f";

task(
  "snickerdoodleWalletFactorySetPeer",
  "Hooks up SnickerdoodleWalletFactory contracts on the target chains together",
)
  .addParam("eid", "Layer Zero endpoint id for target chain")
  .addParam(
    "peercontract",
    "The SnickerdoodleWalletFactory contract on the target chain",
  )
  .addParam(
    "currentcontract",
    "The SnickerdoodleWalletFactory contract on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const eid = taskArgs.eid;
    let peerContract = taskArgs.peercontract;

    // Format it to bytes32
    const padding = "0x000000000000000000000000";
    peerContract = padding.concat(peerContract.substring(2));

    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    const txResponse = await factory.setPeer(eid, peerContract);
    const txReceipt = await txResponse.wait();

    console.log("Set peer successful!");
  });

// Looks like this is removed now
//   task("snickerdoodleWalletFactoryIsPeer", "Check if snickerdoodleWalletFactory contracts are peers")
//     .addParam("eid", "Layer Zero endpoint id for target chain")
//     .addParam("peercontract", "The snickerdoodleWalletFactory contract on the target chain")
//     .addParam("currentcontract", "The snickerdoodleWalletFactory contract on the current chain")
//     .setAction(async (taskArgs, hre) => {
//       const eid = taskArgs.eid;
//       let peerContract = taskArgs.peercontract;

//       // Formet it to bytes32
//       const padding = "0x000000000000000000000000";
//       peerContract = padding.concat(peerContract.substring(2));

//       const factory = await hre.viem.getContractAt("SnickerdoodleWalletFactory", SNICKERDOODLE_WALLET_FACTORY);
//       const isPeerCheck = await factory.read.isPeer([eid, peerContract]);
//       console.log("Is peer check:", isPeerCheck);
//     });

task(
  "deploySnickerdoodleWalletUpgradeableBeacon",
  "Deploy a Snickerdoodle wallet upgradeable beacon",
)
  .addParam("name", "name of the wallet")
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    const txResponse = await factory.deploySnickerdoodleWalletUpgradeableBeacon(
      taskArgs.name,
      taskArgs.qx,
      taskArgs.qy,
      taskArgs.keyid,
    );

    const txReceipt = await txResponse.wait();
    console.log("Smart wallet deployed!");
  });

task(
  "computeSnickerdoodleWalletProxyAddress",
  "Computes the smart wallet address prior to deployment",
)
  .addParam("name", "Name of the Proxy Vault")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    const snickerdoodleWalletAddress =
      await factory.computeSnickerdoodleWalletProxyAddress(taskArgs.name);
    console.log("Proxy Address:", snickerdoodleWalletAddress);
  });

task("getOwnerOfSnickerdoodleWallet", "Get owner of the smart wallet address")
  .addParam(
    "snickerdoodlewalletaddress",
    "The smart wallet address on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    try {
      const operatorAndPoints =
        await factory.deployedSnickerdoodleWalletAddressToOwner(
          taskArgs.snickerdoodlewalletaddress,
        );

      console.log("Operator:", operatorAndPoints[0]);
      console.log("Passkey point X:", operatorAndPoints[1]);
      console.log("Passkey point Y:", operatorAndPoints[2]);
      console.log("Passkey Id:", operatorAndPoints[3]);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "quoteClaimSnickerdoodleWalletOnDestinationChain",
  "Get the gas price needed to call _sendFactoryDeployedOnDestinationChain()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("name", "Name of the wallet")
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .addParam(
    "snickerdoodlewalletaddress",
    "The address of the smart wallet proxy contract",
  )
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    try {
      const quotePrice =
        await factory.quoteClaimSnickerdoodleWalletOnDestinationChain(
          Number(taskArgs.destinationchainid),
          taskArgs.qx,
          taskArgs.qy,
          taskArgs.keyid,
          taskArgs.snickerdoodlewalletaddress,
          Number(taskArgs.gas),
        );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "claimSnickerdoodleWalletAddressOnDestinationChain",
  "Send a message to the destination chain to claim the wallet address",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .addParam(
    "walletname",
    "The name of the wallet to be claimed on the destination chain",
  )
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteClaimSnickerdoodleWalletOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      CONTRACT_NAME,
      SNICKERDOODLE_WALLET_FACTORY,
    );

    try {
      const txResponse =
        await factory.claimSnickerdoodleWalletOnDestinationChain(
          Number(taskArgs.destinationchaineid),
          taskArgs.walletname,
          taskArgs.qx,
          taskArgs.qy,
          taskArgs.keyid,
          Number(taskArgs.gas),
          {
            value: taskArgs.feeinwei,
          },
        );

      const txReceipt = await txResponse.wait();
      console.log(
        "Wallet claimed request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

function padding(addressToPad) {
  // Format it to bytes32
  const padding = "0x000000000000000000000000";
  return padding.concat(addressToPad.substring(2));
}
