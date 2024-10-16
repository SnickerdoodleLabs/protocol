import { task } from "hardhat/config";

const SNICKERDOODLE_FACTORY_CONTRACT_NAME = "SnickerdoodleFactory";
const SNICKERDOODLE_FACTORY_PROXY =
  "0xe47D8cD2c18796342e5D56b68FCbc6fDa7c7FeD8";
const OPERATOR_GATEWAY_CONTRACT_NAME = "OperatorGateway";
const OPERATOR_GATEWAY_PROXY = "0x017288946F4c88A6c5B507292D761cc6794Fe774";

// 0xc0bD8015F926AFD9f00B14006FD5188dB2F93789
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
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
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

//       const factory = await hre.viem.getContractAt("SnickerdoodleWalletFactory", SNICKERDOODLE_FACTORY_PROXY);
//       const isPeerCheck = await factory.read.isPeer([eid, peerContract]);
//       console.log("Is peer check:", isPeerCheck);
//     });

task(
  "deployOperatorGatewayProxy",
  "Deploy a Snickerdoodle Operator gateway beacon proxy",
)
  .addParam("domain", "name operator's domain")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    // Deploy the proxy and wait for transaction confirmation
    const txResponse = await factory.deployOperatorGatewayProxy(
      taskArgs.domain,
      [owner.address],
    );

    const txReceipt = await txResponse.wait();

    console.log("Snickerdoodle Operator deployed!");
    console.log("Transaction receipt:", txReceipt);
  });

task(
  "deploySnickerdoodleWalletProxyViaOperatorGateway",
  "Deploy a Snickerdoodle wallet beacon proxy",
)
  .addParam("name", "name of the wallet")
  .addParam("qx", "X coordinate of the Passkey public key")
  .addParam("qy", "Y coordinate of the Passkey public key")
  .addParam("keyid", "Passkey id")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    // Make sure this is
    const txResponse = await factory.deploySnickerdoodleWallets(
      [taskArgs.name],
      [
        {
          x: taskArgs.qx,
          y: taskArgs.qy,
          keyId: taskArgs.keyid,
        },
      ],
      [[]],
    );

    const txReceipt = await txResponse.wait();
    console.log("Snickerdoodle wallet deployed!");
    console.log("Transaction receipt", txReceipt);
  });

task(
  "computeSnickerdoodleWalletProxyAddress",
  "Computes the snickerdoodle wallet address prior to deployment",
)
  .addParam("name", "Name of the Proxy Vault")
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    const snickerdoodleWalletAddress =
      await factory.computeSnickerdoodleWalletProxyAddress(taskArgs.name);
    console.log("Proxy Address:", snickerdoodleWalletAddress);
  });

task(
  "getOwnerOfSnickerdoodleWallet",
  "Get owner of the snickerdoodle wallet address",
)
  .addParam(
    "snickerdoodlewalletaddress",
    "The snickerdoodle wallet address on the current chain",
  )
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
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
  "quoteReserveOperatorGatewayOnDestinationChain",
  "Get the gas price needed to call ()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "domain of the operator")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const quotePrice =
        await factory.quoteReserveOperatorGatewayOnDestinationChain(
          Number(taskArgs.destinationchainid),
          taskArgs.domain,
          Number(taskArgs.gas),
        );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "reserveOperatorGatewayOnDestinationChain",
  "Send a message to the destination chain to reserve the operator domain name",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("domain", "the operator domain name")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteReserveOperatorGatewayOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const txResponse = await factory.reserveOperatorGatewayOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        taskArgs.domain,
        Number(taskArgs.gas),
        {
          value: taskArgs.feeinwei,
        },
      );

      const txReceipt = await txResponse.wait();
      console.log(
        "Operator domain reserve request submitted to destination chain! Txhash:",
        txReceipt,
      );
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "quoteReserveWalletOnDestinationChain",
  "Get the gas price needed to call _sendFactoryDeployedOnDestinationChain()",
)
  .addParam(
    "destinationchainid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("namewithdomain", "Name plus domain of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )

  .setAction(async (taskArgs, hre) => {
    // for ONFT - extraOptions: "0x00030100110100000000000000000000000000030d40", // assuming 200k gas
    // 0x0003010011010000000000000000000000000000ea60
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      SNICKERDOODLE_FACTORY_CONTRACT_NAME,
      SNICKERDOODLE_FACTORY_PROXY,
    );

    try {
      const quotePrice = await factory.quoteReserveWalletOnDestinationChain(
        Number(taskArgs.destinationchainid),
        taskArgs.namewithdomain,
        Number(taskArgs.gas),
      );

      console.log("Quoted price:", quotePrice);
    } catch (e) {
      console.log("FAILED", e);
    }
  });

task(
  "reserveWalletAddressOnDestinationChain",
  "Send a message to the destination chain to reserve the wallet address",
)
  .addParam(
    "destinationchaineid",
    "Layer Zero endpoint id for the destination chain",
  )
  .addParam("namewithdomain", "Name plus domain of the wallet")
  .addParam(
    "gas",
    "Amount of gas in wei to include in the quote to cover the function of lzReceive",
  )
  .addParam(
    "feeinwei",
    "The fees from the quoteReserveSnickerdoodleWalletOnDestinationChain call",
  )

  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;

    const factory = await ethers.getContractAt(
      OPERATOR_GATEWAY_CONTRACT_NAME,
      OPERATOR_GATEWAY_PROXY,
    );

    try {
      const txResponse = await factory.reserveWalletsOnDestinationChain(
        Number(taskArgs.destinationchaineid),
        [taskArgs.namewithdomain],
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
